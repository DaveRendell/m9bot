import { getOrCreateSelfServiceRoleMessage, getSelfServiceRolesMessageContent } from "src/services/selfServiceRoleService"
import * as staticMessageRepository from "src/repositories/staticMessageRepository"
import * as selfServiceRolesRepository from "src/repositories/selfServiceRolesRepository"
import { mocked } from "ts-jest/utils"
import * as Discord from "discord.js"
import SelfServiceRole from "src/models/selfServiceRole"

jest.mock("src/repositories/staticMessageRepository")
jest.mock("src/repositories/selfServiceRolesRepository")
const mockedStaticMessageRepository = mocked(staticMessageRepository)
const mockedSelfServiceRolesRepository = mocked(selfServiceRolesRepository)

const EXAMPLE_ROLES: SelfServiceRole[] = [
  {
    "emoji": "🐧",
    "roleId": "1234",
    "description": "cool dood"
  },
  {
    "emoji": "🍎",
    "roleId": "5678",
    "description": "apple"
  }
]

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
  mockedStaticMessageRepository
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
      mockedSelfServiceRolesRepository.getSelfServiceRoles.mockResolvedValue(EXAMPLE_ROLES)
      
      const content = await getSelfServiceRolesMessageContent()

      expect(content).toContain("🐧 - cool dood")
      expect(content).toContain("🍎 - apple")
    })
  })
})
