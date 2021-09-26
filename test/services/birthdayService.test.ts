import { addOrUpdateBirthday, getTodaysBirthdays } from "src/services/birthdayService"
import * as repository from "src/repositories/birthdayRepository"
import { mocked } from "ts-jest/utils"
import Birthday from "src/models/birthday"

jest.mock("src/repositories/birthdayRepository")

const mockedRepository = mocked(repository)

function setExistingBirthdays(birthdays: Birthday[]) {
  mockedRepository.getBirthdays.mockReturnValue(Promise.resolve(birthdays))
}

afterEach(() => {
  jest.clearAllMocks();
});

describe("birthdayService", () => {
  describe("addOrUpdateBirthday", () => {
    test("adds birthday to list if user has no existing birthday", async () => {
      setExistingBirthdays([])

      await addOrUpdateBirthday("user1", new Date(1990, 4, 4))

      expect(repository.setBirthdays).toHaveBeenCalledWith([{
        userId: "user1",
        birthday: "1990-05-03"
      }])
    })
    test("replaces previous birthday if user has existing birthday", async () => {
      setExistingBirthdays([{ userId: "user1", birthday: "1975-01-03" }])

      await addOrUpdateBirthday("user1", new Date(1990, 4, 4))

      expect(repository.setBirthdays).toHaveBeenCalledWith([
        { userId: "user1", birthday: "1990-05-03" }])
    })
    test("doesn't overwrite other users birthdays", async () => {
      setExistingBirthdays([
        { userId: "user1", birthday: "1975-01-03" },
        { userId: "user2", birthday: "1975-01-03" },
      ])

      await addOrUpdateBirthday("user1", new Date(1990, 4, 4))

      expect(repository.setBirthdays).toHaveBeenCalledWith([
        { userId: "user2", birthday: "1975-01-03" },
        { userId: "user1", birthday: "1990-05-03" },   
      ])
    })
  }),
  describe("getTodaysBirthdays", () => {
    test("returns birthdays with date string matching current date", async () => {
      const currentDateString = new Date().toISOString().slice(0, 10)
      setExistingBirthdays([
        { userId: "user2", birthday: "1975-01-03" },
        { userId: "user1", birthday: "1990-05-03" },
        { userId: "user3", birthday: currentDateString },
        { userId: "user4", birthday: currentDateString },
      ])

      const birthdays = await getTodaysBirthdays()

      expect(birthdays.map(birthday => birthday.userId)).toEqual([
        "user3", "user4"
      ])
    })
    test("does not return birthday with date string not matching current date", async () => {
      setExistingBirthdays([
        { userId: "user2", birthday: "1975-01-03" },
        { userId: "user1", birthday: "1990-05-03" },
      ])

      const birthdays = await getTodaysBirthdays()

      expect(birthdays.map(birthday => birthday.userId)).toEqual([])
    })
  })
})
