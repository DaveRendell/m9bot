import * as Discord from "discord.js"
import listBirthdays from "src/discordResponses/listBirthdays"
import { mocked } from "ts-jest/utils"
import Birthday from "src/models/birthday"
import * as birthdayService from "src/services/birthdayService"

jest.mock("src/services/birthdayService")

const mockedBirthdayService = mocked(birthdayService)

const mockReply = jest.fn()
const getUser = jest.fn()

const mockUser1 = { nickname: "user1" }
const mockUser2 = { nickname: "user2" }
const mockUserWithoutNickname = { displayName: "noNickNameUser" }

getUser.mockReturnValueOnce(mockUser1)
getUser.mockReturnValueOnce(mockUser2)

const message = {
  reply: mockReply,
  channel: {
    members: {
      get: getUser
    }
  }
} as unknown as Discord.Message

const birthday1: Birthday = { userId: "user1", date: "2001-02-03"}
const birthday2: Birthday = { userId: "user2", date: "2001-02-01"}
const noNickNameBirthday: Birthday = { userId: "noNick", date: "2001-02-03"}

function setReturnedBirthdays(birthdays: Birthday[]) {
  mockedBirthdayService.getUpcomingBirthdays.mockResolvedValue(
    birthdays)
}

beforeEach(() => {
  setReturnedBirthdays([])
})

afterEach(() => {
  mockReply.mockClear()
  jest.clearAllMocks()
})

describe("listBirthdays", () => {
  it("replies to the message", async () => {
    await listBirthdays(message)

    expect(mockReply).toHaveBeenCalledTimes(1)
  })
  it("says there are no birthdays if none are present", async () => {
    await listBirthdays(message)

    expect(mockReply.mock.calls[0][0]).toContain("No birthdays")
  })
  it("lists birthdays if some are returned", async () => {
    setReturnedBirthdays([birthday1, birthday2])

    await listBirthdays(message)

    expect(mockReply.mock.calls[0][0]).toContain("user1")
    expect(mockReply.mock.calls[0][0]).toContain("user2")
  })
  it("falls back to display name for users with no nickname", async () => {
    getUser.mockReturnValue(mockUserWithoutNickname)
    setReturnedBirthdays([noNickNameBirthday])

    await listBirthdays(message)

    expect(mockReply.mock.calls[0][0]).toContain(
      mockUserWithoutNickname.displayName)
  })
})
