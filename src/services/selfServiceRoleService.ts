import * as Discord from "discord.js"
import * as repository from "src/repositories/staticMessageRepository"
import config from "src/config"
/**
 * Contains methods for controlling business logic around 
 * allowing users to self assign roles.
 */

export async function getOrCreateSelfServiceRoleMessage(discord: Discord.Client): Promise<Discord.Message> {
  const messageId = await repository.getSelfServiceRoleMessageId()
  const channel = discord
      .channels
      .cache
      .get(config.discord.selfServiceMessageChannelId) as Discord.TextChannel
  if (messageId !== null) {
    return channel.messages.cache.get(messageId) as Discord.Message
  } else {
    const message = await channel.send("Use this message to self assign yourself roles (QQ)")
    return message
  }
} 
