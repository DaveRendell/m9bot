import * as Discord from "discord.js"
import * as fs from "fs"
import reportErrors from "src/discordResponses/reportError"
import config from "../config"

/**
 * Logs what users are in voice channels.
 */
function logUsersInVoice(
  discordClient: Discord.Client
): () => Promise<void> {
  return async () => {
    discordClient.guilds.cache.forEach(logGuildUsersInVoice)
  }
}

async function logGuildUsersInVoice(guild: Discord.Guild): Promise<void> {
  const timeStamp = new Date().toISOString()
  const voiceChannels = guild.channels.cache.filter(c => c.type === "voice") as Discord.Collection<string, Discord.VoiceChannel>

  const rowEntries = voiceChannels.map(channel =>
    channel.members.size ? `${timeStamp},${channel.id},${channel.members.size}\n` : ''
  ).filter(x => x) // remove empty rows

  const stream = fs.createWriteStream(config.voiceLog.file, { flags: "a" })
  rowEntries.forEach(entry => stream.write(entry))
  stream.end()
}

export default reportErrors("Log users in voice", logUsersInVoice)
