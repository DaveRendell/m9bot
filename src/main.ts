import * as nodeCron from "node-cron"
import * as Discord from "discord.js"
import { addOrUpdateBirthday } from "./services/birthdayService"
const { token } = require("../discordToken.json")

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
