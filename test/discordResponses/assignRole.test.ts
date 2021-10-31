import * as Discord from "discord.js"
import assignRole from "src/discordResponses/assignRole"
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

const mockAddRole = jest.fn(() => {})
const mockResolveId = jest.fn(() => undefined as Discord.Role | undefined)

const mockUser = {
  roles: {
    resolveID: mockResolveId,
    add: mockAddRole
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

describe("assignRole", () => {
  it("adds the role to the user if they don't already have it", async () => {
    await assignRole(mockEmojiReaction("🐧"), mockUser)

    expect(mockAddRole).toBeCalledWith("1234")
  })
  it("does nothing if the user is already assigned that role", async () => {
    mockResolveId.mockReturnValue({id: "1234"} as unknown as Discord.Role)

    await assignRole(mockEmojiReaction("🐧"), mockUser)

    expect(mockAddRole).not.toBeCalled()
  })
  it("removes the reaction if it does not match an assignable role", async () => {
    await assignRole(mockEmojiReaction("🤷‍♀️"), mockUser)

    expect(mockRemoveReaction).toBeCalled()
  })
})
