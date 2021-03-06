import type {
	ApplicationCommandData,
	ApplicationCommandOptionData,
	CommandInteraction,
	Guild,
	GuildEmoji,
	GuildMember,
	TextChannel
} from "discord.js";
import { Client, Collection } from "discord.js";

import { YELLOW, GREEN, RED, BLACK, WHITE, BLURPLE, INVIS, ORANGE } from "../constants.js";
import { CommandLogger, EventLogger } from "../util/Logger.js";
import CommandManager from "../util/CommandManager.js";
import EventManager from "../util/EventManager.js";

export class DaClient extends Client {
	commands = new CommandManager();
	events = new EventManager(this);
	util = new EventLogger();

	colours = {
		blurple: BLURPLE,
		orange: ORANGE,
		yellow: YELLOW,
		black: BLACK,
		green: GREEN,
		invis: INVIS,
		white: WHITE,
		red: RED
	};

	get moji() {
		const emojis = new Collection<string, string>();

		this.emojis.cache.forEach((emoji) => {
			const mention = emoji.toString();
			const name = emoji.name;

			if (!name || !mention) return;
			emojis.set(name, mention);
		});
		//test
		return emojis;
	}

	mojis(...mojis: string[]) {
		const emojis: string[] = [];

		mojis.forEach((emoji) => {
			const fn = (em: GuildEmoji) => em.name?.toLowerCase() === emoji.toLowerCase();
			const emojiStr = this.emojis.cache.find(fn)?.toString();
			if (emojiStr) emojis.push(emojiStr);
		});

		return emojis;
	}
}

export interface Command {
	name: string;
	description: string;
	options?: ApplicationCommandOptionData[];
	data: ApplicationCommandData;
	category: string;
	run(interaction: CommandInteraction): void;
}

export interface Event {
	run(client: DaClient, ...args: unknown[]): Promise<void>;
}

export interface CmdInteraction extends CommandInteraction {
	channel: TextChannel;
	member: GuildMember;
	util: CommandLogger;
	client: DaClient;
	guild: Guild;
}
