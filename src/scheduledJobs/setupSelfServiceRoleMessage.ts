import * as Discord from "discord.js"
import { getSelfServiceRoles } from "src/repositories/selfServiceRolesRepository"
import { getOrCreateSelfServiceRoleMessage, getSelfServiceRolesMessageContent } from "src/services/selfServiceRoleService"

/**
 * Finds or creates the self service role message, and makes sure it's
 * up to date with the expected content.
 */
export default async function setupSelfServiceRoleMessage(
  discordClient: Discord.Client
): Promise<void> {
  const message = await getOrCreateSelfServiceRoleMessage(discordClient)
  const messageContent = await getSelfServiceRolesMessageContent()
  if (message.content !== messageContent) {
    message.edit(messageContent)
  }

  const roles = await getSelfServiceRoles()
  roles.map(({emoji}) => emoji).forEach(e => message.react(e))

  return
}
