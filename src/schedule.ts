import * as Discord from "discord.js"
import * as nodeCron from "node-cron"
import config from "./config"
import checkSteps from "./scheduledJobs/checkSteps"
import logUsersInVoice from "./scheduledJobs/logUsersInVoice"
import sendBirthdayMessages from "./scheduledJobs/sendBirthdayMessages"
import setupSelfServiceRoleMessage from "./scheduledJobs/setupSelfServiceRoleMessage"
import uploadVoiceLog from "./scheduledJobs/uploadVoiceLog"

/**
 * Sets up jobs to run on a schedule, e.g. daily messages or other regular tasks
 */
export default function setupScheduledJobs(
  discordClient: Discord.Client
): void {
  // Jobs to run at startup
  setupSelfServiceRoleMessage(discordClient)()

  // Jobs to run on a cron schedule
  nodeCron.schedule(
    config.cron.sendBirthdayMessages, 
    sendBirthdayMessages(discordClient))
  
  nodeCron.schedule(
    config.cron.checkSteps,
    checkSteps(discordClient)
  )

  nodeCron.schedule(
    config.cron.logUsersInVoice,
    logUsersInVoice(discordClient)
  )

  nodeCron.schedule(
    config.cron.uploadVoiceLog,
    uploadVoiceLog(discordClient)
  )
}
