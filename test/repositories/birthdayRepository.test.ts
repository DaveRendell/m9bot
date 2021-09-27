import * as fs from "fs"
import { BIRTHDAY_FILE } from "src/config"
import { getBirthdays, setBirthdays } from "src/repositories/birthdayRepository"
import Birthday from "src/models/birthday"

jest.mock("src/config", () => ({
  BIRTHDAY_FILE: "birthdays.test.json"
}))

function birthdayFileExists(): boolean {
  return fs.existsSync(BIRTHDAY_FILE)
}

afterEach(() => {
  fs.unlinkSync(BIRTHDAY_FILE)
})

const EXAMPLE_BIRTHDAYS: Birthday[] = [
  { userId: "user1", date: "1990-01-01" },
  { userId: "user2", date: "2003-05-12" },
  { userId: "user3", date: "1997-10-04" },
]

describe("birthdayRepository", ()=> {
  describe("getBirthdays", () => {
    it("returns empty list when birthday file is not created", async () => {
      const birthdays = await getBirthdays()
      expect(birthdays).toStrictEqual([])
    })
    
    it("creates the birthday file if called when it does not exist", async () => {
      await getBirthdays()
      expect(birthdayFileExists()).toBe(true)
    })

    it("returns the list of birthdays stored in the birthday file", async () => {
      await setBirthdays(EXAMPLE_BIRTHDAYS)

      const birthdays = await getBirthdays()

      expect(birthdays).toEqual(EXAMPLE_BIRTHDAYS)
    })
  }),
  describe("setBirthdays", () => {
    it("overwrites existing birthday file", async () => {
      await setBirthdays([])

      setBirthdays(EXAMPLE_BIRTHDAYS)

      expect(await getBirthdays()).toEqual(EXAMPLE_BIRTHDAYS)
    })
  })
})


