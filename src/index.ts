// Require the necessary discord.js classes
import {
	Client,
	Intents,
	Message,
	MessageComponentInteraction,
} from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

import { MessageHandler } from "./handlers/messageHandler";
import { buttonHandler } from "./handlers/buttonHandler";
import { config } from "./config";
import { safeLogCreator } from  "./functions/logging";

let token = config.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});
let _safeLog = safeLogCreator(client);

// When the client is ready, run this code (only once)
client.once("ready", () => {

	console.log('Ready!');
	
});

client.on(
	"interactionCreate",
	async (interaction: MessageComponentInteraction) => {
		if (interaction.isButton()) {
			//dispatch to button handler
			interaction.deferReply({ ephemeral: true }).then(async () => {
				try {
					await buttonHandler(interaction);
				} catch (e) {
					console.log(e);
					return interaction.editReply({
						content: "There was an error while executing this command!",
					});
				}
			});
		}
	}
);


// Login to Discord with your client's token
client.login(token);

client.on("messageCreate", async (message: Message) => {
	await MessageHandler(client)(message);
});
