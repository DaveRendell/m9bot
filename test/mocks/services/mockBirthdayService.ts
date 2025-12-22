import * as birthdayService from "src/services/birthdayService"

export function getMockBirthdayService() {
  const mock = jest.mocked(birthdayService)
  mock.getUpcomingBirthdays.mockResolvedValue([])
  return mock
}
