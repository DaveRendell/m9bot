import * as Discord from "discord.js"

type PartialWithoutValueOf<Type> = Omit<Partial<Type>, "valueOf">

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
  overrides: PartialWithoutValueOf<Discord.GuildMember> = {}
): Discord.GuildMember {
  return {
    roles: {
      add: jest.fn(),
      remove: jest.fn(),
      cache: {
        get: jest.fn()
      }
    },
    ...overrides,
  } as unknown as Discord.GuildMember
}

export function mockChannel(
  overrides: PartialWithoutValueOf<Discord.Channel> = {}
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

export function mockGuild(): Discord.Guild {
  return {
    members: {
      cache: {
        get: jest.fn()
      }
    }
  } as unknown as  Discord.Guild
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
  overrides: PartialWithoutValueOf<Discord.Message> = {}
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
    ...overrides
  } as unknown as Discord.Message
}
