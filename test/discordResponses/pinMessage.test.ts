import pinMessage from "src/discordResponses/pinMessage"
import { mockMessage } from "test/mocks/discord"
jest.mock("src/logging")

const unpinnedMessage = mockMessage({pinned: false})
const pinnedMessage = mockMessage({pinned: true})

describe("pinMessage", () => {
  it("pins a message that was not already pinned", async () => {
    pinMessage(unpinnedMessage)

    expect(unpinnedMessage.pin).toHaveBeenCalledTimes(1)
  })
  it("does not pin a message that was already pinned", async () => {
    pinMessage(pinnedMessage)

    expect(pinnedMessage.pin).not.toHaveBeenCalled()
  })
})
