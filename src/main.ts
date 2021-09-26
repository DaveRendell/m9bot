import * as nodeCron from "node-cron"
import * as Discord from "discord.js"
import { addOrUpdateBirthday, getTodaysBirthdays } from "./services/birthdayService"
import { NINE_AM_DAILY_CRON_STRING } from "./config"
const { token, mainChannelId } = require("../discordToken.json")

const discordClient = new Discord.Client()

discordClient.on("message", async (message: Discord.Message) => {
  if (message.content.startsWith("add birthday")) {
    const userId = message.member?.id
    if (userId === undefined) {
      return
    }

    const dateString = message.content.split(" ")[2]
    const dateTimestamp = Date.parse(dateString)

    if (isNaN(dateTimestamp)) {
      message.reply(`Unable to parse date ${dateString}. `
      + `Please use the format YYYY-MM-DD`)
      return
    }

    try {
      addOrUpdateBirthday(userId, new Date(dateTimestamp))
    } catch (e) {
      message.reply("Error adding birthday: " + e)
    }

    message.reply(`Added birthday ${dateString}`)
  }
})

discordClient.login(token)
console.log("Connected to Discord")

nodeCron.schedule(NINE_AM_DAILY_CRON_STRING, async () => {
  console.log("Checking for birthdays...")
  const todaysBirthdays = await getTodaysBirthdays()

  console.log(`Found ${todaysBirthdays.length} birthday(s) today.`)

  todaysBirthdays.forEach(birthday => {
    console.log("Sending birthday message for user " + birthday.userId)
    const channel = discordClient.channels.cache.get(mainChannelId)

    

    if (channel === undefined || !channel?.isText) {
      console.log(`Unable to connect to channel ID ${mainChannelId}, `
        + `birthday message not posted.`)
    } else {
      const textChannel = channel as Discord.TextChannel
      const user = textChannel.guild.members.cache.get(birthday.userId)
      console.log(textChannel.guild.members.cache.values())

      if (user === undefined) {
        console.log("Unable to find user with ID " + birthday.userId)
        return
      }

      const birthdayMessage = `Happy birthday <@${user.id}>! 🥳🎉🎊`
      textChannel.send(birthdayMessage)
    }
  })
})
