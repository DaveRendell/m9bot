import * as Discord from "discord.js"
import sendBirthdayMessages from "src/scheduledJobs/sendBirthdayMessages"
import * as birthdayService from "src/services/birthdayService"
import { mocked } from "ts-jest/utils"

jest.mock("src/services/birthdayService")

const mockedBirthdayService = mocked(birthdayService)

const mockChannels = jest.fn()
const mockDiscordClient = {
  channels: {
    cache: {
      get: mockChannels
    }
  }
} as unknown as Discord.Client
const mockVoiceChannel = {
  isText: false
}
const mockMembers = jest.fn()
const mockSend = jest.fn()
const mockTextChannel = {
  isText: true,
  guild: {
    members: {
      cache: {
        get: mockMembers
      }
    }
  },
  send: mockSend
}
const mockUser1 = { id: "user1" }
const mockUser2 = { id: "user2" }

// Doesn't actually have to match today's date for tests to pass
const birthdayDate = "1992-09-28"


beforeEach(() => {
  mockedBirthdayService.getTodaysBirthdays.mockResolvedValue([
    { userId: "user1", date: birthdayDate }
  ])
  
  mockChannels.mockReturnValue(mockTextChannel)
  mockMembers.mockReturnValue(mockUser1)
})

afterEach(() => {
  mockChannels.mockClear()
  mockMembers.mockClear()
  mockSend.mockClear()
  mockedBirthdayService.getTodaysBirthdays.mockClear()
})

describe("sendBirthdayMessages", () => {
  it("sends no messages if there are no birthdays matching today's date", async () => {
    mockedBirthdayService.getTodaysBirthdays.mockResolvedValue([])

    await sendBirthdayMessages(mockDiscordClient)()

    expect(mockSend).not.toHaveBeenCalled()
  })
  it("sends no messages if there is an error fetching today's birthdays", async () => {
    mockedBirthdayService.getTodaysBirthdays.mockImplementation(() => {
      throw new Error()
    })

    await sendBirthdayMessages(mockDiscordClient)()

    expect(mockSend).not.toHaveBeenCalled()
  })
  it("sends no messages if the main channel cannot be found", async () => {
    mockChannels.mockReturnValue(undefined)

    await sendBirthdayMessages(mockDiscordClient)()

    expect(mockSend).not.toHaveBeenCalled()
  })
  it("sends no messages if the main channel is not a text channel", async () => {
    mockChannels.mockReturnValue(mockVoiceChannel)

    await sendBirthdayMessages(mockDiscordClient)()

    expect(mockSend).not.toHaveBeenCalled()
  })
  it("sends no messages if the user ID does not match a user in the channel", async () => {
    mockMembers.mockReturnValue(undefined)

    await sendBirthdayMessages(mockDiscordClient)()

    expect(mockSend).not.toHaveBeenCalled()
  })
  it("sends a birthday message if a user has a matching birthday", async () => {
    await sendBirthdayMessages(mockDiscordClient)()

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend.mock.calls[0][0]).toContain("Happy birthday <@user1>")
  })
  it("sends multiple messages if multiple users have birthdays", async () => {
    mockedBirthdayService.getTodaysBirthdays.mockResolvedValue([
      { userId: "user1", date: birthdayDate },
      { userId: "user2", date: birthdayDate },
    ])
    mockMembers.mockReturnValueOnce(mockUser1)
    mockMembers.mockReturnValueOnce(mockUser2)

    await sendBirthdayMessages(mockDiscordClient)()

    expect(mockSend).toHaveBeenCalledTimes(2)
    expect(mockSend.mock.calls[0][0]).toContain("Happy birthday <@user1>")
    expect(mockSend.mock.calls[1][0]).toContain("Happy birthday <@user2>")
  })
})