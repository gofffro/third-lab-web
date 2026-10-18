import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../common/ConfirmDialog.jsx';
import { AddListForm } from './AddListForm.jsx';
import { useTheme } from '../../theme/ThemeContext.jsx';
import { useTodos } from '../../state/TodoContext.jsx';

function activeCount(tasks, listId) {
  return tasks.filter((task) => task.listId === listId && !task.done).length;
}

export function Sidebar({ open, onClose }) {
  const { state, dispatch } = useTodos();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const createList = (id) => {
    navigate(`/lists/${id}`);
    onClose?.();
  };

  const startRename = (list) => {
    setRenamingId(list.id);
    setRenameValue(list.name);
  };

  const saveRename = () => {
    const value = renameValue.trim();
    if (renamingId && value) dispatch({ type: 'list/updated', id: renamingId, changes: { name: value } });
    setRenamingId(null);
  };

  const deleteList = () => {
    if (!deleteTarget) return;
    dispatch({ type: 'list/removed', id: deleteTarget.id });
    setDeleteTarget(null);
    navigate('/');
  };

  return (
    <>
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} aria-label="Списки задач">
        <div className="sidebar-brand">
          <div className="brand-mark" aria-hidden="true">F</div>
          <div>
            <strong>Focus</strong>
            <span>task manager</span>
          </div>
          <button className="sidebar-close" type="button" onClick={onClose} aria-label="Закрыть панель">×</button>
        </div>

        <div className="sidebar-section-title"><span>МОИ СПИСКИ</span><span>{state.lists.length}</span></div>
        <nav className="list-nav">
          {state.lists.length === 0 && <p className="sidebar-empty">Создайте первый список,<br />чтобы начать.</p>}
          {state.lists.map((list) => (
            <div className="list-nav-row" key={list.id}>
              {renamingId === list.id ? (
                <form className="rename-form" onSubmit={(event) => { event.preventDefault(); saveRename(); }}>
                  <input value={renameValue} onChange={(event) => setRenameValue(event.target.value)} autoFocus maxLength={80} aria-label="Название списка" />
                  <button type="submit" aria-label="Сохранить название">✓</button>
                </form>
              ) : (
                <NavLink to={`/lists/${list.id}`} className={({ isActive }) => `list-link${isActive ? ' active' : ''}`} onClick={onClose}>
                  <span className="list-dot" aria-hidden="true" />
                  <span className="list-link-name">{list.name}</span>
                  <span className="list-count">{activeCount(state.tasks, list.id)}</span>
                </NavLink>
              )}
              <div className="list-actions">
                <button type="button" onClick={() => startRename(list)} aria-label={`Переименовать список ${list.name}`} title="Переименовать">✎</button>
                <button type="button" onClick={() => setDeleteTarget(list)} aria-label={`Удалить список ${list.name}`} title="Удалить">×</button>
              </div>
            </div>
          ))}
        </nav>
        <AddListForm onCreated={createList} />

        <div className="sidebar-bottom">
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Сменить тему">
            <span className="theme-toggle-icon" aria-hidden="true">{theme === 'dark' ? '☼' : '◐'}</span>
            <span>{theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>
          </button>
          <p className="sidebar-tip">Маленькие шаги.<br />Заметный прогресс.</p>
        </div>
      </aside>
      {open && <button className="sidebar-scrim" type="button" onClick={onClose} aria-label="Закрыть панель" />}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить список?"
        description={deleteTarget ? `Список «${deleteTarget.name}» и все его задачи будут удалены без возможности восстановления.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteList}
      />
    </>
  );
}
