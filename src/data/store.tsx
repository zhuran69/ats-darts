import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Candidate,
  Client,
  StageId,
  StoreData,
  Vacancy,
} from '../types'
import { seed } from './seed'

const KEY = 'darts-ats-v1'

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function load(): StoreData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as StoreData
  } catch {
    /* keep seed */
  }
  return structuredClone(seed)
}

function save(data: StoreData) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

type StoreApi = StoreData & {
  addClient: (c: Omit<Client, 'id'>) => void
  addVacancy: (v: Omit<Vacancy, 'id' | 'createdAt'>) => void
  addCandidate: (c: Omit<Candidate, 'id' | 'notes'>) => void
  addNote: (candidateId: string, text: string) => void
  attachToVacancy: (candidateId: string, vacancyId: string) => void
  moveStage: (applicationId: string, stage: StageId) => void
  setVacancyStatus: (vacancyId: string, status: Vacancy['status']) => void
  resetDemo: () => void
}

const StoreContext = createContext<StoreApi | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(load)

  const update = (next: StoreData) => {
    setData(next)
    save(next)
  }

  const api = useMemo<StoreApi>(
    () => ({
      ...data,
      addClient: (c) =>
        update({ ...data, clients: [...data.clients, { ...c, id: uid('cl') }] }),
      addVacancy: (v) =>
        update({
          ...data,
          vacancies: [
            ...data.vacancies,
            { ...v, id: uid('vac'), createdAt: today() },
          ],
        }),
      addCandidate: (c) =>
        update({
          ...data,
          candidates: [
            ...data.candidates,
            { ...c, id: uid('can'), notes: [] },
          ],
        }),
      addNote: (candidateId, text) =>
        update({
          ...data,
          candidates: data.candidates.map((c) =>
            c.id === candidateId
              ? {
                  ...c,
                  notes: [
                    { id: uid('n'), text, at: today() },
                    ...c.notes,
                  ],
                }
              : c,
          ),
        }),
      attachToVacancy: (candidateId, vacancyId) => {
        const exists = data.applications.some(
          (a) => a.candidateId === candidateId && a.vacancyId === vacancyId,
        )
        if (exists) return
        update({
          ...data,
          applications: [
            ...data.applications,
            {
              id: uid('app'),
              candidateId,
              vacancyId,
              stage: 'new',
              updatedAt: today(),
            },
          ],
        })
      },
      moveStage: (applicationId, stage) =>
        update({
          ...data,
          applications: data.applications.map((a) =>
            a.id === applicationId
              ? { ...a, stage, updatedAt: today() }
              : a,
          ),
        }),
      setVacancyStatus: (vacancyId, status) =>
        update({
          ...data,
          vacancies: data.vacancies.map((v) =>
            v.id === vacancyId ? { ...v, status } : v,
          ),
        }),
      resetDemo: () => {
        localStorage.removeItem(KEY)
        const fresh = structuredClone(seed)
        setData(fresh)
      },
    }),
    [data],
  )

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('StoreProvider missing')
  return ctx
}
