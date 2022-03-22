

export function getNextAnniversary(date: Date): Date {
  const today = new Date()
  const currentYear = today.getUTCFullYear()

  const nextAnniversary = new Date(date)
  nextAnniversary.setUTCFullYear(currentYear)

  if (nextAnniversary < today) {
    nextAnniversary.setUTCFullYear(currentYear + 1)
  }
  return nextAnniversary
}

export function isToday(date: Date): boolean {
  const today = new Date()

  return date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear()
}
