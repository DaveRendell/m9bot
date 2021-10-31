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

export function mockMessage(
  overrides: Omit<Partial<Discord.Message>, "valueOf"> = {}
): Discord.Message {
  return {
    pin: jest.fn(),
    unpin: jest.fn(),
    reactions: {
      resolve: jest.fn()
    },
    ...overrides
  } as unknown as Discord.Message
}
