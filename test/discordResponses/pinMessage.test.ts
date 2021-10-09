import { Message } from "discord.js"
import pinMessage from "src/discordResponses/pinMessage"
jest.mock("src/logging", () => ({
  info: () => {},
  error: () => {}
}))

const mockPin = jest.fn()

const unpinnedMessage = {
  pinned: false,
  pin: mockPin
} as unknown as Message

const pinnedMessage = {
  pinned: true,
  pin: mockPin
} as unknown as Message

afterEach(() => {
  mockPin.mockClear()
})

describe("pinMessage", () => {
  it("pins a message that was not already pinned", async () => {
    pinMessage(unpinnedMessage)

    expect(mockPin).toHaveBeenCalledTimes(1)
  })
  it("does not pin a message that was already pinned", async () => {
    pinMessage(pinnedMessage)

    expect(mockPin).not.toHaveBeenCalled()
  })
})