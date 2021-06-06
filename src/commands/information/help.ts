import { ApplicationCommandData, Collection, CommandInteraction, MessageEmbed } from "discord.js";

import { CommandInterface, DaClient } from "../../resources/definitions.js";
import { cols as colours } from "../../resources/colours.js";
import { emojis } from "../../resources/emojis.js";

const data = {
    name: "help",
    description: "Sender ræl om kommandoer",
    options: [
        {
            name: "kommando",
            type: "STRING",
            description: "Sender mer ræl om én kommando"
        }
    ]
}

export default data;
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, any>) {
    const { guild, user } = interaction;
    const targetCmd: string | undefined = args.get("kommando");
    const typeTable: any = { // err on 46 if not type any
        "STRING": "string",
        "INTEGER": "tall",
        "BOOLEAN": "sant/usant",
        "USER": "bruker (@/ID)",
        "CHANNEL": "kanal (@/ID)",
        "ROLE": "rolle (@/ID)",
        "MENTIONABLE": "@/ID",
    }

    interaction.defer();

    if (targetCmd) {
        const cmd: CommandInterface | undefined = client.commands.get(targetCmd);
        if (!cmd) return interaction.reply(`Finner ikke kommandoen i ${guild?.name}`, { allowedMentions: { repliedUser: false }, ephemeral: true })

        const commandData: ApplicationCommandData = cmd.default;
        const optionsMap: string | undefined = commandData.options?.map(opt => opt.required ? opt.name : `<${opt.name}>`).join(", ");

        const oneCmdEmbed = new MessageEmbed()
        .setTitle(`**${commandData.name.toUpperCase()}** (${guild})`)
        .setColor(colours.yellow)
        .setDescription(`${commandData.description}\n\`/${commandData.name.toLowerCase()} ${optionsMap}\``);
        
        commandData.options?.forEach(option => {
            const title: string = option.required ? `${emojis.double_right_g} ${option.name}` : `${emojis.double_right_y} <${option.name}>`;
            const content: string = `${option.description}\n*${typeTable[option.type]}*`;

            oneCmdEmbed.addField(title, content);
        });

        interaction.editReply({ embeds: [oneCmdEmbed] });
    }
    
    else {
        
        const allCmdsEmbed = new MessageEmbed()
        .setTitle(`**Kommandoer** (${guild})`)
        .setColor(colours.yellow)
        .setAuthor(user.tag, user.displayAvatarURL());
        
        const getCategoryString = (category: string): string => {
            const knownCategoryTable = new Map({
                "information": "ehh #stalker much ROFL",
                "moderation" : "karen da #managre",
                "other"      : "xD YDDCD (ya do da command doe) ROFL"
            });
            }

            knownCategoryTable[category] || category.toUpperCase()
        }

        const allCategories: Set<string> = new Set(client.commands.map(cmd => cmd.category));
        allCategories.forEach((category: string) => {
            const cmds = client.commands
                         .filter(cmd => cmd.category === category)
                         .array()
                         .map((cmd, i) => `\`${i+1 < 10 ? "0"+(i+1) : i+1}\` ${cmd.default.name}`);
            allCmdsEmbed.addField(, cmds.join("\n"));
        });
        
        interaction.editReply({ embeds: [allCmdsEmbed] });
    }
};

/*

    /NAME OPTIONS1 OPTIONS2
    * R Options 1 (TYPE) - DESCRIPTION
    * Options 2 (TYPE) - DESCRIPTION

Collection(3) [Map] {
  'help' => [Module: null prototype] {
    default: {
      name: 'help',
      description: 'sender ræl om kommandoer',
      options: [Array]
    },
    run: [AsyncFunction: run]
  },
  'say' => [Module: null prototype] {
    default: { name: 'say', description: 'halalutrrh', options: [Array] },
    run: [AsyncFunction: run]
  },
  'prune' => [Module: null prototype] {
    default: {
      name: 'prune',
      description: 'slett halalutrrh',
      options: [Array]
    },
    run: [AsyncFunction: run]
  }
}
*/
