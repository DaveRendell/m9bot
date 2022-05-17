import shuffleServerName from "src/discordResponses/shuffleServerName"
import { mockMessage } from "test/mocks/discord"
import { mocked } from "ts-jest/utils"

const message = mockMessage()

describe("shuffleServerName", () => {
  it("replies to the message with acknowledgement", () => {
    shuffleServerName(message)

    expect(mocked(message.reply)).toHaveBeenCalledTimes(1)
  })
  
  it("is not really sure how to test that the discord functionality actually works",  () => {
  })
})
