import * as Discord from "discord.js"



export function mockUser(): Discord.GuildMember {
  return {
    roles: {
      add: jest.fn(),
      remove: jest.fn(),
      cache: {
        get: jest.fn()
      }
    }
  } as unknown as Discord.GuildMember
}

export function mockRole(id = "1234"): Discord.Role {
  return {
    id
  } as unknown as Discord.Role
}

export function mockMessageReaction(emoji: string = "🍎"): Discord.MessageReaction {
  return {
    emoji: {
      name: emoji,
    },
    remove: jest.fn()
  } as unknown as Discord.MessageReaction
}
