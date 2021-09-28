import * as Discord from "discord.js"
import { DISCORD_TOKEN } from "./config"
import setBirthday from "./discordResponses/setBirthday"

/**
 * Sets up the discord client, including setting responses to messages and other
 * user interactions.
 */
export default function setupDiscord(): Discord.Client {
  const discordClient = new Discord.Client()

  discordClient.on("message", (message: Discord.Message) => {
    if (message.content.startsWith("set birthday")) {
      setBirthday(message)
    }
  })
  
  discordClient.login(DISCORD_TOKEN)
  console.log("Connected to Discord")
  return discordClient
}
