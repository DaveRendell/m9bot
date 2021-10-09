import * as Discord from "discord.js"
import * as Log from "src/logging"

export default function unpinMessage(message: Discord.Message): void {
  if (!message.pinned) {
    Log.info(`Message ${message.id} is not pinned.`)
    return
  }

  if (message.reactions.resolve("📌")) {
    Log.info(`Pin removed from message id ${message.id}, but other pins still 
    remain`)
    return
  }

  Log.info(`Unpinning message ${message.content}.`)  
  message.unpin()
}
