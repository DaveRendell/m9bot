import * as fs from "fs/promises"
const BIRTHDAY_FILE = "birthdays.json"

const DEFAULT_STATE: Birthday[] = []

export async function listBirthdays() {
  // Create the file if it doesn't yet exist
  await fs.access(BIRTHDAY_FILE).catch(() => 
    fs.writeFile(BIRTHDAY_FILE, JSON.stringify(DEFAULT_STATE)))
  
  const fileContents = await fs.readFile(BIRTHDAY_FILE, "utf8")
  return JSON.parse(fileContents) as Birthday[]
}

export async function addOrUpdateBirthday(birthday: Birthday): Promise<void> {
  const existingBirthdays = await listBirthdays()
  const previousBirthdayIndex = existingBirthdays.findIndex(b => 
    b.userId === birthday.userId)
  
  if (previousBirthdayIndex !== -1) {
    // Remove existing user birthday prior to adding new entry
    existingBirthdays.splice(previousBirthdayIndex, 1)
  }

  return fs.writeFile(
    BIRTHDAY_FILE,
    JSON.stringify([...existingBirthdays, birthday]))
}
