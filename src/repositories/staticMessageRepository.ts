import * as fs from "fs/promises"
import config from "src/config"

/**
 * Contains methods for storing and retrieving the stored list
 * of static message IDs, e.g. for self service role assignment
 * message
 */

export async function getSelfServiceRoleMessageId(): Promise<string | null> {
  try {
    return await fs.readFile(config.selfServiceRoleMessageFile, "utf-8")
  } catch {
    return null
  }
}

export async function setSelfServiceRoleMessageId(messageId: string): Promise<void> {
  await fs.writeFile(config.selfServiceRoleMessageFile, messageId)
}
