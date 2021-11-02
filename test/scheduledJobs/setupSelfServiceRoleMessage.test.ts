import setupSelfServiceRoleMessage from "src/scheduledJobs/setupSelfServiceRoleMessage"
import { getMockSelfServiceRoleService, MESSAGE_TEXT } from "test/mocks/services/mockSelfServiceRoleService"
import { mockClient, mockMessage } from "test/mocks/discord"
import { getMockSelfServiceRolesRepository } from "test/mocks/repositories/mockSelfServiceRolesRepository"
jest.mock("src/services/selfServiceRoleService")
jest.mock("src/repositories/selfServiceRolesRepository")

const mockService = getMockSelfServiceRoleService()
const discordClient = mockClient()

const message = mockMessage({ content: "exciting message here" })
const upToDateMessage = mockMessage({ content: MESSAGE_TEXT })

beforeEach(() => {
  jest.resetAllMocks()
  getMockSelfServiceRolesRepository()
  getMockSelfServiceRoleService()
})

describe("setupSelfServiceRoleMessage", () => {
  it("ensures the message has been created or fetched", async () => {
    mockService.getOrCreateSelfServiceRoleMessage.mockResolvedValue(message)
    
    await setupSelfServiceRoleMessage(discordClient)

    expect(mockService.getOrCreateSelfServiceRoleMessage).toHaveBeenCalled()
  })
  it("updates the message content if it's outdated", async () => {
    mockService.getOrCreateSelfServiceRoleMessage.mockResolvedValue(message)
    
    await setupSelfServiceRoleMessage(discordClient)

    expect(message.edit).toHaveBeenCalledWith(MESSAGE_TEXT)
  })
  it("does not edit the message if its content is up to date", async () => {
    mockService.getOrCreateSelfServiceRoleMessage.mockResolvedValue(upToDateMessage)
    
    await setupSelfServiceRoleMessage(discordClient)

    expect(upToDateMessage.edit).not.toHaveBeenCalled()
  })
  it("adds example reactions for each role", async () => {
    mockService.getOrCreateSelfServiceRoleMessage.mockResolvedValue(message)

    await setupSelfServiceRoleMessage(discordClient)

    expect(message.react).toHaveBeenCalledWith("🐧")
    expect(message.react).toHaveBeenCalledWith("🍎")
  })
})
