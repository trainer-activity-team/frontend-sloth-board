import { getToken } from './authStorage'
import { env } from './env'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ApiErrorBody {
  message?: string
  error?: string
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === 'object' && body !== null) {
    const parsed = body as ApiErrorBody
    if (typeof parsed.message === 'string' && parsed.message.length > 0) {
      return parsed.message
    }
    if (typeof parsed.error === 'string' && parsed.error.length > 0) {
      return parsed.error
    }
  }

  return fallback
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type')
  const hasJsonBody = contentType?.includes('application/json') ?? false
  const body: unknown = hasJsonBody ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(
      response.status,
      getErrorMessage(body, response.statusText || 'Request failed'),
    )
  }

  return body as T
}
