import addSelfServiceRole from "src/discordResponses/addSelfServiceRole"
import { mockGuild, mockMessage, mockRole, mockUser } from "test/mocks/discord"
import { getMockSelfServiceRolesRepository } from "test/mocks/repositories/mockSelfServiceRolesRepository"
import { mocked } from "ts-jest/utils"
import * as Discord from "discord.js"
import setupSelfServiceRoleMessage from "src/scheduledJobs/setupSelfServiceRoleMessage"

jest.mock("src/repositories/selfServiceRolesRepository")
jest.mock("src/scheduledJobs/setupSelfServiceRoleMessage")
const selfServiceRolesRepository = getMockSelfServiceRolesRepository()


const nonAdmin = mockUser()
const nonAdminMessage = mockMessage({
  member: nonAdmin,
  content: "add_self_service_role <@&12345678> 🐧 Pingu fans"
})
const sillyAttempt = mockMessage({
  member: nonAdmin,
  content: "add_self_service_role <@&12345678> 👺 Make me an admin pls",
  guild: mockGuild({
    roles: {
      fetch: () => Promise.resolve(adminRole)
    } as unknown as  Discord.RoleManager
  })
}) as Discord.Message
const adminRole = mockRole({name: "Administrator"})

const admin = mockUser()
const goodMessage = mockMessage({
  member: admin,
  content: "add_self_service_role <@&12345678> 🐧 Pingu fans"
})
const badMessage = mockMessage({
  member: admin,
  content: "add_self_service_role 12345678 🐧 Pingu fans"
})
const extraSpaceMessage = mockMessage({
  member: admin,
  content: "add_self_service_role <@&12345678>  🐧 Pingu fans"
})
const selfServiceMessageJob = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
  getMockSelfServiceRolesRepository()
  mocked(admin.hasPermission).mockReturnValue(true)
  mocked(setupSelfServiceRoleMessage).mockReturnValue(selfServiceMessageJob)
})

describe("addSelfServiceRole", () => {
  it("rejects the message if the user doesn't have admin permissions", async () => {
    await addSelfServiceRole(nonAdminMessage)

    expect(mocked(nonAdminMessage.reply).mock.calls[0][0]).toContain("do not have permission")
    expect(selfServiceRolesRepository.addSelfServiceRole).not.toHaveBeenCalled()
  })
  it("replies with an especially snarky message if user tries to add the Admin role", async () => {
    await addSelfServiceRole(sillyAttempt)

    expect(mocked(sillyAttempt.reply).mock.calls[0][0]).toContain("nice try")
    expect(selfServiceRolesRepository.addSelfServiceRole).not.toHaveBeenCalled()
  })
  it("adds roles to the list of self service roles", async () => {
    await addSelfServiceRole(goodMessage)

    expect(selfServiceRolesRepository.addSelfServiceRole).toHaveBeenCalledWith({
      roleId: "12345678",
      emoji: "🐧",
      description: "Pingu fans"
    })
  })
  it("refreshes the self service static message", async () => {
    await addSelfServiceRole(goodMessage)

    expect(selfServiceMessageJob).toBeCalled()
  })
  it("sends a helpful message if the usage is wrong", async () => {
    await addSelfServiceRole(badMessage)

    expect(mocked(badMessage.reply).mock.calls[0][0])
      .toContain("Sorry, that's not quite right.")
  })
  it("handles extra spaces in the message okay", async() => {
    await addSelfServiceRole(extraSpaceMessage)

    expect(selfServiceRolesRepository.addSelfServiceRole).toHaveBeenCalledWith({
      roleId: "12345678",
      emoji: "🐧",
      description: "Pingu fans"
    })
  })
})
