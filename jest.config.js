
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverageFrom: [
    "src/discordResponses/**/*",
    "src/repositories/**/*",
    "src/scheduledJobs/**/*",
    "src/services/**/*",
  ],
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
};