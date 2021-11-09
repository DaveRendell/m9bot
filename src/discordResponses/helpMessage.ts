import * as Discord from "discord.js"
import config from "src/config"

export default function helpMessage(message: Discord.Message): void {
  message.reply("Hi m9. Here's some usage info:\n"
    + "- To set your birthday, message `set birthday YYYY-MM-DD`\n"
    + "- To list upcoming birthdays, message `list birthdays`"
    + "- To pin a message, react with the 📌 (`pushpin`) emoji\n"
    + `- Self assign roles to view hidden channels in <#${config.discord.selfServiceMessageChannelId}>\n`
    + `- [Admin only] Add roles users can self assign with \`add_self_service_role [tag the role here] [emoji for the role] [description]\`\n`
    + "See https://github.com/DaveRendell/m9bot for more info")
}