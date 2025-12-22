import * as Discord from "discord.js"
import config from "./config"
import setBirthday from "./discordResponses/setBirthday"
import helpMessage from "./discordResponses/helpMessage"
import listBirthdays from "./discordResponses/listBirthdays"
import * as logging from "./logging"
import shuffleServerName from "./discordResponses/shuffleServerName"
import streamMessage from "./discordResponses/streamMessage"

/**
 * Sets up the discord client, including setting responses to messages and other
 * user interactions.
 */
export default async function setupDiscord(): Promise<Discord.Client> {
  logging.info("Creating Discord client...")
  const discordClient = new Discord.Client({
    intents: [
      Discord.GatewayIntentBits.Guilds,
		  Discord.GatewayIntentBits.GuildMessages,
		  Discord.GatewayIntentBits.MessageContent,
		  Discord.GatewayIntentBits.GuildMembers,
    ]
  })

  discordClient.on("message", (message: Discord.Message) => {
    if (message.content.startsWith("set birthday")) {
      setBirthday(message)
    }

    if (message.content === "list birthdays") {
      listBirthdays(message)
    }

    if (message.content.startsWith("m9bot help")) {
      helpMessage(message)
    }

    if (message.content.startsWith("m9bot shuffle!")) {
      shuffleServerName(message)
    }

    if (message.content.startsWith("m9bot stream")) {
      streamMessage(message)
    }
  })
  
  logging.info("Logging in to Discord...")
  await discordClient.login(config.discord.token)
  logging.info("Done")

  logging.info("Connected to Discord")
  return discordClient
}
