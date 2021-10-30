import { getOrCreateSelfServiceRoleMessage } from "src/services/selfServiceRoleService"
import * as repository from "src/repositories/staticMessageRepository"
import { mocked } from "ts-jest/utils"
import * as Discord from "discord.js"

jest.mock("src/repositories/staticMessageRepository")
const mockedRepository = mocked(repository)

const mockMessage = {
  id: "precreatedMessage"
} as unknown as Discord.Message

const mockSend = jest.fn(() => ({
  id: "newMessage"
} as unknown as Discord.Message))

const mockChannel = {
  messages: {
    fetch: jest.fn(() => Promise.resolve(mockMessage))
  },
  send: mockSend
} as unknown as Discord.Channel

const mockDiscordClient = {
  channels: {
    fetch: jest.fn(() => Promise.resolve(mockChannel))
  }
} as unknown as Discord.Client

jest.mock("src/config", () => ({
  default: {
    discord: {
      selfServiceMessageChannelId: "4815162342"
    }
  }
}))

function setMessageId(messageId: string | null) {
  mockedRepository
    .getSelfServiceRoleMessageId
    .mockResolvedValue(messageId)
}

describe("selfServiceRoleService", () => {
  describe("getOrCreateSelfServiceRoleMessage", () => {
    it("returns the Discord message if it has already been created", async () => {
      setMessageId("12345")

      const message = await getOrCreateSelfServiceRoleMessage(mockDiscordClient)

      expect(message.id).toBe("precreatedMessage")
    })
    it("creates a new Discord message if non exists", async () => {
      setMessageId(null)

      const message = await getOrCreateSelfServiceRoleMessage(mockDiscordClient)

      expect(message.id).toBe("newMessage")
      expect(mockSend).toHaveBeenCalled()
    })
    it("updates the static message ID when a new message is created", async () => {
      setMessageId(null)

      await getOrCreateSelfServiceRoleMessage(mockDiscordClient)

      expect(mockedRepository.setSelfServiceRoleMessageId).toHaveBeenCalledWith("newMessage")
    })
  })
})
