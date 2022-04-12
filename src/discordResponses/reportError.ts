import * as Discord from "discord.js"
import * as logging from "src/logging"
import config from "src/config"

type ScheduledJob = (discordClient: Discord.Client) => () => Promise<void>

/**
 * Transforms a scheduled job so that on a failure it posts the error message on Discord.
 */
export default function reportErrors(jobName: string, scheduledJob: ScheduledJob): ScheduledJob {
  return (discordClient: Discord.Client) => {
    const originalJob = scheduledJob(discordClient)
    return async () => {
      try {
        return await originalJob()
      } catch (e) {
        logging.error("Error during scheduled job " + jobName, e as Error)
        const channel = await discordClient.channels.fetch(config.discord.errorLoggingChannelId) as Discord.TextChannel
        const userId = config.discord.errorLoggingUserId
        channel.send(`<@${userId}>, I made an oops during scheduled job '${jobName}'.\n${e}`)
      }
    }
  }
}
