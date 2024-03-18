import * as Discord from "discord.js"

export default function streamMessage(message: Discord.Message): void {
  message.reply("Here's the stream for Meltdown: https://www.twitch.tv/vgbootcamp")
}