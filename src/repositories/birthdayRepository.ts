import * as fs from "fs/promises"
import config from "src/config"
import Birthday from "src/models/birthday"
/**
 * Contains methods for interacting with the JSON file containing user birthdays
 */

const DEFAULT_STATE: Birthday[] = []

export async function getBirthdays(): Promise<Birthday[]> {
  // Create the file if it doesn't yet exist
  try {
    await fs.access(config.birthdayFile)
  } catch {
    await fs.writeFile(config.birthdayFile, JSON.stringify(DEFAULT_STATE))
  }
  
  const fileContents = await fs.readFile(config.birthdayFile, "utf8")
  return JSON.parse(fileContents) as Birthday[]
}

export async function setBirthdays(birthdays: Birthday[]): Promise<void> {
  fs.writeFile(config.birthdayFile, JSON.stringify(birthdays))
}
