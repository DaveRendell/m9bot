import setBirthday from "src/discordResponses/setBirthday"
import * as Discord from "discord.js"
import { mocked } from "ts-jest/utils"
import * as birthdayService from "src/services/birthdayService"

jest.mock("src/services/birthdayService")

const mockedBirthdayService = mocked(birthdayService)

const mockReply = jest.fn()


const mockNoMemberMessage: Discord.Message = {
  member: undefined,
  reply: mockReply
} as unknown as Discord.Message

const mockBadDateMessage: Discord.Message = {
  member: { id: "user1"},
  content: "set birthday please",
  reply: mockReply
} as unknown as Discord.Message

const mockMessage: Discord.Message = {
  member: { id: "user1"},
  content: "set birthday 1995-07-12",
  reply: mockReply
} as unknown as Discord.Message

afterEach(() => {
  mockedBirthdayService.addOrUpdateBirthday.mockClear();
  mockReply.mockClear();
});

describe("setBirthday", () => {
  it("does not send a reply if the message does not have a user", () => {
    setBirthday(mockNoMemberMessage)

    expect(mockReply).not.toHaveBeenCalled()
  })
  it("replies with an error if the message contains an incorrectly formatted date", () => {
    setBirthday(mockBadDateMessage)

    expect(mockReply).toHaveBeenCalledTimes(1)
    expect(mockReply.mock.calls[0][0]).toContain("Unable to parse date")
  })
  it("replies with a stack trace if there is an error while setting the users birthday", () => {
    mockedBirthdayService.addOrUpdateBirthday.mockImplementation(() => {
      throw new Error("Error adding birthday")
    })

    setBirthday(mockMessage)

    expect(mockReply).toHaveBeenCalledTimes(1)
    expect(mockReply.mock.calls[0][0]).toContain("Error adding birthday")
  })
  it("replies with a confirmation message when the user's birthday is set successfully", () => {
    mockedBirthdayService.addOrUpdateBirthday.mockResolvedValue(undefined)

    setBirthday(mockMessage)

    expect(mockReply).toHaveBeenCalledTimes(1)
    expect(mockReply.mock.calls[0][0]).toContain("Added birthday")
  })
})