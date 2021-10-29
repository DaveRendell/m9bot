import * as fs from "fs/promises"
import config from "src/config"
import { getSelfServiceRoleMessageId, setSelfServiceRoleMessageId } from "src/repositories/staticMessageRepository"

jest.mock("src/config", () => ({
  default: {
    selfServiceRoleMessageFile: "selfServiceRoleMessage.test.txt"
  }
}))

afterEach(() => {
  fs.unlink(config.selfServiceRoleMessageFile).catch(() => {})
})

describe("staticMessageRespository", () => {
  describe("getSelfServiceRoleMessageId", () => {
    it("returns null if file is not created", async () => {
      const result = await getSelfServiceRoleMessageId()
      expect(result).toBe(null)
    })
    it("returns the contents of the file if it does exist", async () => {
      await fs.writeFile(config.selfServiceRoleMessageFile, "12345")

      const result = await getSelfServiceRoleMessageId()
      expect(result).toBe("12345")
    })
  })
  describe("setSelfServiceRoleMessageId", () => {
    it("creates the file if none exists", async () => {
      await setSelfServiceRoleMessageId("12345")

      const fileContents = await fs.readFile(config.selfServiceRoleMessageFile, "utf-8")

      expect(fileContents).toBe("12345")
    })
    it("overwrites the existing file if it exists", async () => {
      await setSelfServiceRoleMessageId("12345")
      await setSelfServiceRoleMessageId("67890")

      const fileContents = await fs.readFile(config.selfServiceRoleMessageFile, "utf-8")

      expect(fileContents).toBe("67890")
    })
  })
})