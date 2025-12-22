import * as Discord from "discord.js"
import sendBirthdayMessages from "src/scheduledJobs/sendBirthdayMessages"
import { mockChannel, mockClient, mockUser } from "test/mocks/discord"
import { getMockBirthdayService } from "test/mocks/services/mockBirthdayService"

jest.mock("src/services/birthdayService")
jest.mock("src/logging")

const mockedBirthdayService = getMockBirthdayService()

const client = mockClient()

const textChannel = mockChannel({ type: Discord.ChannelType.GuildText }) as Discord.TextChannel
const nonTextChannel = mockChannel( { type: Discord.ChannelType.GuildVoice}) as Discord.VoiceChannel

const user1 = mockUser({ id: "user1" })
const user2 = mockUser({ id: "user2" })

// Doesn't actually have to match today's date for tests to pass
const birthdayDate = "1992-09-28"

beforeEach(() => {
  mockedBirthdayService.getTodaysBirthdays.mockResolvedValue([
    { userId: "user1", date: birthdayDate }
  ])
  
  jest.mocked(client.channels.cache.get).mockReturnValue(textChannel)
  jest.mocked(textChannel.guild.members.cache.get).mockReturnValue(user1)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("sendBirthdayMessages", () => {
  it("sends no messages if there are no birthdays matching today's date", async () => {
    mockedBirthdayService.getTodaysBirthdays.mockResolvedValue([])

    await sendBirthdayMessages(client)()

    expect(textChannel.send).not.toHaveBeenCalled()
  })
  it("sends no messages if there is an error fetching today's birthdays", async () => {
    mockedBirthdayService.getTodaysBirthdays.mockImplementation(() => {
      throw new Error()
    })

    await sendBirthdayMessages(client)()

    expect(textChannel.send).not.toHaveBeenCalled()
  })
  it("sends no messages if the main channel cannot be found", async () => {
    jest.mocked(client.channels.cache.get).mockReturnValue(undefined)

    await sendBirthdayMessages(client)()

    expect(textChannel.send).not.toHaveBeenCalled()
  })
  it("sends no messages if the main channel is not a text channel", async () => {
    jest.mocked(client.channels.cache.get).mockReturnValue(nonTextChannel)

    await sendBirthdayMessages(client)()

    expect(textChannel.send).not.toHaveBeenCalled()
  })
  it("sends no messages if the user ID does not match a user in the channel", async () => {
    jest.mocked(textChannel.guild.members.cache.get).mockReturnValue(undefined)

    await sendBirthdayMessages(client)()

    expect(textChannel.send).not.toHaveBeenCalled()
  })
  it("sends a birthday message if a user has a matching birthday", async () => {
    await sendBirthdayMessages(client)()

    expect(textChannel.send).toHaveBeenCalledTimes(1)
    expect(jest.mocked(textChannel.send).mock.calls[0][0]).toContain("Happy birthday <@user1>")
  })
  it("sends multiple messages if multiple users have birthdays", async () => {
    mockedBirthdayService.getTodaysBirthdays.mockResolvedValue([
      { userId: "user1", date: birthdayDate },
      { userId: "user2", date: birthdayDate },
    ])
    jest.mocked(textChannel.guild.members.cache.get).mockReturnValueOnce(user1)
    jest.mocked(textChannel.guild.members.cache.get).mockReturnValueOnce(user2)

    await sendBirthdayMessages(client)()

    expect(textChannel.send).toHaveBeenCalledTimes(2)
    expect(jest.mocked(textChannel.send).mock.calls[0][0]).toContain("Happy birthday <@user1>")
    expect(jest.mocked(textChannel.send).mock.calls[1][0]).toContain("Happy birthday <@user2>")
  })
})