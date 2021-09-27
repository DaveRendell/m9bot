import { getBirthdays, setBirthdays } from "src/repositories/birthdayRepository"
import Birthday from "src/models/birthday"
/**
 * Contains functions containing business logic around user's birthdays
 */

export async function addOrUpdateBirthday(
  userId: string,
  date: Date
): Promise<void> {
  const existingBirthdays = await getBirthdays()
  const birthdayString = getShortDateString(date)

  await setBirthdays([
    ...existingBirthdays.filter(birthday => birthday.userId !== userId),
    {
      userId,
      birthday: birthdayString
    }])
}

export async function getTodaysBirthdays(): Promise<Birthday[]> {
  const todaysDate = getShortDateString(new Date())
  const birthdays = await getBirthdays()

  return birthdays.filter(({birthday}) => 
    birthday.slice(4) === todaysDate.slice(4))
}

// Returns date string in YYYY-MM-DD format
function getShortDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}