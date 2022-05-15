import { MessageActionRow, MessageButton, Client, Message } from "discord.js";
import { config } from "../config";
import { safelySendDm } from "../functions/messaging";

const prefix = "#";


let MessageHandler =
	(client: Client) => async (message: Message) => {
		// check if message is from a bot
		if (message.author.bot) {
			return;
		} 
		if(!config.SCANNING_CHANNELS.includes(message.channel.id)){
			return;
		}

		let authorId = message.author.id;
		let attachments = message.attachments;
		//embeds, files, what else?
		if(attachments.size === 0){
			return;
		}

		let actionRow = new MessageActionRow();
		actionRow.addComponents([
			new MessageButton({
				customId : `approve_${authorId}_${message.channel.id}`,
				emoji: "✅",
				label: "Approve",
				style: "PRIMARY",
			}),
			new MessageButton({
				customId : `reject_${authorId}_${message.channel.id}`,
				emoji: "❌",
				label: "Reject",
				style: "DANGER",
			}),
		]);
		let repostMessage = {
			components:[
				actionRow
			],
			files: [...attachments.map((a) => a.attachment)],
			content:`Posted by <@${authorId}> in <#${message.channel.id}>`,
		};
		
		//get approvalChannel, send message to it
		let channel = message.guild.channels.resolve(config.APPROVAL_CHANNEL_ID);
		if(channel.isText()){
			channel.send(repostMessage);
		}
		message.delete();
		
		safelySendDm(
			message.author,
			`Your image has been received and is pending approval by the Splitgate Discord Staff team.`
		);
	};

export { MessageHandler };
