import * as Discord from "discord.js"
import config from "./config"
import setBirthday from "./discordResponses/setBirthday"
import * as Log from "src/logging"
import pinMessage from "./discordResponses/pinMessage"
import unpinMessage from "./discordResponses/unpinMessage"
import helpMessage from "./discordResponses/helpMessage"
import listBirthdays from "./discordResponses/listBirthdays"

/**
 * Sets up the discord client, including setting responses to messages and other
 * user interactions.
 */
export default async function setupDiscord(): Promise<Discord.Client> {
  const discordClient = new Discord.Client()

  discordClient.on("message", (message: Discord.Message) => {
    if (message.content.startsWith("set birthday")) {
      setBirthday(message)
    }

    if (message.content === "list birthdays") {
      listBirthdays(message)
    }

    const messageIsForAllUsers = message.content.includes("@here")
        || message.content.includes("@everyone")

    if (
      discordClient.user
      && message.mentions.has(discordClient.user)
      && !messageIsForAllUsers
    ) {
      helpMessage(message)
    }
  })

  discordClient.on("messageReactionAdd", (reaction) => {
    if (reaction.emoji.name === '📌') {
      pinMessage(reaction.message)
    }
  })

  discordClient.on("messageReactionRemove", (reaction) => {
    if (reaction.emoji.name === '📌') {
      unpinMessage(reaction.message)
    }
  })
  
  await discordClient.login(config.discord.token)
  Log.info("Connected to Discord")
  return discordClient
}
