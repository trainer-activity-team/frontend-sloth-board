export interface SessionClass {
  id: number
  name: string
  classLevel: string
}

export interface SessionContract {
  id: number
  contractNumber: string
}

export interface SessionType {
  id: number
  name: string
}

export interface SessionStatus {
  id: number
  name: string
}

export interface Timescale {
  id: number
  name: string
}

export interface SessionUser {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface Session {
  id: number
  subject: string | null
  classId: number | null
  title: string
  contractId: number | null
  statusId?: number | null
  userId: number | null
  invoiceId: number | null
  sessionTypeId: number | null
  timescaleId: number | null
  date: string
  start: string
  end: string
  declarationReference: string | null
  declarationDate: string | null
  class?: SessionClass | null
  contract?: SessionContract | null
  sessionType?: SessionType | null
  statusRelation?: SessionStatus | null
  timescale?: Timescale | null
  user?: SessionUser | null
}

export interface CreateSessionRequest {
  title: string
  date: string
  start: string
  end: string
  subject?: string
  classId?: number
  contractId?: number
  userId?: number
  sessionTypeId?: number
  timescaleId?: number
  declarationReference?: string
  declarationDate?: string
}

export interface UpdateSessionRequest {
  title?: string
  date?: string
  start?: string
  end?: string
  subject?: string
  classId?: number
  contractId?: number
  userId?: number
  sessionTypeId?: number
  timescaleId?: number
  declarationReference?: string
  declarationDate?: string
}
