import removeRole from "src/discordResponses/removeRole"
import { mockMessageReaction, mockRole, mockUser } from "test/mocks/discord"
import { getMockSelfServiceRolesRepository } from "test/mocks/repositories/mockSelfServiceRolesRepository"
import { mocked } from "ts-jest/utils"

jest.mock("src/repositories/selfServiceRolesRepository")

const user = mockUser()
const role = mockRole()

beforeEach(() => {
  jest.resetAllMocks()
  getMockSelfServiceRolesRepository()
})

describe("removeRole", () => {
  it("removes the user's role if they have it assigned", async () => {
    mocked(user.roles.cache.get).mockReturnValue(role)

    await removeRole(mockMessageReaction("🐧"), user)

    expect(user.roles.remove).toBeCalledWith("1234")
  })
  it("does nothing if the user doesn't have the role in question", async () => {
    await removeRole(mockMessageReaction("🐧"), user)

    expect(user.roles.remove).not.toHaveBeenCalled()
  })
  it("does nothing if it does not match an assignable role", async () => {
    const reaction = mockMessageReaction("🤷‍♀️")
    await removeRole(reaction, user)

    expect(user.roles.remove).not.toHaveBeenCalled()
  })
})
