import * as fs from "fs"
import config from "src/config"
import SelfServiceRole from "src/models/selfServiceRole"
import {getSelfServiceRoles} from "src/repositories/selfServiceRolesRepository"

jest.mock("src/config", () => ({
  default: {
    selfServiceRoleFile: "selfServiceRoles.test.json"
  }
}))

afterEach(() => {
  if (fs.existsSync(config.selfServiceRoleFile)) {
    fs.unlinkSync(config.selfServiceRoleFile)
  }  
})

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

describe("selfServiceRolesRepository", () => {
  describe("getSelfServiceRoles", () => {
    it("returns an empty list if the file does not exist", async () => {
      const roles = await getSelfServiceRoles()

      expect(roles).toStrictEqual([])
    })
    it("returns the roles in the file if the file exists", async () => {
      fs.writeFileSync(
        config.selfServiceRoleFile,
        JSON.stringify(EXAMPLE_ROLES)
      )
      
      const roles = await getSelfServiceRoles()

      expect(roles).toStrictEqual(EXAMPLE_ROLES)
    })
  })
})
