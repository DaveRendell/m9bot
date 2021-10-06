import * as Discord from "discord.js"
import config from "src/config"
import Birthday from "src/models/birthday"
import { getTodaysBirthdays } from "src/services/birthdayService"
import * as Log from "src/logging"

/**
 * Scheduled job that checks for any users with birthdays today, and sends them
 * a message on the primary channel for the server.
 */
export default function sendBirthdayMessages(
  discordClient: Discord.Client
): () => Promise<void> {
  return async () => {
    Log.info("Checking for birthdays...")
    let todaysBirthdays: Birthday[]
    try {
      todaysBirthdays = await getTodaysBirthdays()
    } catch (e: unknown) {
      Log.error("Error fetching today's birthdays: ", e as Error)
      return
    }

    Log.info(`Found ${todaysBirthdays.length} birthday(s) today.`)

    todaysBirthdays.forEach(birthday => {
      Log.info("Sending birthday message for user " + birthday.userId)
      const channel = discordClient.channels.cache
        .get(config.discord.mainChannelId)

      if (channel === undefined || !channel.isText) {
        Log.error("Unable to connect to channel ID "
          + `${config.discord.mainChannelId}, birthday message not posted.`)
        return
      }

      const textChannel = channel as Discord.TextChannel
      const user = textChannel.guild.members.cache.get(birthday.userId)

      if (user === undefined) {
        Log.error("Unable to find user with ID " + birthday.userId)
        return
      }

      const birthdayMessage = `Happy birthday <@${user.id}>! 🥳🎉🎊`
      textChannel.send(birthdayMessage)
    })
  }
}
