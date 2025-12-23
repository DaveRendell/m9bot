import * as Discord from "discord.js"

export default function helpMessage(message: Discord.Message): void {
  message.reply("Hi m9. Here's some usage info:\n"
    + "- To set your birthday, message `set birthday YYYY-MM-DD`\n"
    + "- To list upcoming birthdays, message `list birthdays`\n"
    + "- To randomise the server name, message `m9bot shuffle!`\n"
    + "See <https://github.com/DaveRendell/m9bot> for more info")
}