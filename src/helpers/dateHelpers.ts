

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