import setBirthdayCommand from "src/discordCommands/setBirthdayCommand"
import { expectReply } from "test/discordHelpers"
import { mockInteraction } from "test/mocks/discord"
import { getMockBirthdayService } from "test/mocks/services/mockBirthdayService"

jest.mock("src/services/birthdayService")

const mockedBirthdayService = getMockBirthdayService()

const badDateInteraction = mockInteraction({ "birthdate": "please" })

const goodInteraction = mockInteraction({ "birthdate": "1995-07-12" })

afterEach(() => {
  jest.clearAllMocks()
})

describe("setBirthday", () => {
  it("replies with an error if the message contains an incorrectly formatted date", () => {
    setBirthdayCommand.execute(badDateInteraction)

    expectReply(badDateInteraction, "Unable to parse date")
  })
  it("replies with a stack trace if there is an error while setting the users birthday", () => {
    mockedBirthdayService.addOrUpdateBirthday.mockImplementation(() => {
      throw new Error("Error adding birthday")
    })

    setBirthdayCommand.execute(goodInteraction)

    expectReply(goodInteraction, "Error adding birthday")
  })
  it("replies with a confirmation message when the user's birthday is set successfully", () => {
    mockedBirthdayService.addOrUpdateBirthday.mockResolvedValue(undefined)

    setBirthdayCommand.execute(goodInteraction)

    expectReply(goodInteraction, "Added birthday")
  })
})