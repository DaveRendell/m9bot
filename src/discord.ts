import * as Discord from "discord.js"
import setBirthday from "./discordResponses/setBirthday"
const { token } = require("../discordToken.json")

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
  
  discordClient.login(token)
  console.log("Connected to Discord")
  return discordClient
}
