export interface ClassTeacher {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface ClassInstitution {
  id: number
  name: string
}

export interface SchoolClass {
  id: number
  institutionId: number
  classLevel: string
  studentCount: number
  name: string
  teacherId: number
  teacher?: ClassTeacher
  institution?: ClassInstitution
}

export interface CreateClassRequest {
  institutionId: number
  classLevel: string
  studentCount: number
  name: string
  teacherId: number
}

export interface UpdateClassRequest {
  institutionId?: number
  classLevel?: string
  studentCount?: number
  name?: string
  teacherId?: number
}
