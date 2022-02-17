import * as Discord from "discord.js"
import config from "src/config"
import { readFile } from "fs/promises"
import reportErrors from "src/discordResponses/reportError"
import * as Log from "src/logging"

function checkSteps(
  discordClient: Discord.Client
): () => Promise<void> {
  return async () => {
    Log.info("Running check steps job")
    const stepsData = JSON.parse(await readFile(config.checkSteps.stepsFile, "utf8"))
    config.checkSteps.users.forEach(async ({emailAddress, discordId}) => {
      Log.info(`Checking steps for user ${emailAddress}`)
      const currentSteps = stepsData.steps[emailAddress] as number

      if (currentSteps < config.checkSteps.goal) {
        Log.info(`User ${emailAddress} has not met steps goal, sending message`)
        const user = await discordClient.users.fetch(discordId)
        await user.send("Check you got your steps today!").catch(Log.error)
        Log.info("Message sent")
      }
    })
  }
}

export default reportErrors("Check steps", checkSteps)