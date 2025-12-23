import { MessageFlags, SlashCommandBuilder } from "discord.js";
import M9BotCommand from "./m9botCommand";
import { addOrUpdateBirthday } from "src/services/birthdayService";

const setBirthdayCommand: M9BotCommand = {
    data: new SlashCommandBuilder()
        .setName("set_birthday")
        .setDescription("Set your birthday so you can get wished happy birthday")
        .addStringOption(option => option
            .setName("birthdate")
            .setDescription("Your date of birth, in YYYY-MM-DD format.")
            .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.user.id
        const dateString = interaction.options.getString("birthdate")!!
        const dateTimestamp = Date.parse(dateString)

        if (isNaN(dateTimestamp)) {
            interaction.reply({
                content: `Unable to parse date ${dateString}. Please use the format YYYY-MM-DD`,
                flags: MessageFlags.Ephemeral
            })
            return
        }

        try {
            addOrUpdateBirthday(userId, new Date(dateTimestamp))
        } catch (e) {
            interaction.reply({
                content: "Error adding birthday: " + e,
                flags: MessageFlags.Ephemeral
            })
            return
        }
    
        interaction.reply({
            content: `Added birthday ${dateString}`,
            flags: MessageFlags.Ephemeral
        })
    }
}

export default setBirthdayCommand