import * as fs from "fs/promises"
import { BIRTHDAY_FILE } from "src/config"

const DEFAULT_STATE: Birthday[] = []

export async function getBirthdays(): Promise<Birthday[]> {
  // Create the file if it doesn't yet exist
  await fs.access(BIRTHDAY_FILE).catch(() => 
    fs.writeFile(BIRTHDAY_FILE, JSON.stringify(DEFAULT_STATE)))
  
  const fileContents = await fs.readFile(BIRTHDAY_FILE, "utf8")
  return JSON.parse(fileContents) as Birthday[]
}

export async function setBirthdays(birthdays: Birthday[]): Promise<void> {
  fs.writeFile(BIRTHDAY_FILE, JSON.stringify(birthdays))
}
