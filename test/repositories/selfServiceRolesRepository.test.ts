import * as fs from "fs"
import config from "src/config"
import SelfServiceRole from "src/models/selfServiceRole"
import {addSelfServiceRole, getSelfServiceRoles} from "src/repositories/selfServiceRolesRepository"

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

const OVERWRITE_ROLE = {
  "emoji": "👿",
  "roleId": "1234",
  "description": "overwrite"
}

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
  describe("assSelfServiceRoles", () => {
    it("creates the file with the new role if none yet exists", async () => {
      await addSelfServiceRole(EXAMPLE_ROLES[0])

      expect(fs.existsSync(config.selfServiceRoleFile)).toBeTruthy()
      expect(await getSelfServiceRoles()).toEqual([EXAMPLE_ROLES[0]])
    })
    it("appends to the files if it exists already", async () => {
      await addSelfServiceRole(EXAMPLE_ROLES[0])
      await addSelfServiceRole(EXAMPLE_ROLES[1])

      expect(await getSelfServiceRoles()).toEqual(EXAMPLE_ROLES)
    })
    it("overrwrites existing self service roles with the same role ID", async () => {
      await addSelfServiceRole(EXAMPLE_ROLES[0])
      await addSelfServiceRole(EXAMPLE_ROLES[1])
      await addSelfServiceRole(OVERWRITE_ROLE)

      expect(await getSelfServiceRoles()).toEqual([
        EXAMPLE_ROLES[1],
        OVERWRITE_ROLE
      ]
      )
    })
  })
})
