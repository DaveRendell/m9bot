import * as Discord from "discord.js"
import { MessageFlags, SlashCommandBuilder } from "discord.js";
import M9BotCommand from "./m9botCommand";
import { getUpcomingBirthdays } from "src/services/birthdayService";

const listBirthdaysCommand: M9BotCommand = {
    data: new SlashCommandBuilder()
        .setName("list_birthdays")
        .setDescription("List upcoming birthdays"),
    async execute(interaction) {
        const upcomingBirthdays = await getUpcomingBirthdays()
        
        if (upcomingBirthdays.length == 0) {
            interaction.reply(
                { 
                    content: "No birthdays have been entered so far :(. Try adding some using `set birthday YYYY-MM-DD`.",
                    flags: MessageFlags.Ephemeral,
                })
            return
        }

        const userDatePairs = upcomingBirthdays.map(({ userId, date }) => {
            const channel = interaction.channel as Discord.TextChannel
            const user = channel.members.get(userId)
            const niceDateString = new Date(date).toLocaleString(
              "en-GB", {month: "long", day: "numeric"})
            return { user, date: niceDateString }
          }).filter(({user}) => user !== undefined)
          .map(({user, date}) => ({
            name: (user as Discord.GuildMember).nickname
              || (user as Discord.GuildMember).displayName,
            date
          }))
        
          const content = "📅 Upcoming birthdays:\n"
           + userDatePairs.map(({name, date}) =>
              `${name}: ${date}`
            ).join("\n")
          interaction.reply({ content, flags: MessageFlags.Ephemeral })

    }
}

export default listBirthdaysCommand