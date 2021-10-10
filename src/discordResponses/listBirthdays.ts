import * as Discord from "discord.js"
import { getUpcomingBirthdays } from "src/services/birthdayService"

export default async function listBirthdays(
  message: Discord.Message,
): Promise<void> {
  const upcomingBirthdays = await getUpcomingBirthdays()

  if (upcomingBirthdays.length == 0) {
    message.reply("No birthdays have been entered so far :(. Try adding some " 
      + "using `set birthday YYYY-MM-DD`.")
    return
  }

  const userDatePairs = upcomingBirthdays.map(({ userId, date }) => {
    const channel = message.channel as Discord.TextChannel
    const user = channel.members.get(userId)
    const niceDateString = new Date(date).toLocaleString(
      "en-GB", {month: "long", day: "numeric"})
    return { user, date: niceDateString }
  }).filter(({user}) => user !== undefined)

  message.reply(`📅 Upcoming birthdays:
  ${userDatePairs.map(({user, date}) =>
    ` - ${(user as Discord.GuildMember).nickname}: ${date}`
  ).join("\n")
  }`)
}
