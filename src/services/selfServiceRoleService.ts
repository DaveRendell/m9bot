import * as Discord from "discord.js"
import * as repository from "src/repositories/staticMessageRepository"
import config from "src/config"
/**
 * Contains methods for controlling business logic around 
 * allowing users to self assign roles.
 */

export async function getOrCreateSelfServiceRoleMessage(discord: Discord.Client): Promise<Discord.Message> {
  const messageId = await repository.getSelfServiceRoleMessageId()
  const channel = await discord
      .channels
      .fetch(config.discord.selfServiceMessageChannelId, false, true) as Discord.TextChannel
  if (messageId !== null) {
    return await channel.messages.fetch(messageId) as Discord.Message
  } else {
    const message = await channel.send("Please wait...")
    await repository.setSelfServiceRoleMessageId(message.id)
    return message
  }
} 
