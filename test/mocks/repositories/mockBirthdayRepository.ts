import * as birthdayRepository from "src/repositories/birthdayRepository"


export function getMockBirthdayRepository() {
  const mock = jest.mocked(birthdayRepository)
  mock.getBirthdays.mockResolvedValue([])
  return mock
}
