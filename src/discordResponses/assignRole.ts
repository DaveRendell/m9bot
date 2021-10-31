import * as Discord from "discord.js"
import { getSelfServiceRoles } from "src/repositories/selfServiceRolesRepository"

/**
 * Adds a role to a user if the reaction emoji matches one present in the list of
 * self service roles.
 */
export default async function assignRole(reaction: Discord.MessageReaction, user: Discord.GuildMember): Promise<void> {
  const allowedRoles = await getSelfServiceRoles()

  const roleId = allowedRoles.find(role => role.emoji === reaction.emoji.name)?.roleId
  if (roleId !== undefined) {
    const existingRole = user.roles.cache.get(roleId)
    if (!existingRole) {
      user.roles.add(roleId)
    }    
  } else {
    reaction.remove()
  }
}
