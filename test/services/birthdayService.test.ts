import { addOrUpdateBirthday, getTodaysBirthdays, getUpcomingBirthdays } from "src/services/birthdayService"
import * as repository from "src/repositories/birthdayRepository"
import Birthday from "src/models/birthday"
import { getMockBirthdayRepository } from "test/mocks/repositories/mockBirthdayRepository"

jest.mock("src/repositories/birthdayRepository")

const mockedRepository = getMockBirthdayRepository()

function setExistingBirthdays(birthdays: Birthday[]) {
  mockedRepository.getBirthdays.mockReturnValue(Promise.resolve(birthdays))
}

beforeAll(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date(2021, 10, 10))
})

afterEach(() => {
  jest.clearAllMocks();
  getMockBirthdayRepository()
});

describe("birthdayService", () => {
  describe("addOrUpdateBirthday", () => {
    it("adds birthday to list if user has no existing birthday", async () => {
      await addOrUpdateBirthday("user1", new Date(1990, 4, 4))

      expect(repository.setBirthdays).toHaveBeenCalledWith([{
        userId: "user1",
        date: "1990-05-03"
      }])
    })
    it("replaces previous birthday if user has existing birthday", async () => {
      setExistingBirthdays([{ userId: "user1", date: "1975-01-03" }])

      await addOrUpdateBirthday("user1", new Date(1990, 4, 4))

      expect(repository.setBirthdays).toHaveBeenCalledWith([
        { userId: "user1", date: "1990-05-03" }])
    })
    it("doesn't overwrite other users birthdays", async () => {
      setExistingBirthdays([
        { userId: "user1", date: "1975-01-03" },
        { userId: "user2", date: "1975-01-03" },
      ])

      await addOrUpdateBirthday("user1", new Date(1990, 4, 4))

      expect(repository.setBirthdays).toHaveBeenCalledWith([
        { userId: "user2", date: "1975-01-03" },
        { userId: "user1", date: "1990-05-03" },   
      ])
    })
  }),
  describe("getTodaysBirthdays", () => {
    it("returns birthdays with date string matching current date", async () => {
      const currentDateString = new Date().toISOString().slice(0, 10)
      setExistingBirthdays([
        { userId: "user2", date: "1975-01-03" },
        { userId: "user1", date: "1990-05-03" },
        { userId: "user3", date: currentDateString },
        { userId: "user4", date: currentDateString },
      ])

      const birthdays = await getTodaysBirthdays()

      expect(birthdays.map(birthday => birthday.userId)).toEqual([
        "user3", "user4"
      ])
    })
    it("returns birthdays with date string matching current in previous years", async () => {
      const currentDateString = new Date().toISOString().slice(4, 10)
      setExistingBirthdays([
        { userId: "user2", date: "1975-01-03" },
        { userId: "user1", date: "1990-05-03" },
        { userId: "user3", date: "1990" + currentDateString },
        { userId: "user4", date: "1992" + currentDateString },
      ])

      const birthdays = await getTodaysBirthdays()

      expect(birthdays.map(birthday => birthday.userId)).toEqual([
        "user3", "user4"
      ])
    })
    it("does not return birthday with date string not matching current date", async () => {
      setExistingBirthdays([
        { userId: "user2", date: "1975-01-03" },
        { userId: "user1", date: "1990-05-03" },
      ])

      const birthdays = await getTodaysBirthdays()

      expect(birthdays.map(birthday => birthday.userId)).toEqual([])
    })
  })
  describe("getUpcomingBirthdays", () => {
    it("returns all birthdays", async () => {
      setExistingBirthdays([
        { userId: "user1", date: "1975-01-03" },
        { userId: "user2", date: "1990-05-03" },
      ])

      const result = await getUpcomingBirthdays()

      expect(result).toHaveLength(2)
    })
    it("returns birthdays ordered by time until next birthday", async () => {
      setExistingBirthdays([
        { userId: "user1", date: "1975-10-11" },
        { userId: "user2", date: "1990-05-09" },
      ])

      const result = await getUpcomingBirthdays()

      expect(result[0].userId).toBe("user2")
      expect(result[1].userId).toBe("user1")
    })
  })
})
