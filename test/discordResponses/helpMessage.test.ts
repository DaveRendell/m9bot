import helpMessage from "src/discordResponses/helpMessage"
import { mockMessage } from "test/mocks/discord"
import { mocked } from "ts-jest/utils"

const message = mockMessage()

describe("helpMessage", () => {
  it("replies to the message with usage information", () => {
    helpMessage(message)

    expect(mocked(message.reply)).toHaveBeenCalledTimes(1)
  })
})
