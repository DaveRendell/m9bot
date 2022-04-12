import * as Discord from "discord.js"
import config from "../config"
import { readFile, unlink } from "fs/promises"
import { GoogleSpreadsheet } from "google-spreadsheet"
import * as Log from "src/logging"
import reportErrors from "src/discordResponses/reportError"

/**
 * Uploads the voice log to Google Sheets, then deletes the local file
 */
function uploadVoiceLog(
  discordClient: Discord.Client
): () => Promise<void> {
  return async () => {
    const rows = await getRows(discordClient)
    const doc = new GoogleSpreadsheet(config.voiceLog.sheetId)
    await doc.useServiceAccountAuth({
      client_email: config.google.clientEmail,
      private_key: config.google.privateKey,
    })
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    Log.info(`Loaded sheet ${sheet.title}`)
    Log.info(`Uploading ${rows.length} voice log entries...`)
    await sheet.addRows(rows.map(({time, channelName, usersCount}) => ({time, channelName, usersCount})))
    Log.info(`Upload complete`)
    unlink(config.voiceLog.file)
  }
}

interface VoiceLogRow {
  time: string
  channelName: string
  usersCount: number
}

function getRowFromLogLine(logLine: string, discord: Discord.Client): VoiceLogRow {
  const [a, b, c] = logLine.split(',')
  const channel = discord.channels.cache.get(b)
  const channelName = channel
    ? channel.type === "voice" ? (channel as Discord.VoiceChannel).name : ""
    : ""
  return {
    time: a,
    channelName: channelName,
    usersCount: parseInt(c)
  }
}

async function getRows(discord: Discord.Client): Promise<VoiceLogRow[]> {
  const fileContents = await readFile(config.voiceLog.file, "utf-8")
  return fileContents
    .split("\n")
    .filter(x => x) // remove blank end line
    .map(line => getRowFromLogLine(line, discord))
}

export default reportErrors("Upload voice log", uploadVoiceLog)