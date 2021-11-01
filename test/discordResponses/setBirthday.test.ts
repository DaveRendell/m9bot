import setBirthday from "src/discordResponses/setBirthday"
import { getMockBirthdayService } from "test/mocks/services/mockBirthdayService"
import { mockMessage, mockUser } from "test/mocks/discord"
import { mocked } from "ts-jest/utils"

jest.mock("src/services/birthdayService")

const mockedBirthdayService = getMockBirthdayService()

const noMemberMessage = mockMessage({ member: undefined })

const badDateMessage = mockMessage({
  member: mockUser({ id: "user1" }),
  content: "set birthday please"
})

const goodMessage = mockMessage({
  member: mockUser({ id: "user1" }),
  content: "set birthday 1995-07-12"
})

afterEach(() => {
  jest.clearAllMocks()
});

describe("setBirthday", () => {
  it("does not send a reply if the message does not have a user", () => {
    setBirthday(noMemberMessage)

    expect(noMemberMessage.reply).not.toHaveBeenCalled()
  })
  it("replies with an error if the message contains an incorrectly formatted date", () => {
    setBirthday(badDateMessage)

    expect(badDateMessage.reply).toHaveBeenCalledTimes(1)
    expect(mocked(badDateMessage.reply).mock.calls[0][0]).toContain("Unable to parse date")
  })
  it("replies with a stack trace if there is an error while setting the users birthday", () => {
    mockedBirthdayService.addOrUpdateBirthday.mockImplementation(() => {
      throw new Error("Error adding birthday")
    })

    setBirthday(goodMessage)

    expect(goodMessage.reply).toHaveBeenCalledTimes(1)
    expect(mocked(goodMessage.reply).mock.calls[0][0]).toContain("Error adding birthday")
  })
  it("replies with a confirmation message when the user's birthday is set successfully", () => {
    mockedBirthdayService.addOrUpdateBirthday.mockResolvedValue(undefined)

    setBirthday(goodMessage)

    expect(goodMessage.reply).toHaveBeenCalledTimes(1)
    expect(mocked(goodMessage.reply).mock.calls[0][0]).toContain("Added birthday")
  })
})
