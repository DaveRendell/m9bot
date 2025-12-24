import Birthday from "src/models/birthday"
import { mockUser, mockMessage, mockInteraction } from "test/mocks/discord"
import { getMockBirthdayService } from "test/mocks/services/mockBirthdayService"
import * as Discord from "discord.js"
import listBirthdaysCommand from "src/discordCommands/listBirthdaysCommand"
import { expectReply } from "test/discordHelpers"

jest.mock("src/services/birthdayService")

const mockedBirthdayService = getMockBirthdayService()

const mockUser1 = mockUser({ nickname: "user1" })
const mockUser2 = mockUser({ nickname: "user2" })
const mockUserWithoutNickname = mockUser({ displayName: "noNickNameUser" })

const interaction = mockInteraction({})
const getMessageChannelMembers = jest.mocked(
  (interaction.channel as Discord.TextChannel).members.get)

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

describe("listBirthdaysCommand", () => {
    it("replies to the message", async () => {
        await listBirthdaysCommand.execute(interaction)
    
        expect(interaction.reply).toHaveBeenCalledTimes(1)
      })
      it("says there are no birthdays if none are present", async () => {
        await listBirthdaysCommand.execute(interaction)
    
        expectReply(interaction, "No birthdays")
      })
      it("lists birthdays if some are returned", async () => {
        setReturnedBirthdays([birthday1, birthday2])
    
        await listBirthdaysCommand.execute(interaction)
    
        expectReply(interaction, "user1")
        expectReply(interaction, "user2")
      })
      it("falls back to display name for users with no nickname", async () => {
        getMessageChannelMembers.mockReturnValue(mockUserWithoutNickname)
        setReturnedBirthdays([noNickNameBirthday])
    
        await listBirthdaysCommand.execute(interaction)
    
        expectReply(interaction, mockUserWithoutNickname.displayName)
      })
})