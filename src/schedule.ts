import * as Discord from "discord.js"
import * as nodeCron from "node-cron"
import { NINE_AM_DAILY_CRON_STRING } from "./config"
import sendBirthdayMessages from "./scheduledJobs/sendBirthdayMessages"

/**
 * Sets up jobs to run on a schedule, e.g. daily messages or other regular tasks
 */
export default function setupScheduledJobs(
  discordClient: Discord.Client
): void {
  nodeCron.schedule(
    NINE_AM_DAILY_CRON_STRING, 
    sendBirthdayMessages(discordClient))
}
