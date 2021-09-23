import * as nodeCron from "node-cron"
import * as Discord from "discord.js"
const { token } = require("../discordToken.json")

const discordClient = new Discord.Client()

discordClient.on("message", async (message: Discord.Message) => {
  if (message.content.startsWith("add birthday")) {
    console.log(message.member?.id)
    console.log(message.content.split(" ")[2])
  }
})

discordClient.login(token)
console.log("Connected to Discord")
