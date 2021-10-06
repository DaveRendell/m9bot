import * as Discord from "discord.js"
import * as nodeCron from "node-cron"
import config from "./config"
import sendBirthdayMessages from "./scheduledJobs/sendBirthdayMessages"

/**
 * Sets up jobs to run on a schedule, e.g. daily messages or other regular tasks
 */
export default function setupScheduledJobs(
  discordClient: Discord.Client
): void {
  nodeCron.schedule(
    config.cron.sendBirthdayMessages, 
    sendBirthdayMessages(discordClient))
}
