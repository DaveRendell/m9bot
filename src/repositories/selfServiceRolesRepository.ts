import * as fs from "fs/promises"
import config from "src/config"
import SelfServiceRole from "src/models/selfServiceRole";


/**
 * Methods for fetching the list of self service roles that
 * users can assign to themselves. Currently the list is
 * updated manually.
 */
export async function getSelfServiceRoles(): Promise<SelfServiceRole[]> {
  try {
    const fileContents = await fs.readFile(config.selfServiceRoleFile, "utf-8")
    return JSON.parse(fileContents) as SelfServiceRole[]
  } catch {
    return []
  }
}
