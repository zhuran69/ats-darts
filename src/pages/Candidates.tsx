import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../data/store'

export function Candidates() {
  const { candidates, addCandidate } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    addCandidate({
      name: String(f.get('name')),
      title: String(f.get('title')),
      city: String(f.get('city')),
      salary: String(f.get('salary')),
      skills: String(f.get('skills'))
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      experienceYears: Number(f.get('experienceYears') || 0),
      phone: String(f.get('phone')),
      email: String(f.get('email')),
      source: String(f.get('source')),
      summary: String(f.get('summary')),
    })
    setOpen(false)
    e.currentTarget.reset()
  }

  return (
    <>
      <div className="top">
        <div>
          <h1>Кандидаты</h1>
          <p className="muted">Внутренняя база резюме агентства.</p>
        </div>
        <button className="btn" type="button" onClick={() => setOpen((v) => !v)}>
          Добавить в базу
        </button>
      </div>

      {open && (
        <form className="card form-grid" onSubmit={onSubmit} style={{ marginBottom: 16 }}>
          <label className="field">
            ФИО
            <input name="name" required />
          </label>
          <label className="field">
            Специализация
            <input name="title" required placeholder="Frontend, React" />
          </label>
          <label className="field">
            Город
            <input name="city" />
          </label>
          <label className="field">
            Ожидания
            <input name="salary" placeholder="280k" />
          </label>
          <label className="field">
            Опыт, лет
            <input name="experienceYears" type="number" min={0} />
          </label>
          <label className="field">
            Источник
            <input name="source" placeholder="Своя база / hh.ru" />
          </label>
          <label className="field">
            Телефон
            <input name="phone" />
          </label>
          <label className="field">
            Email
            <input name="email" type="email" />
          </label>
          <label className="field wide">
            Навыки (через запятую)
            <input name="skills" placeholder="Go, Kubernetes, PostgreSQL" />
          </label>
          <label className="field wide">
            Кратко
            <textarea name="summary" rows={3} />
          </label>
          <div className="row">
            <button className="btn" type="submit">
              Сохранить
            </button>
            <button className="btn ghost" type="button" onClick={() => setOpen(false)}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Кандидат</th>
              <th>Город</th>
              <th>Опыт</th>
              <th>Вилка</th>
              <th>Источник</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr
                key={c.id}
                className="clickable"
                onClick={() => navigate(`/candidates/${c.id}`)}
              >
                <td>
                  <strong>{c.name}</strong>
                  <div className="muted">{c.title}</div>
                </td>
                <td>{c.city}</td>
                <td>{c.experienceYears} лет</td>
                <td>{c.salary}</td>
                <td>{c.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
