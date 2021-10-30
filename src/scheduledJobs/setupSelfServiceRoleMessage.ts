import * as Discord from "discord.js"
import { getOrCreateSelfServiceRoleMessage } from "src/services/selfServiceRoleService"

export const MESSAGE_TEXT = "Test static message pls ignore"

/**
 * Finds or creates the self service role message, and makes sure it's
 * up to date with the expected content.
 */
export default async function setupSelfServiceRoleMessage(
  discordClient: Discord.Client
): Promise<void> {
  const message = await getOrCreateSelfServiceRoleMessage(discordClient)
  if (message.content !== MESSAGE_TEXT) {
    message.edit(MESSAGE_TEXT)
  }
  return
}
