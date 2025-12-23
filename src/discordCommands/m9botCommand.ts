import { RepliableInteraction, SlashCommandBuilder } from "discord.js";

export default interface M9BotCommand {
    data: SlashCommandBuilder,
    execute(interaction: RepliableInteraction): Promise<void>
}