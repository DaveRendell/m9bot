import * as Discord from "discord.js"
import config from "./config"
import setBirthday from "./discordResponses/setBirthday"
import * as Log from "src/logging"

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
  
  discordClient.login(config.discord.token)
  Log.info("Connected to Discord")
  return discordClient
}
