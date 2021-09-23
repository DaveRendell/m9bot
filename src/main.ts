import * as nodeCron from "node-cron"
import * as discord from "discord.js"
const { token } = require("../discordToken.json")

const discordClient = new discord.Client()

discordClient.login(token)
