import { ChatInputCommandInteraction, SharedSlashCommand } from "discord.js";

export default interface M9BotCommand {
    data: SharedSlashCommand,
    execute(interaction: ChatInputCommandInteraction): Promise<void>
}