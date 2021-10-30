import * as Discord from "discord.js"
import * as repository from "src/repositories/staticMessageRepository"
import config from "src/config"
import { getSelfServiceRoles } from "src/repositories/selfServiceRolesRepository"
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

export async function getSelfServiceRolesMessageContent(): Promise<string> {
  const roles = await getSelfServiceRoles()

  if (roles.length === 0) {
    return "No roles are currently configured"
  }
  return "Respond with the corresponding emoji to be assigned a role:\n"
    + roles.map(({emoji, description}) => `${emoji} - ${description}`).join("\n") 
}
