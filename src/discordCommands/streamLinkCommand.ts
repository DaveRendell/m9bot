import { SlashCommandBuilder } from "discord.js";
import M9BotCommand from "./m9botCommand";

const streamLinkCommand: M9BotCommand = {
    data: new SlashCommandBuilder()
        .setName("stream_link")
        .setDescription("Posts a link to the Meltdown stream on twitch"),
    async execute(interation) {
        await interation.reply("Here's the stream for Meltdown, come watch Seb get bodied: https://www.twitch.tv/vgbootcamp")
    }
}

export default streamLinkCommand