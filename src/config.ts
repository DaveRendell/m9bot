import { readFileSync } from "fs"

const configFile = readFileSync("config.json")

interface Config {
  birthdayFile: string
  selfServiceRoleFile: string
  selfServiceRoleMessageFile: string
  discord: {
    token: string,
    mainChannelId: string,
    selfServiceMessageChannelId: string,
    errorLoggingChannelId: string,
    errorLoggingUserId: string
  },
  cron: {
    sendBirthdayMessages: string
  }
}

export default JSON.parse(configFile.toString()) as Config
