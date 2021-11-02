import { mocked } from "ts-jest/utils"
import * as staticMessageRepository from "src/repositories/staticMessageRepository"


export function getMockStaticMessageRepository() {
  const mock = mocked(staticMessageRepository)
  return mock
}
