import * as Discord from "discord.js"
import config from "./config"
import * as logging from "./logging"
import { COMMANDS } from "./discordCommands/commands"
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

  discordClient.on(Discord.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) { return }
    
    const command = COMMANDS.find(m9BotCommand =>
      m9BotCommand.data.name === interaction.commandName)
    
    if (!command) {
      logging.error(`Unknown command ${interaction.commandName}.`)
      return
    }

    await command.execute(interaction)
  })
  
  logging.info("Logging in to Discord...")
  await discordClient.login(config.discord.token)
  logging.info("Done")

  logging.info("Connected to Discord")
  return discordClient
}
