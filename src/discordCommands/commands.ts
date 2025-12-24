import listBirthdaysCommand from "./listBirthdaysCommand";
import M9BotCommand from "./m9botCommand";
import setBirthdayCommand from "./setBirthdayCommand";
import shuffleCommand from "./shuffleCommand";
import streamLinkCommand from "./streamLinkCommand";

export const COMMANDS: M9BotCommand[] = [
    streamLinkCommand,
    setBirthdayCommand,
    listBirthdaysCommand,
    shuffleCommand,
]