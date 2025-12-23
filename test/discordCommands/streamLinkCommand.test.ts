import streamLinkCommand from "src/discordCommands/streamLinkCommand"
import { mockInteraction } from "test/mocks/discord"

const interaction = mockInteraction({})

describe("streamlink command", () => {
    it("posts the stream message", () => {
        streamLinkCommand.execute(interaction)
        expect(interaction.reply).toHaveBeenCalledTimes(1)
    })
})
