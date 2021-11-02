import { getOrCreateSelfServiceRoleMessage, getSelfServiceRolesMessageContent } from "src/services/selfServiceRoleService"
import { mocked } from "ts-jest/utils"
import * as Discord from "discord.js"
import { getMockStaticMessageRepository } from "test/mocks/repositories/mockStaticMessageRepository"
import { getMockSelfServiceRolesRepository } from "test/mocks/repositories/mockSelfServiceRolesRepository"
import { mockChannel, mockClient, mockMessage } from "test/mocks/discord"

jest.mock("src/repositories/staticMessageRepository")
jest.mock("src/repositories/selfServiceRolesRepository")
const mockedStaticMessageRepository = getMockStaticMessageRepository()
const mockedSelfServiceRolesRepository = getMockSelfServiceRolesRepository()

const precreatedMessage = mockMessage({ id: "precreatedMessage" })
const channel = mockChannel() as Discord.TextChannel
const client = mockClient()

jest.mock("src/config", () => ({
  default: {
    discord: {
      selfServiceMessageChannelId: "4815162342"
    }
  }
}))

function setMessageId(messageId: string | null) {
  mockedStaticMessageRepository
    .getSelfServiceRoleMessageId
    .mockResolvedValue(messageId)
}

beforeEach(() => {
  jest.clearAllMocks()
  getMockStaticMessageRepository()
  getMockSelfServiceRolesRepository()
  mocked(client.channels.fetch).mockResolvedValue(channel)
  mocked(channel.send).mockResolvedValue(mockMessage({ id: "newMessage" }))
  mocked<(x: any) => Promise<Discord.Message>>(channel.messages.fetch)
    .mockResolvedValue(precreatedMessage)
})

describe("selfServiceRoleService", () => {
  describe("getOrCreateSelfServiceRoleMessage", () => {
    it("returns the Discord message if it has already been created", async () => {
      setMessageId("12345")

      const message = await getOrCreateSelfServiceRoleMessage(client)

      expect(message.id).toBe("precreatedMessage")
    })
    it("creates a new Discord message if non exists", async () => {
      setMessageId(null)

      const message = await getOrCreateSelfServiceRoleMessage(client)

      expect(message.id).toBe("newMessage")
      expect(channel.send).toHaveBeenCalled()
    })
    it("updates the static message ID when a new message is created", async () => {
      setMessageId(null)

      await getOrCreateSelfServiceRoleMessage(client)

      expect(mockedStaticMessageRepository.setSelfServiceRoleMessageId).toHaveBeenCalledWith("newMessage")
    })
  })
  describe("getSelfServiceRoleMessageContent", () => {
    it("contains custom message when no roles configured", async() => {
      mockedSelfServiceRolesRepository.getSelfServiceRoles.mockResolvedValue([])

      const content = await getSelfServiceRolesMessageContent()

      expect(content).toContain("No roles are currently configured")
    })
    it("contains role info when roles are configured", async () => {
      const content = await getSelfServiceRolesMessageContent()

      expect(content).toContain("🐧 - cool dood")
      expect(content).toContain("🍎 - apple")
    })
  })
})
