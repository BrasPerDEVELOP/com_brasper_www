import { apiClient } from '@/interface/api/client'
import { Domain } from '@/interface/infrastructure/services'
import type { ChatChannel, ChatLinkIssued, PendingChat } from '../../domain/ChatLink'

const PENDING_KEY = 'brasper.chatLink.pending'
const TELEGRAM_SUBJECT = /^tg:[1-9][0-9]{0,19}$/
const WEBCHAT_SUBJECT = /^[A-Za-z0-9:+._-]{16,160}$/

/** Valida la referencia del chat igual que la API (nunca se envía si no coincide). */
export function parsePendingChat(channel: unknown, subject: unknown): PendingChat | null {
  if (channel === 'telegram' && typeof subject === 'string' && TELEGRAM_SUBJECT.test(subject)) {
    return { channel, subject }
  }
  if (channel === 'webchat' && typeof subject === 'string' && WEBCHAT_SUBJECT.test(subject)) {
    return { channel, subject }
  }
  return null
}

/** El chat a vincular viaja en el fragmento (#) y se guarda solo en esta pestaña. */
export function savePendingChat(chat: PendingChat): void {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(chat))
  } catch {
    // Sin almacenamiento de sesión no hay chat pendiente; la vista lo indica.
  }
}

export function readPendingChat(): PendingChat | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Record<string, unknown>
    return parsePendingChat(data.channel, data.subject)
  } catch {
    return null
  }
}

export function clearPendingChat(): void {
  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
    // Nada que limpiar.
  }
}

export class ChatLinkApiAdapter {
  async issue(channel: ChatChannel, subject: string): Promise<ChatLinkIssued> {
    const response = await apiClient.post<unknown>(Domain.apiPath('brasper/identity-links'), { channel, subject })
    const data = response.data as Record<string, unknown> | null
    const token = data && typeof data.link_token === 'string' ? data.link_token : ''
    const expiresAt = data && typeof data.expires_at === 'string' ? data.expires_at : ''
    if (!/^[A-Za-z0-9_-]{43}$/.test(token) || !expiresAt) {
      throw new Error('Respuesta de vinculación inválida')
    }
    return { token, expiresAt, channel }
  }

  async revokeAll(): Promise<number> {
    const response = await apiClient.delete<unknown>(Domain.apiPath('brasper/identity-links'))
    const data = response.data as Record<string, unknown> | null
    return data && typeof data.revoked === 'number' ? data.revoked : 0
  }
}
