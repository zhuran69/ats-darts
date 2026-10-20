import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../data/store'

export function Search() {
  const { candidates } = useStore()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [skill, setSkill] = useState('')

  const cities = [...new Set(candidates.map((c) => c.city))].sort()
  const skills = [...new Set(candidates.flatMap((c) => c.skills))].sort()

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    return candidates.filter((c) => {
      const hay = [c.name, c.title, c.summary, c.source, ...c.skills]
        .join(' ')
        .toLowerCase()
      const matchQ = !query || hay.includes(query)
      const matchCity = !city || c.city === city
      const matchSkill = !skill || c.skills.includes(skill)
      return matchQ && matchCity && matchSkill
    })
  }, [candidates, q, city, skill])

  return (
    <>
      <div className="top">
        <div>
          <h1>Поиск по базе</h1>
          <p className="muted">Имя, специализация, навыки, город — как привычная форма рекрутера.</p>
        </div>
      </div>

      <div className="card row" style={{ marginBottom: 16 }}>
        <label className="field" style={{ flex: 1 }}>
          Запрос
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Go, product, React…"
          />
        </label>
        <label className="field">
          Город
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Любой</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Навык
          <select value={skill} onChange={(e) => setSkill(e.target.value)}>
            <option value="">Любой</option>
            {skills.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="muted" style={{ marginBottom: 10 }}>
        Найдено: {results.length}
      </p>

      <div className="grid cards">
        {results.map((c) => (
          <Link key={c.id} to={`/candidates/${c.id}`} className="card">
            <h3>{c.name}</h3>
            <p className="muted">
              {c.title} · {c.city} · {c.experienceYears} лет
            </p>
            <div className="chips" style={{ marginTop: 10 }}>
              {c.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      {results.length === 0 && <p className="empty">Никого не нашли. Снимите фильтры.</p>}
    </>
  )
}
