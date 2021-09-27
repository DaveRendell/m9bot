import * as fs from "fs/promises"
import { BIRTHDAY_FILE } from "src/config"
import Birthday from "src/models/birthday"
/**
 * Contains methods for interacting with the JSON file containing user birthdays
 */

const DEFAULT_STATE: Birthday[] = []

export async function getBirthdays(): Promise<Birthday[]> {
  // Create the file if it doesn't yet exist
  try {
    await fs.access(BIRTHDAY_FILE)
  } catch {
    await fs.writeFile(BIRTHDAY_FILE, JSON.stringify(DEFAULT_STATE))
  }
  
  const fileContents = await fs.readFile(BIRTHDAY_FILE, "utf8")
  return JSON.parse(fileContents) as Birthday[]
}

export async function setBirthdays(birthdays: Birthday[]): Promise<void> {
  fs.writeFile(BIRTHDAY_FILE, JSON.stringify(birthdays))
}
