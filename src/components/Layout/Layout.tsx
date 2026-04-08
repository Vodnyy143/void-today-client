import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import QuickAdd from '../QuickAdd/QuickAdd';
import styles from './Layout.module.css';

const NAV_ITEMS = [
  { to: '/', label: 'дашборд', end: true },
  { to: '/tasks', label: 'задачи', end: false },
  { to: '/goals', label: 'цели', end: false },
  { to: '/notes', label: 'заметки', end: false },
  { to: '/stats', label: 'статы', end: false },
];

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>VOID.TODAY</div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          {user && <span className={styles.userName}>{user.name}</span>}
          <button className={`btn btn-danger ${styles.logoutBtn}`} onClick={handleLogout}>
            выйти
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <span className={styles.date}>
            {dateStr} · день {getDayOfYear()}
          </span>
          <button className={`btn btn-primary ${styles.addBtn}`} onClick={() => setQuickAddOpen(true)}>
            + задача
          </button>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>

      {quickAddOpen && <QuickAdd onClose={() => setQuickAddOpen(false)} />}
    </div>
  );
}
