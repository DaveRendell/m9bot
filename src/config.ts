import configFile = require("src/../config.json")

interface Config {
  birthdayFile: string
  selfServiceRoleFile: string
  selfServiceRoleMessageFile: string
  discord: {
    token: string,
    mainChannelId: string,
    selfServiceMessageChannelId: string
  },
  cron: {
    sendBirthdayMessages: string
  }
}

export default configFile as unknown as Config
