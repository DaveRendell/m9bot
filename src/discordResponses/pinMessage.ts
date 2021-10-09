import * as Discord from "discord.js"
import * as Log from "src/logging"

export default function pinMessage(message: Discord.Message): void {
  if (message.pinned) {
    Log.info(`Message ${message.id} is already pinned.`)
    return
  }

  Log.info(`Pinning message ${message.content}.`)
  message.pin()  
}
