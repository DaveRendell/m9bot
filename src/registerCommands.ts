import { REST, Routes } from "discord.js"
import config from "./config"
import { COMMANDS } from "./discordCommands/commands"

const rest = new REST().setToken(config.discord.token)

async function registerCommands() {
    const data: any = await rest.put(
        Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
        { body: COMMANDS.map(command => command.data.toJSON()) })
    console.log("Successfully registered commands:")
    data.forEach((entry: any) => console.log("  - " + entry.name))
}

registerCommands()
