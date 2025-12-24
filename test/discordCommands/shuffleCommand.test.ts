import shuffleCommand from "src/discordCommands/shuffleCommand"
import { mockInteraction } from "test/mocks/discord"

const interaction = mockInteraction({})

describe("shuffleServerName", () => {
  it("replies to the message with acknowledgement", async () => {
    await shuffleCommand.execute(interaction)

    expect(jest.mocked(interaction.reply)).toHaveBeenCalledTimes(1)
    expect(jest.mocked(interaction.guild!!.setName)).toHaveBeenCalledTimes(1)
  })
})