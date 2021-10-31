import * as Discord from "discord.js"
import removeRole from "src/discordResponses/removeRole"
import SelfServiceRole from "src/models/selfServiceRole"
import * as selfServiceRolesRepository from "src/repositories/selfServiceRolesRepository"
import { mocked } from "ts-jest/utils"


jest.mock("src/repositories/selfServiceRolesRepository")
const mockSelfServiceRolesRepository = mocked(selfServiceRolesRepository)

const mockRemoveReaction = jest.fn(() => {})

function mockEmojiReaction(emoji: string): Discord.MessageReaction {
  return {
    emoji: {
      name: emoji,
    },
    remove: mockRemoveReaction
  } as unknown as Discord.MessageReaction
}

const mockRemoveRole = jest.fn(() => {})
const mockResolveId = jest.fn(() => undefined as Discord.Role | undefined)

const mockUser = {
  roles: {
    resolveID: mockResolveId,
    remove: mockRemoveRole
  }
} as unknown as Discord.GuildMember

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

beforeEach(() => {
  jest.resetAllMocks()
  mockSelfServiceRolesRepository.getSelfServiceRoles.mockResolvedValue(EXAMPLE_ROLES)
})

describe("removeRole", () => {
  it("removes the user's role if they have it assigned", async () => {
    mockResolveId.mockReturnValue({id: "1234"} as unknown as Discord.Role)

    await removeRole(mockEmojiReaction("🐧"), mockUser)

    expect(mockRemoveRole).toBeCalledWith("1234")
  })
  it("does nothing if the user doesn't have the role in question", async () => {
    await removeRole(mockEmojiReaction("🐧"), mockUser)

    expect(mockRemoveRole).not.toHaveBeenCalled()
  })
})
