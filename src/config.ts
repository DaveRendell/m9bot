import configFile = require("../config.json")

interface Config {
  birthdayFile: string
  discord: {
    token: string,
    mainChannelId: string
  },
  cron: {
    sendBirthdayMessages: string
  }
}

export default configFile as unknown as Config
