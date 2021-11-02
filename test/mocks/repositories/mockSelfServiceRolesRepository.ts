import SelfServiceRole from "src/models/selfServiceRole"
import * as selfServiceRolesRepository from "src/repositories/selfServiceRolesRepository"
import { mocked } from "ts-jest/utils"

jest.mock("src/repositories/selfServiceRolesRepository")

export const EXAMPLE_ROLES: SelfServiceRole[] = [
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

export function getMockSelfServiceRolesRepository() {
  const mock = mocked(selfServiceRolesRepository)
  mock.getSelfServiceRoles.mockResolvedValue(EXAMPLE_ROLES)
  return mock
}
