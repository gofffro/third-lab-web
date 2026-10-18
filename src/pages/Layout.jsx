import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/lists/Sidebar.jsx';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <header className="mobile-header">
          <button className="menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Открыть меню">☰</button>
          <span className="mobile-brand"><span className="brand-mark">F</span> Focus</span>
          <span className="mobile-path" aria-live="polite">{location.pathname.includes('/tasks/') ? 'Задача' : location.pathname.includes('/lists/') ? 'Список' : 'Обзор'}</span>
        </header>
        <div className="page-wrap"><Outlet /></div>
      </div>
    </div>
  );
}
