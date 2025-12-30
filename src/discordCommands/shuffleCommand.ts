import * as Discord from "discord.js"
import * as fs from "fs/promises"
import config from "src/config"
import { SlashCommandBuilder } from "discord.js";
import M9BotCommand from "./m9botCommand";

const defaultName = 'M9 Esports (bot broke)'

const shuffleCommand: M9BotCommand = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Pick a new m9 server name"),
    async execute(interaction) {
          const fileContents = await fs.readFile(config.serverNameList, "utf8")
          const serverNames = JSON.parse(fileContents) as string[]
          const randomName = serverNames[Math.floor(Math.random()*serverNames.length)] || defaultName // randomiser copied verbatim from SO; unproven, auspicious
          const capitalised = "M" + randomName.substring(1)
          await (interaction.guild as Discord.Guild).setName(`${capitalised} eSports`, `because ${(interaction.member as Discord.GuildMember).displayName || "someone"} said so`)

          interaction.reply("aight m9 let's SPIN THE WHEEL 🎱");
    },
}

export default shuffleCommand