import * as birthdayService from "src/services/birthdayService"
import { mocked } from "ts-jest/utils"

export function getMockBirthdayService() {
  const mock = mocked(birthdayService)
  mock.getUpcomingBirthdays.mockResolvedValue([])
  return mock
}
