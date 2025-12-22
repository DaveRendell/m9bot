import helpMessage from "src/discordResponses/helpMessage"
import { mockMessage } from "test/mocks/discord"

const message = mockMessage()

describe("helpMessage", () => {
  it("replies to the message with usage information", () => {
    helpMessage(message)

    expect(jest.mocked(message.reply)).toHaveBeenCalledTimes(1)
  })
})
