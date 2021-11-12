import setupScheduledJobs from "./schedule"
import setupDiscord from "./discord"
import * as logging from "./logging"

/**
 * Application entrypoint
 * 
 * Sets up Discord responses and scheduled jobs. See `./discord.ts` and 
 * `./schedule.ts` for more info on each respectively.
 */
logging.info("Starting up M9Bot...")
setupDiscord().then(setupScheduledJobs)
