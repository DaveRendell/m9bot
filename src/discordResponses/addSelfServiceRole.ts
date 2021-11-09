import * as Discord from "discord.js"
import * as repository from "src/repositories/selfServiceRolesRepository"
import setupSelfServiceRoleMessage from "src/scheduledJobs/setupSelfServiceRoleMessage"

/**
 * Discord response to a user asking to add a new self service
 * role that users can assign to themselves.
 */
const MESSAGE_REGEX = /add_self_service_role <@&(?<roleId>.*)> (?<emoji>.*?) (?<description>.*)/

export default async function addSelfServiceRole(message: Discord.Message): Promise<void> {
  const match = MESSAGE_REGEX.exec(message.content)?.groups
  if (match) {
    const {
      roleId, emoji, description
    } = match
    if (message.member && message.member.hasPermission("ADMINISTRATOR")) {
      await repository.addSelfServiceRole({
        roleId, description, emoji
      })
      await setupSelfServiceRoleMessage(message.client)
      message.reply("Done")
      return
    }
    const attemptedRole = await (message.guild as Discord.Guild).roles.fetch(roleId)
    if (attemptedRole?.name === "Administrator") {
      message.reply("Haha, nice try")
      return
    }
    message.reply("Sorry, you do not have permission to add new roles 🙁")
  } else {
    message.reply(
      "Sorry, that's not quite right. To add a self service role "
        + "you need to be an admin, and then message:\n"
        + "add_self_service_role [tag the role here] [emoji for the role] [description]")
  }
}
