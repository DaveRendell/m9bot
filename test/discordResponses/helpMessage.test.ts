import * as Discord from "discord.js"
import helpMessage from "src/discordResponses/helpMessage"

const mockReply = jest.fn()

const message = {
  reply: mockReply
} as unknown as Discord.Message

describe("helpMessage", () => {
  it("replies to the message with usage information", () => {
    helpMessage(message)

    expect(mockReply).toHaveBeenCalledTimes(1)
  })
})
