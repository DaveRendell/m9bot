import { getNextAnniversary } from "src/helpers/dateHelpers"

const today = new Date(2021, 6, 6)
const oneMonthAgo = new Date(2021, 5, 6)
const oneMonthFromNow = new Date(2021, 7, 6)
const manyYearsAgo = new Date(1989, 6, 3)

beforeAll(() => {
  jest.useFakeTimers()
  jest.setSystemTime(today)
})

describe("dateHelpers", () => {
  describe("getNextAnniversary", () => {
    it("returns the same date in the current year for a date in a month's time", () => {
      const result = getNextAnniversary(oneMonthFromNow)

      expect(result.getDate()).toBe(6)
      expect(result.getMonth()).toBe(7)
      expect(result.getFullYear()).toBe(2021)
    })
    it("returns the same date but next year for a date a month ago", () => {
      const result = getNextAnniversary(oneMonthAgo)

      expect(result.getDate()).toBe(6)
      expect(result.getMonth()).toBe(5)
      expect(result.getFullYear()).toBe(2022)
    })
    it("returns today for the current date", () => {
      const result = getNextAnniversary(today)

      expect(result.getDate()).toBe(6)
      expect(result.getMonth()).toBe(6)
      expect(result.getFullYear()).toBe(2021)
    })
    it("returns the right year for a date from many years ago", () => {
      const result = getNextAnniversary(manyYearsAgo)

      expect(result.getFullYear()).toBe(2022)
    })
  })
})
