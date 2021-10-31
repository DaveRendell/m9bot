import unpinMessage from "src/discordResponses/unpinMessage"
import { mockMessage, mockMessageReaction } from "test/mocks/discord"
import { mocked } from "ts-jest/utils"
jest.mock("src/logging")

const unpinnedMessage = mockMessage({pinned: false})
const pinnedMessage = mockMessage({pinned: true})

afterEach(() => {
  jest.clearAllMocks()
})

describe("unpinMessage", () => {
  it("unpins a message that has had its last 📌 reaction removed", () => {
    unpinMessage(pinnedMessage)

    expect(pinnedMessage.unpin).toHaveBeenCalledTimes(1)
  })
  it("does not unpin a message that has 📌 reactions remaining", () => {
    mocked(pinnedMessage.reactions.resolve)
      .mockReturnValue(mockMessageReaction())
    
    unpinMessage(pinnedMessage)

    expect(pinnedMessage.unpin).not.toHaveBeenCalled()
  })
  it("does not unpin a message that isn't pinned", () => {
    unpinMessage(unpinnedMessage)

    expect(unpinnedMessage.unpin).not.toHaveBeenCalled()
  })
})
