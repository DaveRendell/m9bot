import { Interaction, RepliableInteraction, SlashCommandBuilder } from "discord.js"
import M9BotCommand from "./m9botCommand"

const testPingCommand: M9BotCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Test slash command"),
    async execute(interation) {
        await interation.reply("Pong!")
    }
}

export default testPingCommand