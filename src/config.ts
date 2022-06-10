interface ENV {
	DISCORD_TOKEN: string | undefined;
	CLIENT_ID: string | undefined;
	LOG_CHANNEL_ID: string | undefined;
	APPROVAL_CHANNEL_ID: string | undefined;
	SCANNING_CHANNELS: string | undefined;
	MODERATOR_ROLE_IDS: string | undefined;
	REACTION_EMOTE: string | undefined;
}

interface Config {
	DISCORD_TOKEN: string;
	CLIENT_ID: string;
	LOG_CHANNEL_ID: string;
	APPROVAL_CHANNEL_ID: string;
	SCANNING_CHANNELS: {
		submission_channel_id: string;
		approved_images_channel_id:string
	}[];
	MODERATOR_ROLE_IDS: string[];
	REACTION_EMOTE: string | null;
}

const getConfig = (): ENV => {
	return {
		DISCORD_TOKEN: process.env.DISCORD_TOKEN,
		CLIENT_ID: process.env.CLIENT_ID,
		LOG_CHANNEL_ID: process.env.LOG_CHANNEL_ID,
		APPROVAL_CHANNEL_ID: process.env.APPROVAL_CHANNEL_ID,
		SCANNING_CHANNELS: process.env.SCANNING_CHANNELS,
		MODERATOR_ROLE_IDS: process.env.MODERATOR_ROLE_IDS,
		REACTION_EMOTE: process.env.REACTION_EMOTE ?? null,
	};
};

const getSanitizedConfig = (config: ENV): Config => {
	for (const [key, value] of Object.entries(config)) {
		if (value === undefined) {
			throw new Error(`Missing key ${key} in config.env`);
		}
	}
	let parsedConfig = JSON.parse(JSON.stringify(config));
	parsedConfig.SCANNING_CHANNELS = JSON.parse(config.SCANNING_CHANNELS);
	parsedConfig.MODERATOR_ROLE_IDS = JSON.parse(config.MODERATOR_ROLE_IDS);
	return parsedConfig as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export {sanitizedConfig as config};

