import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../data/store'
import { STAGES } from '../types'

export function Pipeline() {
  const { vacancies, applications, candidates, clients } = useStore()
  const open = vacancies.filter((v) => v.status === 'open')
  const [vacancyId, setVacancyId] = useState(open[0]?.id ?? vacancies[0]?.id ?? '')
  const vacancy = vacancies.find((v) => v.id === vacancyId)
  const client = clients.find((c) => c.id === vacancy?.clientId)
  const apps = applications.filter((a) => a.vacancyId === vacancyId)

  return (
    <>
      <div className="top">
        <div>
          <h1>Воронка</h1>
          <p className="muted">Актуальные этапы по выбранной вакансии.</p>
        </div>
        <select value={vacancyId} onChange={(e) => setVacancyId(e.target.value)}>
          {vacancies.map((v) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </select>
      </div>

      {vacancy && (
        <p className="muted" style={{ marginBottom: 16 }}>
          {client?.name} ·{' '}
          <Link to={`/vacancies/${vacancy.id}`}>открыть карточку</Link>
        </p>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Этап</th>
              <th>Кандидаты</th>
            </tr>
          </thead>
          <tbody>
            {STAGES.map((s) => {
              const people = apps
                .filter((a) => a.stage === s.id)
                .map((a) => candidates.find((c) => c.id === a.candidateId))
                .filter(Boolean)
              return (
                <tr key={s.id}>
                  <td>
                    <span className={`badge ${s.id}`}>{s.label}</span>
                  </td>
                  <td>
                    {people.length === 0 ? (
                      <span className="muted">—</span>
                    ) : (
                      people.map((c) => (
                        <span key={c!.id} style={{ marginRight: 12 }}>
                          <Link to={`/candidates/${c!.id}`}>{c!.name}</Link>
                        </span>
                      ))
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
