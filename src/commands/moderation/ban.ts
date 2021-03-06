import { ApplicationCommandOptionType } from "discord-api-types";
import { MessageEmbed } from "discord.js";

import type { CmdInteraction } from "../../resources/definitions.js";
import { confirm, getDefaultChannel, permCheck } from "../../util/automaton.js";

export const data = {
	name: "ban",
	description: "Bans a member",
	options: [
		{
			name: "member",
			type: ApplicationCommandOptionType.User,
			description: "Who to ban. Takes ID and mention",
			required: true
		},
		{
			name: "reason",
			type: ApplicationCommandOptionType.String,
			description: "Reason for ban"
		},
		{
			name: "days",
			type: ApplicationCommandOptionType.Integer,
			description: "How many days to prune messages"
		},
		{
			name: "nsfw",
			type: ApplicationCommandOptionType.Boolean,
			description: "Removes the member's avatar in logs if true"
		}
	]
};

export async function run(interaction: CmdInteraction) {
	const { client, user, guild, member } = interaction;
	const err = client.moji.get("err");

	if (!guild.me) return interaction.reply({ content: "Something went wrong", ephemeral: true });

	await interaction.deferReply();

	const target = interaction.options.getUser("member", true);
	const reason = interaction.options.getString("reason") ?? undefined;
	const rawDays = interaction.options.getInteger("days") ?? 7;
	const nsfw = interaction.options.getBoolean("nsfw");

	const nsfwStr = nsfw ? `\nNSFW avatar removed from embed` : "";
	const targetMem = await guild.members.fetch(target.id).catch(() => null);

	if (targetMem) {
		const permError = permCheck("BAN_MEMBERS", guild.me, member, targetMem);
		if (permError) return interaction.editReply({ content: `${err || ""} ${permError}` });

		if (targetMem.permissions.has("BAN_MEMBERS"))
			return interaction.editReply(`${err || ""} You can't kick this user`);
	}

	const logChannel = await getDefaultChannel({ optGuild: guild, me: guild.me, type: "log" });

	const days = Math.ceil(rawDays) > 7 ? 7 : Math.ceil(rawDays) < 0 ? 0 : Math.ceil(rawDays);

	const sendBanEmbed = () => {
		const banEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.red}`)
			.setThumbnail(!nsfw ? target.displayAvatarURL({ size: 1024, dynamic: false }) : "")
			.addField("Succsessfully banned", `${target} (${target.id})`)
			.setFooter("User banned")
			.setTimestamp();

		if (reason) banEmbed.addField("Reason", reason);
		banEmbed.addField("Info", `Last ${days} days of messages pruned${nsfwStr}`);

		interaction.editReply({
			content: `Successfully banned ${target.tag} (${target.id})`,
			components: []
		});
		if (logChannel) logChannel.send({ embeds: [banEmbed] });

		interaction.util.log(`Banned ${target.tag} (${target.id})`);
	};

	const sendError = () => {
		const banErrorEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.black}`)
			.addField("Failed to ban", `${target.toString()} (${target.id})`)
			.setFooter("Ban failed")
			.setTimestamp();

		interaction.editReply({ embeds: [banErrorEmbed], content: null, components: [] });
	};

	const auditReason = `${reason ? `${reason} | ` : ""}Banned by ${user.tag} (${user.id})`;
	const query = `Are you sure you want to ban ${target.tag} (${target.id})?`;
	await confirm(interaction, query)
		.then(() => guild.bans.create(target.id, { days, reason: auditReason }).catch(sendError).then(sendBanEmbed))
		.catch(() => null);
}
