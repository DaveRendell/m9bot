import setupScheduledJobs from "./schedule"
import setupDiscord from "./discord"

/**
 * Application entrypoint
 * 
 * Sets up Discord responses and scheduled jobs. See `./discord.ts` and 
 * `./schedule.ts` for more info on each respectively.
 */

setupDiscord().then(setupScheduledJobs)
