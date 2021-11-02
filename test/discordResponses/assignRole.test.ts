import assignRole from "src/discordResponses/assignRole"
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

describe("assignRole", () => {
  it("adds the role to the user if they don't already have it", async () => {
    await assignRole(mockMessageReaction("🐧"), user)

    expect(user.roles.add).toBeCalledWith("1234")
  })
  it("does nothing if the user is already assigned that role", async () => {
    mocked(user.roles.cache.get).mockReturnValue(role)

    await assignRole(mockMessageReaction("🐧"), user)

    expect(user.roles.add).not.toBeCalled()
  })
  it("removes the reaction if it does not match an assignable role", async () => {
    const reaction = mockMessageReaction("🤷‍♀️")
    await assignRole(reaction, user)

    expect(reaction.remove).toBeCalled()
  })
})
