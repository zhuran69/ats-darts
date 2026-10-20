import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from './Logo'
import { useStore } from '../data/store'

const links = [
  { to: '/', label: 'Обзор' },
  { to: '/search', label: 'Поиск' },
  { to: '/vacancies', label: 'Вакансии' },
  { to: '/candidates', label: 'Кандидаты' },
  { to: '/clients', label: 'Заказчики' },
  { to: '/pipeline', label: 'Воронка' },
]

export function Layout() {
  const { resetDemo } = useStore()

  return (
    <div className="app">
      <aside className="sidebar">
        <Logo />
        <nav className="nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          Внутренний кабинет агентства
          <button type="button" className="btn ghost small" onClick={resetDemo}>
            Сбросить демо-данные
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
