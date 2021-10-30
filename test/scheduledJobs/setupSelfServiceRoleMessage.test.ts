import setupSelfServiceRoleMessage, { MESSAGE_TEXT } from "src/scheduledJobs/setupSelfServiceRoleMessage"
import * as service from "src/services/selfServiceRoleService"
import { mocked } from "ts-jest/utils"
import * as Discord from "discord.js"

jest.mock("src/services/selfServiceRoleService")
const mockService = mocked(service)

const discordClient = {} as unknown as Discord.Client
const mockEdit = jest.fn(() => {})
const mockMessage = {
  content: "exciting message here",
  edit: mockEdit
} as unknown as Discord.Message
const mockUpToDateMessage = {
  content: MESSAGE_TEXT,
  edit: mockEdit
} as unknown as Discord.Message

beforeEach(() => {
  jest.resetAllMocks()
})

describe("setupSelfServiceRoleMessage", () => {
  it("ensures the message has been created or fetched", async () => {
    mockService.getOrCreateSelfServiceRoleMessage.mockResolvedValue(mockMessage)
    
    await setupSelfServiceRoleMessage(discordClient)

    expect(mockService.getOrCreateSelfServiceRoleMessage).toHaveBeenCalled()
  })
  it("updates the message content if it's outdated", async () => {
    mockService.getOrCreateSelfServiceRoleMessage.mockResolvedValue(mockMessage)
    
    await setupSelfServiceRoleMessage(discordClient)

    expect(mockEdit).toHaveBeenCalledWith(MESSAGE_TEXT)
  })
  it("does not edit the message if its content is up to date", async () => {
    mockService.getOrCreateSelfServiceRoleMessage.mockResolvedValue(mockUpToDateMessage)
    
    await setupSelfServiceRoleMessage(discordClient)

    expect(mockEdit).not.toHaveBeenCalled()
  })
})
