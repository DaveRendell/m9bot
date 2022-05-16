import * as Discord from "discord.js"
import * as fs from "fs/promises"
import config from "src/config"

/**
 * Discord response to a user requesting a new server name
 */
const defaultName = 'M9 Esports (bot broke)'

export default async function shuffleServerName(
  message: Discord.Message
): Promise<void> {
  message.reply("aight m9 let's SPIN THE WHEEL 🎱");

  const fileContents = await fs.readFile(config.serverNameList, "utf8")
  const serverNames = JSON.parse(fileContents) as string[]
  const randomName = serverNames[Math.floor(Math.random()*serverNames.length)] || defaultName // randomiser copied verbatim from SO; unproven, auspicious
  await (message.guild as Discord.Guild).setName(randomName, `because ${message.member?.displayName || "someone"} said so`)
}
