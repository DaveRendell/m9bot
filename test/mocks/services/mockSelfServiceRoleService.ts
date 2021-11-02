import * as selfServiceRoleService from "src/services/selfServiceRoleService"
import { mocked } from "ts-jest/utils"

export const MESSAGE_TEXT = "test message text"

export function getMockSelfServiceRoleService() {
  const mock = mocked(selfServiceRoleService)
  mock.getSelfServiceRolesMessageContent.mockResolvedValue(MESSAGE_TEXT)
  return mock
}
