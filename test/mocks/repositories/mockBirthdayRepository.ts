import { mocked } from "ts-jest/utils"
import * as birthdayRepository from "src/repositories/birthdayRepository"


export function getMockBirthdayRepository() {
  const mock = mocked(birthdayRepository)
  mock.getBirthdays.mockResolvedValue([])
  return mock
}
