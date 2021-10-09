import { Message, MessageReaction } from "discord.js"
import unpinMessage from "src/discordResponses/unpinMessage"
jest.mock("src/logging", () => ({
  info: () => {},
  error: () => {}
}))

const mockUnPin = jest.fn()

const mockReaction = {} as unknown as MessageReaction

const pinnedMessage = {
  pinned: true,
  reactions: {
    resolve: () => null
  },
  unpin: mockUnPin
} as unknown as Message

const stillPinnedMessage = {
  pinned: true,
  reactions: {
    resolve: () => mockReaction
  },
  unpin: mockUnPin
} as unknown as Message

const unpinnedMessage = {
  pinned: false,
  reactions: {
    resolve: () => null
  },
  unpin: mockUnPin
} as unknown as Message

afterEach(() => {
  mockUnPin.mockClear()
})

describe("unpinMessage", () => {
  it("unpins a message that has had its last 📌 reaction removed", () => {
    unpinMessage(pinnedMessage)

    expect(mockUnPin).toHaveBeenCalledTimes(1)
  })
  it("does not unpin a message that has 📌 reactions remaining", () => {
    unpinMessage(stillPinnedMessage)

    expect(mockUnPin).not.toHaveBeenCalled()
  })
  it("does not unpin a message that isn't pinned", () => {
    unpinMessage(unpinnedMessage)

    expect(mockUnPin).not.toHaveBeenCalled()
  })
})