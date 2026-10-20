import { Link } from 'react-router-dom'
import { useStore } from '../data/store'
import { STAGES } from '../types'

export function Dashboard() {
  const { vacancies, candidates, applications, clients } = useStore()
  const open = vacancies.filter((v) => v.status === 'open').length
  const hired = applications.filter((a) => a.stage === 'hired').length
  const inPlay = applications.filter(
    (a) => a.stage !== 'reject' && a.stage !== 'hired',
  ).length

  return (
    <>
      <div className="top">
        <div>
          <h1>Обзор</h1>
          <p className="muted">Рабочий контур DARTS: база, вакансии, воронка.</p>
        </div>
      </div>
      <section className="grid stats">
        <article className="card">
          <p className="muted">Кандидаты в базе</p>
          <div className="stat-value">{candidates.length}</div>
        </article>
        <article className="card">
          <p className="muted">Открытые вакансии</p>
          <div className="stat-value">{open}</div>
        </article>
        <article className="card">
          <p className="muted">В работе</p>
          <div className="stat-value">{inPlay}</div>
        </article>
        <article className="card">
          <p className="muted">Заказчики</p>
          <div className="stat-value">{clients.length}</div>
        </article>
      </section>
      <h2 style={{ margin: '28px 0 12px', fontSize: 18 }}>Активные вакансии</h2>
      <div className="grid cards">
        {vacancies
          .filter((v) => v.status === 'open')
          .map((v) => {
            const client = clients.find((c) => c.id === v.clientId)
            const count = applications.filter((a) => a.vacancyId === v.id).length
            return (
              <Link key={v.id} to={`/vacancies/${v.id}`} className="card">
                <h3>{v.title}</h3>
                <p className="muted">
                  {client?.name} · {v.city}
                </p>
                <p style={{ marginTop: 10 }}>
                  <span className="badge open">{count} в воронке</span>{' '}
                  <span className="badge">{v.salary}</span>
                </p>
              </Link>
            )
          })}
      </div>
      <p className="muted" style={{ marginTop: 24 }}>
        Выходов в демо: {hired}. Этапы:{' '}
        {STAGES.map((s) => s.label).join(' → ')}.
      </p>
    </>
  )
}
