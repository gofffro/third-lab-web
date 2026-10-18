import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useParams, useSearchParams } from 'react-router-dom';
import { AddTaskForm } from '../components/tasks/AddTaskForm.jsx';
import { TaskFilters } from '../components/tasks/TaskFilters.jsx';
import { TaskItem } from '../components/tasks/TaskItem.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useTodos } from '../state/TodoContext.jsx';

export function ListPage() {
  const { listId } = useParams();
  const { state } = useTodos();
  const headingRef = useRef(null);
  const list = state.lists.find((item) => item.id === listId);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || 'all';
  const [query, setQuery] = useState(urlQuery);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setQuery(urlQuery);
  }, [listId, urlQuery]);

  useEffect(() => {
    if (debouncedQuery === urlQuery) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedQuery.trim()) next.set('q', debouncedQuery);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  }, [debouncedQuery, searchParams, setSearchParams, urlQuery]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [listId]);

  const listTasks = useMemo(() => state.tasks.filter((task) => task.listId === listId), [state.tasks, listId]);
  const counts = useMemo(() => ({
    all: listTasks.length,
    active: listTasks.filter((task) => !task.done).length,
    completed: listTasks.filter((task) => task.done).length,
  }), [listTasks]);
  const visibleTasks = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLocaleLowerCase();
    return listTasks.filter((task) => {
      const matchesFilter = filter === 'active' ? !task.done : filter === 'completed' ? task.done : true;
      return matchesFilter && (!normalizedQuery || task.title.toLocaleLowerCase().includes(normalizedQuery));
    });
  }, [debouncedQuery, filter, listTasks]);

  if (!list) {
    return <main className="not-found"><p className="eyebrow">ОШИБКА 404</p><h1>Список не найден</h1><p className="muted">Возможно, он был удалён или ссылка устарела.</p><Link className="button button--primary" to="/">Вернуться на главную</Link></main>;
  }

  const clearSearch = () => {
    setQuery('');
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next);
  };

  return (
    <main className="list-page" aria-labelledby="list-title">
      <div className="breadcrumb"><Link to="/">Все списки</Link><span>/</span><span>{list.name}</span></div>
      <header className="list-page-header">
        <div>
          <p className="eyebrow">СПИСОК ЗАДАЧ <span className="header-slash">/</span> {String(counts.active).padStart(2, '0')} АКТИВНЫХ</p>
          <h1 id="list-title" ref={headingRef} tabIndex="-1">{list.name}</h1>
          <p className="list-subtitle">{counts.all === 0 ? 'Пока здесь пусто — добавьте первый шаг.' : `${counts.all} ${counts.all === 1 ? 'задача' : 'задач'} в этом списке`}</p>
        </div>
        <div className="list-header-stat"><strong>{String(counts.active).padStart(2, '0')}</strong><span>открыто</span></div>
      </header>

      <AddTaskForm listId={list.id} />
      <div className="list-toolbar">
        <TaskFilters counts={counts} />
        <label className="search-field"><span aria-hidden="true">⌕</span><span className="sr-only">Поиск по задачам</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск задач..." /></label>
      </div>

      {visibleTasks.length > 0 ? (
        <ul className="task-list" aria-label={`Задачи списка ${list.name}`}>
          {visibleTasks.map((task) => <TaskItem key={task.id} task={task} listId={list.id} />)}
        </ul>
      ) : listTasks.length === 0 ? (
        <section className="empty-state panel"><span className="empty-symbol" aria-hidden="true">+</span><h2>No tasks</h2><p>Добавьте первую задачу выше.</p></section>
      ) : debouncedQuery ? (
        <section className="empty-state panel"><span className="empty-symbol" aria-hidden="true">⌕</span><h2>Ничего не найдено</h2><p>По запросу «{debouncedQuery}» нет совпадений.</p><button className="button button--quiet" type="button" onClick={clearSearch}>Сбросить поиск</button></section>
      ) : (
        <section className="empty-state panel"><span className="empty-symbol" aria-hidden="true">✓</span><h2>В этом фильтре пусто</h2><p>Попробуйте выбрать другой фильтр.</p></section>
      )}
      <div className="list-footer-note"><span>Обновляется автоматически</span><span className="footer-line" /><span>Данные хранятся в браузере</span></div>
      <Outlet />
    </main>
  );
}
