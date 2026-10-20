import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../data/store'
import { STAGES, type StageId, type VacancyStatus } from '../types'

export function VacancyDetail() {
  const { id } = useParams()
  const store = useStore()
  const vacancy = store.vacancies.find((v) => v.id === id)
  const client = store.clients.find((c) => c.id === vacancy?.clientId)
  const [pick, setPick] = useState('')

  const apps = useMemo(
    () => store.applications.filter((a) => a.vacancyId === id),
    [store.applications, id],
  )

  if (!vacancy) {
    return <p>Вакансия не найдена. <Link to="/vacancies">Назад</Link></p>
  }

  const unused = store.candidates.filter(
    (c) => !apps.some((a) => a.candidateId === c.id),
  )

  return (
    <>
      <div className="top">
        <div>
          <p className="muted">
            <Link to="/vacancies">Вакансии</Link> · {client?.name}
          </p>
          <h1>{vacancy.title}</h1>
          <p className="muted">
            {vacancy.city} · {vacancy.grade} · {vacancy.salary} · {vacancy.recruiter}
          </p>
        </div>
        <select
          value={vacancy.status}
          onChange={(e) =>
            store.setVacancyStatus(vacancy.id, e.target.value as VacancyStatus)
          }
        >
          <option value="open">Открыта</option>
          <option value="hold">Пауза</option>
          <option value="closed">Закрыта</option>
        </select>
      </div>

      <p>{vacancy.description}</p>

      <div className="row" style={{ margin: '16px 0 20px' }}>
        <select value={pick} onChange={(e) => setPick(e.target.value)}>
          <option value="">Добавить кандидата из базы…</option>
          {unused.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.title}
            </option>
          ))}
        </select>
        <button
          className="btn"
          type="button"
          disabled={!pick}
          onClick={() => {
            store.attachToVacancy(pick, vacancy.id)
            setPick('')
          }}
        >
          Взять на вакансию
        </button>
      </div>

      <div className="kanban">
        {STAGES.map((stage) => {
          const items = apps.filter((a) => a.stage === stage.id)
          return (
            <div key={stage.id} className="kanban-col">
              <h4>
                {stage.label} · {items.length}
              </h4>
              {items.map((a) => {
                const c = store.candidates.find((x) => x.id === a.candidateId)
                if (!c) return null
                return (
                  <div key={a.id} className="kanban-card">
                    <Link to={`/candidates/${c.id}`}>
                      <strong>{c.name}</strong>
                    </Link>
                    <p className="muted">{c.title}</p>
                    <p className="muted">{c.city}</p>
                    <select
                      value={a.stage}
                      onChange={(e) =>
                        store.moveStage(a.id, e.target.value as StageId)
                      }
                      style={{ marginTop: 8, width: '100%' }}
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}
