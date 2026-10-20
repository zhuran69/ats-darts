import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../data/store'

export function Clients() {
  const { clients, vacancies, addClient } = useStore()
  const [open, setOpen] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    addClient({
      name: String(f.get('name')),
      industry: String(f.get('industry')),
      contact: String(f.get('contact')),
      email: String(f.get('email')),
      notes: String(f.get('notes')),
    })
    setOpen(false)
    e.currentTarget.reset()
  }

  return (
    <>
      <div className="top">
        <div>
          <h1>Заказчики</h1>
          <p className="muted">Компании, с которыми работает агентство.</p>
        </div>
        <button className="btn" type="button" onClick={() => setOpen((v) => !v)}>
          Новый заказчик
        </button>
      </div>

      {open && (
        <form className="card form-grid" onSubmit={onSubmit} style={{ marginBottom: 16 }}>
          <label className="field">
            Компания
            <input name="name" required />
          </label>
          <label className="field">
            Отрасль
            <input name="industry" placeholder="IT / Cloud" />
          </label>
          <label className="field">
            Контакт
            <input name="contact" />
          </label>
          <label className="field">
            Email
            <input name="email" type="email" />
          </label>
          <label className="field wide">
            Заметки
            <textarea name="notes" rows={3} />
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

      <div className="grid cards">
        {clients.map((c) => {
          const vacs = vacancies.filter((v) => v.clientId === c.id)
          return (
            <article key={c.id} className="card">
              <h3>{c.name}</h3>
              <p className="muted">{c.industry}</p>
              <p>
                {c.contact}
                <br />
                {c.email}
              </p>
              <p>{c.notes}</p>
              <div className="chips" style={{ marginTop: 10 }}>
                {vacs.map((v) => (
                  <Link key={v.id} to={`/vacancies/${v.id}`} className="chip">
                    {v.title}
                  </Link>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
