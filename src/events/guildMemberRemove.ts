import { GuildMember, MessageEmbed } from "discord.js";
import { getDefaultChannel, parseDate } from "../util/automaton.js";
import { LEAVE_PHRASES } from "../constants.js";
import { DaClient } from "../resources/definitions.js";

export async function run(client: DaClient, member: GuildMember) {
	const { guild, user } = member;
	const me = guild.me;

	const logMsg = `${user.tag} (${user.id}) left ${guild.name}`;
	client.util.log(guild, "guildMemberRemove", logMsg);

	if (!me) return;

	const channel = await getDefaultChannel({ optGuild: guild, me, type: "member_log" });
	if (!channel) return;

	const randomElement = (array: string[]) => array[Math.floor(Math.random() * array.length)];
	const msg = randomElement(LEAVE_PHRASES).replace("¤", member.displayName);

	const created = parseDate(user.createdTimestamp);
	const joined = parseDate(member.joinedTimestamp);

	const leaveEmbed = new MessageEmbed()
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(`#${client.colours.red}`)
		.setTitle(msg)
		.addField("Member", member.toString())
		.setFooter("User left")
		.setTimestamp();

	if (created) leaveEmbed.addField("Account created", created);
	if (joined) leaveEmbed.addField("Member joined", joined);

	channel.send({ embeds: [leaveEmbed] });
}
