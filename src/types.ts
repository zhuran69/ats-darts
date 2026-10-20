export const STAGES = [
  { id: 'new', label: 'Новый' },
  { id: 'screen', label: 'Скрининг' },
  { id: 'darts_interview', label: 'Интервью DARTS' },
  { id: 'presented', label: 'Представлен' },
  { id: 'client_interview', label: 'Интервью заказчика' },
  { id: 'offer', label: 'Оффер' },
  { id: 'hired', label: 'Выход' },
  { id: 'hold', label: 'Резерв' },
  { id: 'reject', label: 'Отказ' },
] as const

export type StageId = (typeof STAGES)[number]['id']

export type Client = {
  id: string
  name: string
  industry: string
  contact: string
  email: string
  notes: string
}

export type VacancyStatus = 'open' | 'hold' | 'closed'

export type Vacancy = {
  id: string
  title: string
  clientId: string
  city: string
  grade: string
  salary: string
  status: VacancyStatus
  recruiter: string
  description: string
  createdAt: string
}

export type Note = {
  id: string
  text: string
  at: string
}

export type Candidate = {
  id: string
  name: string
  title: string
  city: string
  salary: string
  skills: string[]
  experienceYears: number
  phone: string
  email: string
  source: string
  summary: string
  notes: Note[]
}

export type Application = {
  id: string
  candidateId: string
  vacancyId: string
  stage: StageId
  updatedAt: string
}

export type StoreData = {
  clients: Client[]
  vacancies: Vacancy[]
  candidates: Candidate[]
  applications: Application[]
}
