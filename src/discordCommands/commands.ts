import M9BotCommand from "./m9botCommand";
import setBirthdayCommand from "./setBirthdayCommand";
import streamLinkCommand from "./streamLinkCommand";
import testPingCommand from "./testPing";

export const COMMANDS: M9BotCommand[] = [
    testPingCommand,
    streamLinkCommand,
    setBirthdayCommand,
]