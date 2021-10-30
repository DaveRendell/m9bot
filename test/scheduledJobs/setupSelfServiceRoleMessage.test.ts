import setupSelfServiceRoleMessage from "src/scheduledJobs/setupSelfServiceRoleMessage"
import * as service from "src/services/selfServiceRoleService"
import { mocked } from "ts-jest/utils"
import * as Discord from "discord.js"
import SelfServiceRole from "src/models/selfServiceRole"
import * as selfServiceRolesRepository from "src/repositories/selfServiceRolesRepository"


jest.mock("src/services/selfServiceRoleService")
jest.mock("src/repositories/selfServiceRolesRepository")
const mockService = mocked(service)
const mockSelfServiceRolesRepository = mocked(selfServiceRolesRepository)

const MESSAGE_TEXT = "test message text"

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

const discordClient = {} as unknown as Discord.Client
const mockEdit = jest.fn(() => {})
const mockReact = jest.fn(() => {})
const mockMessage = {
  content: "exciting message here",
  edit: mockEdit,
  react: mockReact
} as unknown as Discord.Message
const mockUpToDateMessage = {
  content: MESSAGE_TEXT,
  edit: mockEdit,
  react: mockReact
} as unknown as Discord.Message

beforeEach(() => {
  jest.resetAllMocks()
  mockService.getSelfServiceRolesMessageContent.mockResolvedValue(MESSAGE_TEXT)
  mockSelfServiceRolesRepository.getSelfServiceRoles.mockResolvedValue(EXAMPLE_ROLES)
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
  it("adds example reactions for each role", async () => {
    mockService.getOrCreateSelfServiceRoleMessage.mockResolvedValue(mockMessage)

    await setupSelfServiceRoleMessage(discordClient)

    expect(mockReact).toHaveBeenCalledWith("🐧")
    expect(mockReact).toHaveBeenCalledWith("🍎")
  })
})
