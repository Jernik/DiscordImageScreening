interface ENV {
	DISCORD_TOKEN: string | undefined;
	CLIENT_ID: string | undefined;
	LOG_CHANNEL_ID: string | undefined;
	APPROVAL_CHANNEL_ID: string | undefined;
	SCANNING_CHANNELS: string | undefined;
}

interface Config {
	DISCORD_TOKEN: string;
	CLIENT_ID: string;
	LOG_CHANNEL_ID: string;
	APPROVAL_CHANNEL_ID: string;
	SCANNING_CHANNELS: string[];
}

const getConfig = (): ENV => {
	return {
		DISCORD_TOKEN: process.env.DISCORD_TOKEN,
		CLIENT_ID: process.env.CLIENT_ID,
		LOG_CHANNEL_ID: process.env.LOG_CHANNEL_ID,
		APPROVAL_CHANNEL_ID: process.env.APPROVAL_CHANNEL_ID,
		SCANNING_CHANNELS: process.env.SCANNING_CHANNELS,
	};
};

const getSanitizedConfig = (config: ENV): Config => {
	for (const [key, value] of Object.entries(config)) {
		if (value === undefined) {
			throw new Error(`Missing key ${key} in config.env`);
		}
	}
	let parsedConfig = JSON.parse(JSON.stringify(config));
	parsedConfig.CATEGORY_IDS = JSON.parse(config.SCANNING_CHANNELS);
	return parsedConfig as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export {sanitizedConfig as config};

