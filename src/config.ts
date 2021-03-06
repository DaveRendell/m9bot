import { readFileSync } from "fs"

const configFile = readFileSync("config.json")

interface Config {
  serverNameList: string
  birthdayFile: string
  selfServiceRoleFile: string
  selfServiceRoleMessageFile: string
  discord: {
    token: string,
    mainChannelId: string,
    selfServiceMessageChannelId: string,
    errorLoggingChannelId: string,
    errorLoggingUserId: string
  }
  checkSteps: {
    users: { emailAddress: string, discordId: string }[]
    goal: number,
    stepsFile: string
  }
  voiceLog: {
    file: string
  }
  cron: {
    sendBirthdayMessages: string,
    checkSteps: string
    logUsersInVoice: string
  }
}

export default JSON.parse(configFile.toString()) as Config
