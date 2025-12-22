import * as Discord from "discord.js"
import listBirthdays from "src/discordResponses/listBirthdays"
import Birthday from "src/models/birthday"
import { getMockBirthdayService } from "test/mocks/services/mockBirthdayService"
import { mockMessage, mockUser } from "test/mocks/discord"
jest.mock("src/services/birthdayService")

const mockedBirthdayService = getMockBirthdayService()

const mockUser1 = mockUser({ nickname: "user1" })
const mockUser2 = mockUser({ nickname: "user2" })
const mockUserWithoutNickname = mockUser({ displayName: "noNickNameUser" })

const message = mockMessage()
const getMessageChannelMembers = jest.mocked(
  (message.channel as Discord.TextChannel).members.get)

const birthday1: Birthday = { userId: "user1", date: "2001-02-03"}
const birthday2: Birthday = { userId: "user2", date: "2001-02-01"}
const noNickNameBirthday: Birthday = { userId: "noNick", date: "2001-02-03"}

function setReturnedBirthdays(birthdays: Birthday[]) {
  mockedBirthdayService.getUpcomingBirthdays.mockResolvedValue(
    birthdays)
}

getMessageChannelMembers.mockReturnValueOnce(mockUser1)
getMessageChannelMembers.mockReturnValueOnce(mockUser2)

afterEach(() => {
  jest.clearAllMocks()
})

describe("listBirthdays", () => {
  it("replies to the message", async () => {
    await listBirthdays(message)

    expect(message.reply).toHaveBeenCalledTimes(1)
  })
  it("says there are no birthdays if none are present", async () => {
    await listBirthdays(message)

    expect(jest.mocked(message.reply).mock.calls[0][0]).toContain("No birthdays")
  })
  it("lists birthdays if some are returned", async () => {
    setReturnedBirthdays([birthday1, birthday2])

    await listBirthdays(message)

    expect(jest.mocked(message.reply).mock.calls[0][0]).toContain("user1")
    expect(jest.mocked(message.reply).mock.calls[0][0]).toContain("user2")
  })
  it("falls back to display name for users with no nickname", async () => {
    getMessageChannelMembers.mockReturnValue(mockUserWithoutNickname)
    setReturnedBirthdays([noNickNameBirthday])

    await listBirthdays(message)

    expect(jest.mocked(message.reply).mock.calls[0][0]).toContain(
      mockUserWithoutNickname.displayName)
  })
})
