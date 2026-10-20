import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../data/store'
import type { VacancyStatus } from '../types'

const statusLabel: Record<VacancyStatus, string> = {
  open: 'Открыта',
  hold: 'Пауза',
  closed: 'Закрыта',
}

export function Vacancies() {
  const { vacancies, clients, applications, addVacancy } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    addVacancy({
      title: String(f.get('title')),
      clientId: String(f.get('clientId')),
      city: String(f.get('city')),
      grade: String(f.get('grade')),
      salary: String(f.get('salary')),
      status: 'open',
      recruiter: String(f.get('recruiter')),
      description: String(f.get('description')),
    })
    setOpen(false)
    e.currentTarget.reset()
  }

  return (
    <>
      <div className="top">
        <div>
          <h1>Вакансии</h1>
          <p className="muted">Проекты заказчиков и воронки подбора.</p>
        </div>
        <button className="btn" type="button" onClick={() => setOpen((v) => !v)}>
          Новая вакансия
        </button>
      </div>

      {open && (
        <form className="card form-grid" onSubmit={onSubmit} style={{ marginBottom: 16 }}>
          <label className="field">
            Название
            <input name="title" required placeholder="Senior Python" />
          </label>
          <label className="field">
            Заказчик
            <select name="clientId" required>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Город
            <input name="city" placeholder="Москва" />
          </label>
          <label className="field">
            Грейд
            <input name="grade" placeholder="Middle+" />
          </label>
          <label className="field">
            Вилка
            <input name="salary" placeholder="250–320k" />
          </label>
          <label className="field">
            Рекрутер
            <input name="recruiter" defaultValue="Антон" />
          </label>
          <label className="field wide">
            Описание
            <textarea name="description" rows={3} />
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
              <th>Вакансия</th>
              <th>Заказчик</th>
              <th>Город</th>
              <th>Статус</th>
              <th>В воронке</th>
              <th>Рекрутер</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map((v) => {
              const client = clients.find((c) => c.id === v.clientId)
              const count = applications.filter((a) => a.vacancyId === v.id).length
              return (
                <tr
                  key={v.id}
                  className="clickable"
                  onClick={() => navigate(`/vacancies/${v.id}`)}
                >
                  <td>
                    <strong>{v.title}</strong>
                    <div className="muted">{v.grade} · {v.salary}</div>
                  </td>
                  <td>{client?.name}</td>
                  <td>{v.city}</td>
                  <td>
                    <span className={`badge ${v.status}`}>{statusLabel[v.status]}</span>
                  </td>
                  <td>{count}</td>
                  <td>{v.recruiter}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
