import * as Discord from "discord.js"
import { MAIN_DISCORD_CHANNEL } from "src/config"
import Birthday from "src/models/birthday"
import { getTodaysBirthdays } from "src/services/birthdayService"

export default function sendBirthdayMessages(
  discordClient: Discord.Client
): () => Promise<void> {
  return async () => {
    console.log("Checking for birthdays...")
    let todaysBirthdays: Birthday[]
    try {
      todaysBirthdays = await getTodaysBirthdays()
    } catch (e) {
      console.log("Error fetching today's birthdays: ", e)
      return
    }

    console.log(`Found ${todaysBirthdays.length} birthday(s) today.`)

    todaysBirthdays.forEach(birthday => {
      console.log("Sending birthday message for user " + birthday.userId)
      const channel = discordClient.channels.cache.get(MAIN_DISCORD_CHANNEL)

      

      if (channel === undefined || !channel.isText) {
        console.log(`Unable to connect to channel ID ${MAIN_DISCORD_CHANNEL}, `
          + `birthday message not posted.`)
        return
      }

      const textChannel = channel as Discord.TextChannel
      const user = textChannel.guild.members.cache.get(birthday.userId)

      if (user === undefined) {
        console.log("Unable to find user with ID " + birthday.userId)
        return
      }

      const birthdayMessage = `Happy birthday <@${user.id}>! 🥳🎉🎊`
      textChannel.send(birthdayMessage)
    })
  }
}
