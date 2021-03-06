/*
    INVITE URL
    https://discord.com/oauth2/authorize?client_id=836883384399167498&scope=bot+applications.commands
*/

import { ApplicationCommandOptionChoice } from "discord.js";

type StringObject = { [index: string]: string };

export const INTENTS_BITFIELD = 771; // GUILDS, GUILD_MEMBERS, GUILD_PRESENCES, GUILD_MESSAGES

export const CODEBLOCK_REGEX = /```(?:(?<lang>\S+)\n)?\s?(?<code>[^]+?)\s?```/;
export const CHANNEL_REGEX = /^<#\d{17,19}>$/;
export const INVITE_REGEX = /(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|(?:app)?\.com\/invite)\/(\S+)/;
export const TOKEN_REGEX = /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/;
export const USER_REGEX = /^<@!?\d{17,19}>$/;
export const ROLE_REGEX = /^<@&\d{17,19}>$/;
export const ID_REGEX = /^\d{17,19}$/;

export const BLURPLE = "5865F2";
export const ORANGE = "FF8741";
export const YELLOW = "FFC152";
export const BLACK = "000000";
export const GREEN = "5AD658";
export const INVIS = "2F3136";
export const WHITE = "FFFFFF";
export const RED = "FF5733";

export const FYELLOW = `hex("${YELLOW}")`;
export const FGREEN = `hex("${GREEN}")`;
export const FRED = `hex("${RED}")`;

export const JOIN_PHRASES = [
	"Nice to see you, ¤!",
	"Much welcome, ¤!",
	"Good morning, ¤!",
	"What's up, ¤?",
	"Hello, ¤!",
	"Hiii, ¤!"
];
export const LEAVE_PHRASES = [
	"Hope too see you soon, ¤!",
	"Until next time, ¤!",
	"See you later, ¤!",
	"Farewell, ¤!",
	"Bye bye, ¤!",
	"Adiós, ¤!"
];

export const PLATFORMS: StringObject = {
	freebsd: "FreeBSD",
	android: "Android",
	openbsd: "OpenBSD",
	darwin: "Darwin",
	win32: "Windows",
	linux: "Linux",
	sunos: "SunOS",
	aix: "AIX"
};

export const CMD_TYPES: StringObject = {
	CHANNEL: "channel (@/ID)",
	BOOLEAN: "true/false",
	MENTIONABLE: "@/ID",
	USER: "user (@/ID)",
	ROLE: "role (@/ID)",
	INTEGER: "number",
	STRING: "string"
};

export const USER_STATUS: StringObject = {
	dnd: "Do Not Disturb",
	offline: "Offline",
	online: "Online",
	idle: "Idle"
};

export const CATEGORIES: StringObject = {
	information: "Info",
	moderation: "Mod",
	config: "Config",
	util: "Util",
	help: "Help"
};

export const CONFIG_OPTION_CHOICES: ApplicationCommandOptionChoice[] = [
	{
		name: "Mute Role",
		value: "mute_role"
	},
	{
		name: "Member Log Channel",
		value: "member_log"
	},
	{
		name: "Bot Log Channel",
		value: "log"
	},
	{
		name: "Mod Role",
		value: "mod_role"
	},
	{
		name: "Embed Restrict Role",
		value: "embed_restrict"
	},
	{
		name: "Emoji Restrict Role",
		value: "emoji_restrict"
	},
	{
		name: "Reaction Restrict Role",
		value: "reaction_restrict"
	},
	{
		name: "Bot Restrict Role",
		value: "bot_restrict"
	}
];

export const CONFIG_OPTION_INFO: { [index: string]: { type: string; reg: RegExp } } = {
	reaction_restrict: { type: "ROLE", reg: ROLE_REGEX },
	embed_restrict: { type: "ROLE", reg: ROLE_REGEX },
	emoji_restrict: { type: "ROLE", reg: ROLE_REGEX },
	bot_restrict: { type: "ROLE", reg: ROLE_REGEX },
	member_log: { type: "CHANNEL", reg: CHANNEL_REGEX },
	mute_role: { type: "ROLE", reg: ROLE_REGEX },
	log: { type: "CHANNEL", reg: CHANNEL_REGEX }
};

export const CONFIG_METHOD_CHOICES: ApplicationCommandOptionChoice[] = [];

export type RESTRICTIONS_STR = "mute" | "embed" | "emoji" | "reaction" | "bot";
export const RESTRICTIONS_BIT: { [index: string]: number } = {
	mute: 1 << 0,
	embed: 1 << 1,
	emoji: 1 << 2,
	reaction: 1 << 3,
	bot: 1 << 4
};

export const RESTRICTIONS = Object.keys(RESTRICTIONS_BIT);
