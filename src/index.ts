import { readdirSync } from "fs";
import dotenv from "dotenv"
import chalk from "chalk";
dotenv.config({ path: "../.env" });

import { DaClient } from "./resources/definitions.js";


process.stdout.write("\x1Bc\n"); // clears terminal, console.clear() doesn't fully clear it


const client = new DaClient({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"] });

const getJSFiles = (dir: string, subfolder: boolean = false): Map<string, string[]> | string[] => {
    const allItemsInDir: string[] = readdirSync(dir);
    
    if (!subfolder) {
        const jsFilesInFolder = allItemsInDir.filter((filename: string) => filename.endsWith(".js"));
        return jsFilesInFolder;
    }
    
    else {
        const filesToReturn: Map<string, string[]> = new Map;

        allItemsInDir.forEach(folder => {
            const allFilesInDir = readdirSync(`${dir}/${folder}`);
            const jsFilesInFolder = allFilesInDir.filter((filename: string) => filename.endsWith(".js"));
    
            filesToReturn.set(folder, jsFilesInFolder);
        });

        return filesToReturn;
    }

}


const commandFiles = getJSFiles("./commands", true) as Map<string, string[]>;
console.log(chalk `  {grey Loading} ${commandFiles.size} {grey commands...}`);

commandFiles.forEach(async (filesInFolder: string[], folder: string) => {
    filesInFolder.forEach(async (file: string) => {
        const cmdFile = await import(`./commands/${folder}/${file}`);
        client.commands.set(cmdFile.data.name, { ...cmdFile, category: folder});
    });
});


const eventFiles = getJSFiles("./events") as string[];
console.log(chalk `  {grey Loading} ${eventFiles.length} {grey events...}\n`);

eventFiles.forEach(async (fullFileName: string) => {
    const file = await import(`./events/${fullFileName}`);
    const fileName = fullFileName.split(".")[0];

    if (!fileName) return;
    if (file) client.on(fileName, (...args: any) => file.run(client, ...args))
});


void client.login(process.env.TOKEN);