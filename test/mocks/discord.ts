import * as Discord from "discord.js"

type PartialWithoutValueOfToString<Type> = Omit<Omit<Partial<Type>, "valueOf">, "toString">

export function mockClient(): Discord.Client {
  return {
    channels: {
      fetch: jest.fn(),
      cache: {
        get: jest.fn()
      }
    }
  } as unknown as Discord.Client
}

export function mockUser(
  overrides: PartialWithoutValueOfToString<Discord.GuildMember> = {}
): Discord.GuildMember {
  return {
    roles: {
      add: jest.fn(),
      remove: jest.fn(),
      cache: {
        get: jest.fn()
      }
    },
    hasPermission: jest.fn(),
    ...overrides,
  } as unknown as Discord.GuildMember
}

export function mockChannel(
  overrides: PartialWithoutValueOfToString<Discord.Channel> = {}
): Discord.Channel {
  return {
    isText: jest.fn(),
    members: {
      get: jest.fn(),
    },
    messages: {
      fetch: jest.fn()
    },
    guild: mockGuild(),
    send: jest.fn(),
    ...overrides,
  } as unknown as Discord.Channel
}

export function mockGuild(overrides: PartialWithoutValueOfToString<Discord.Guild> = {}): Discord.Guild {
  return {
    members: {
      cache: {
        get: jest.fn()
      }
    },
    roles: {
      fetch: jest.fn()
    },
    setName: jest.fn(),
    ...overrides
  } as unknown as  Discord.Guild
}

export function mockRole(overrides: PartialWithoutValueOfToString<Discord.Role> = {}): Discord.Role {
  return {
    id: 1234,
    ...overrides
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
  overrides: PartialWithoutValueOfToString<Discord.Message> = {}
): Discord.Message {
  return {
    pin: jest.fn(),
    unpin: jest.fn(),
    reply: jest.fn(),
    edit: jest.fn(),
    react: jest.fn(),
    reactions: {
      resolve: jest.fn()
    },
    channel: mockChannel(),
    guild: mockGuild(),
    ...overrides
  } as unknown as Discord.Message
}
