import * as Discord from "discord.js"

export const expectReply = (interaction: Discord.ChatInputCommandInteraction, content: string) => {
  expect(interaction.reply).toHaveBeenCalledTimes(1)
  const firstCall = jest.mocked(interaction.reply).mock.calls[0][0]
  if (typeof firstCall === "string") {
    expect(firstCall).toContain(content)
  } else if ("content" in firstCall) {
    expect(firstCall.content).toContain(content)
  }
}
