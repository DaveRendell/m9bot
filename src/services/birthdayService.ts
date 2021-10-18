import { getBirthdays, setBirthdays } from "src/repositories/birthdayRepository"
import Birthday from "src/models/birthday"
import { getNextAnniversary } from "src/helpers/dateHelpers"
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
      date: birthdayString
    }])
}

export async function getTodaysBirthdays(): Promise<Birthday[]> {
  const todaysDate = getShortDateString(new Date())
  const birthdays = await getBirthdays()

  return birthdays.filter(({date}) => 
    date.slice(4) === todaysDate.slice(4))
}

export async function getUpcomingBirthdays(): Promise<Birthday[]> {
  const birthdays = await getBirthdays()
  const nextBirthdays = birthdays.map(({userId, date}) => ({
    userId,
    date: getShortDateString(
      getNextAnniversary(new Date(date)))
  }))

  return nextBirthdays.sort((a, b) => a.date > b.date ? 1 : -1)
}

// Returns date string in YYYY-MM-DD format
function getShortDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
