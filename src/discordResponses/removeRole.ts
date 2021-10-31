import * as Discord from "discord.js"
import { getSelfServiceRoles } from "src/repositories/selfServiceRolesRepository"

/**
 * Removes a self assigned role from a user if the emoji matches the list
 * of self assigned roles
 */
export default async function removeRole(reaction: Discord.MessageReaction, user: Discord.GuildMember): Promise<void> {
  const allowedRoles = await getSelfServiceRoles()

  const roleId = allowedRoles.find(role => role.emoji === reaction.emoji.name)?.roleId
  if (roleId !== undefined) {
    const existingRole = user.roles.cache.get(roleId)
    if (existingRole) {
      user.roles.remove(roleId)
    }
  }
}
