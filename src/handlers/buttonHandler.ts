import { Message } from "discord.js";
import {
	GuildMember,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
} from "discord.js";
import { config } from "../config";
import { safelySendDm } from "../functions/messaging";

let buttonHandler = async (
	interaction: MessageComponentInteraction
) => {
	console.log(interaction.customId);
	//determine button type
	let buttonType = interaction.customId.split("_")[0];
	if (buttonType === "approve") {
		await handleApproveButton(interaction);
	} else if (buttonType === "reject") {
		await handleRejectButton(interaction);
	}
};

async function handleApproveButton(
	interaction: MessageComponentInteraction
) {
	let moderator: GuildMember;
	if (interaction.member instanceof GuildMember) {
		moderator = interaction.member;
	} else {
		const found = interaction.guild.members.resolve(this.interaction.user?.id);
		if (found) moderator = found;
	}
	if (moderator) {
		let roles = Array.from(moderator.roles.cache.entries());
		// is the user clicking the button allowed to approve images?
		if (roles.map((r) => r[0]).filter((value) => config.MODERATOR_ROLE_IDS.includes(value)).length === 0) {
			interaction.editReply({
				content: `You are not authorized to approve or reject images. (Error 1003)`,
			});
			return;
		}
		let requestingUserId = interaction.customId.split("_")[1];
		let requestedChannelId = interaction.customId.split("_")[2];
		let messageChannel = interaction.guild.channels.resolve(interaction.channelId);
		let message:Message;
		if (messageChannel.isText()) {
			message = messageChannel.messages.resolve(interaction.message.id);
		}
		let attachments = message.attachments;

		let repostMessage = {
			files: [...attachments.map((a) => a.attachment)],
			content:`Posted by <@${requestingUserId}>`,
		};
		// get channel
		let channel = interaction.guild.channels.resolve(requestedChannelId);
		if (channel.isText()) {
			let postedMessage = await channel.send(repostMessage);
			postedMessage.react("974987112808071178");
		} else{
			return;
		}
		// repost image w/attachment and attribution

		// update ApprovalChannel listing with approval status and remove buttons
		message.edit({
			content: `Posted by <@${requestingUserId}> in <#${requestedChannelId}> Approved by <@${moderator.id}>`,
			components:[]
		});
		interaction.editReply({
			content: `Approved!`,
		});
	} else {
		interaction.editReply({
			content: `Error processing command. (Error 1002)`,
		});
		console.log(
			`unable to locate member object for id ${interaction?.user?.id}`
		);
	}
}


async function handleRejectButton(interaction: MessageComponentInteraction) {
	let moderator: GuildMember;
	if (interaction.member instanceof GuildMember) {
		moderator = interaction.member;
	} else {
		const found = interaction.guild.members.resolve(this.interaction.user?.id);
		if (found) moderator = found;
	}
	if (moderator) {
		let roles = Array.from(moderator.roles.cache.entries());
		console.log(
			roles
				.map((r) => r[0])
				.filter((value) => config.MODERATOR_ROLE_IDS.includes(value))
		);
		// is the user clicking the button allowed to approve images?
		if (
			roles
				.map((r) => r[0])
				.filter((value) => config.MODERATOR_ROLE_IDS.includes(value)).length ===
			0
		) {
			interaction.editReply({
				content: `You are not authorized to approve or reject images. (Error 1003)`,
			});
			return;
		}
		let requestingUserId = interaction.customId.split("_")[1];
		let requestedChannelId = interaction.customId.split("_")[2];
		// DM user that their image was rejected
		safelySendDm(interaction.guild.members.resolve(requestingUserId), `Your image was not accepted`);
		
		// update ApprovalChannel listing with approval status and remove buttons
		let messageChannel = interaction.guild.channels.resolve(
			interaction.channelId
		);
		let message: Message;
		if (messageChannel.isText()) {
			message = messageChannel.messages.resolve(interaction.message.id);
		}
		message.edit({
			content: `Posted by <@${requestingUserId}> in channel <#${requestedChannelId}> Rejected by <@${moderator.id}>`,
			components: [],
		});
		
		interaction.editReply({
			content: `Rejected!`,
		});
	} else {
		interaction.editReply({
			content: `Error processing command. (Error 1002)`,
		});
		console.log(
			`unable to locate member object for id ${interaction?.user?.id}`
		);
	}
}



export { buttonHandler };