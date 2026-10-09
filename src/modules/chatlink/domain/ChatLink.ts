export type ChatChannel = 'telegram' | 'webchat'

export interface PendingChat {
  channel: ChatChannel
  subject: string
}

export interface ChatLinkIssued {
  token: string
  expiresAt: string
  channel: ChatChannel
}
