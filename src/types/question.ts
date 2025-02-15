import { Certification } from './certification'

export type Option = {
  id: string
  text: string
  details?: string | null
  isCorrect: boolean
  createdAt: Date
  updatedAt: Date
}

export type Question = {
  id: string
  text: string
  certificationId: string
  certification?: Certification
  options: Option[]
  createdAt: Date
  updatedAt: Date
}
