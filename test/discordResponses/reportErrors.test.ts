import * as Discord from "discord.js"
import reportErrors from "src/discordResponses/reportError"
import { mockChannel, mockClient } from "test/mocks/discord"
import * as logging from "src/logging"

jest.mock("src/logging", () => ({
  info: jest.fn(),
  error: jest.fn()
}))
jest.mock("src/config", () => ({
  default: {
    discord: {
      errorLogChannelId: "1234",
      errorLoggingUserId: "5678",
    }
  }
}))

const client = mockClient()
const channel = mockChannel() as Discord.TextChannel
const error = new Error("Test error")

function failedScheduledJob(discordClient: Discord.Client) {
  return async () => {
    return Promise.reject(error)
  }
}

function successfulScheduledJob(discordClient: Discord.Client) {
  return async () => {
    logging.info("Success")
    return Promise.resolve()
  }
}

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(client.channels.fetch).mockResolvedValue(channel)
})

describe("reportErrors", () => {
  it("runs the value of the original job if it completes successfully", async () => {
    await reportErrors("test job", successfulScheduledJob)(client)()

    expect(jest.mocked(logging.info)).toHaveBeenCalled()
  })
  it("supresses the error if the scheduled job fails", async () => {
    const promise = reportErrors("test job", failedScheduledJob)(client)()

    expect(promise).resolves.toBe(undefined)
  })
  it("logs the error if the scheduled job fails", async () => {
    await reportErrors("test job", failedScheduledJob)(client)()

    expect(jest.mocked(logging.error)).toHaveBeenCalledWith(
      "Error during scheduled job test job", error)
  })
  it("posts a message on Discord is there is an error", async () => {
    await reportErrors("test job", failedScheduledJob)(client)()

    expect(channel.send).toHaveBeenCalled()
  })
})
