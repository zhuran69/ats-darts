import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../data/store'
import { STAGES } from '../types'

export function CandidateDetail() {
  const { id } = useParams()
  const store = useStore()
  const candidate = store.candidates.find((c) => c.id === id)
  const [vacancyId, setVacancyId] = useState('')

  if (!candidate) {
    return <p>Кандидат не найден. <Link to="/candidates">Назад</Link></p>
  }

  const apps = store.applications.filter((a) => a.candidateId === candidate.id)

  const candidateId = candidate.id

  function addNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const text = String(f.get('text')).trim()
    if (!text) return
    store.addNote(candidateId, text)
    e.currentTarget.reset()
  }

  return (
    <>
      <p className="muted">
        <Link to="/candidates">Кандидаты</Link> · {candidate.source}
      </p>
      <div className="top">
        <div>
          <h1>{candidate.name}</h1>
          <p className="muted">
            {candidate.title} · {candidate.city} · {candidate.experienceYears} лет · {candidate.salary}
          </p>
        </div>
      </div>

      <div className="split">
        <section className="card">
          <h3>Резюме</h3>
          <p>{candidate.summary}</p>
          <div className="chips" style={{ marginTop: 12 }}>
            {candidate.skills.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
          <p style={{ marginTop: 16 }}>
            {candidate.phone}
            <br />
            {candidate.email}
          </p>

          <h3 style={{ marginTop: 24 }}>Вакансии</h3>
          {apps.length === 0 && <p className="muted">Ещё не взят ни на одну вакансию.</p>}
          {apps.map((a) => {
            const v = store.vacancies.find((x) => x.id === a.vacancyId)
            const stage = STAGES.find((s) => s.id === a.stage)
            return (
              <p key={a.id}>
                <Link to={`/vacancies/${a.vacancyId}`}>{v?.title}</Link>{' '}
                <span className={`badge ${a.stage}`}>{stage?.label}</span>
              </p>
            )
          })}

          <div className="row" style={{ marginTop: 12 }}>
            <select value={vacancyId} onChange={(e) => setVacancyId(e.target.value)}>
              <option value="">Добавить на вакансию…</option>
              {store.vacancies
                .filter((v) => !apps.some((a) => a.vacancyId === v.id))
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
            </select>
            <button
              className="btn small"
              type="button"
              disabled={!vacancyId}
              onClick={() => {
                store.attachToVacancy(candidate.id, vacancyId)
                setVacancyId('')
              }}
            >
              Добавить
            </button>
          </div>
        </section>

        <aside className="card">
          <h3>Заметки</h3>
          <form onSubmit={addNote} className="field">
            <textarea name="text" rows={3} placeholder="Комментарий рекрутера" />
            <button className="btn small" type="submit" style={{ marginTop: 8 }}>
              Записать
            </button>
          </form>
          {candidate.notes.map((n) => (
            <div key={n.id} className="note">
              <p className="muted">{n.at}</p>
              <p>{n.text}</p>
            </div>
          ))}
        </aside>
      </div>
    </>
  )
}
