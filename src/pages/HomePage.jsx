import { Link, useNavigate } from 'react-router-dom';
import { AddListForm } from '../components/lists/AddListForm.jsx';
import { useTodos } from '../state/TodoContext.jsx';

export function HomePage() {
  const { state } = useTodos();
  const navigate = useNavigate();
  const totalTasks = state.tasks.length;
  const openTasks = state.tasks.filter((task) => !task.done).length;

  return (
    <main className={`home-page${state.lists.length === 0 ? ' home-mockup' : ''}`} aria-labelledby="home-title">
      <div className="home-kicker"><span className="status-dot" aria-hidden="true" /> ЛИЧНОЕ ПРОСТРАНСТВО</div>
      <div className="home-hero">
        <div>
          <h1 id="home-title">Дела, которые<br /><em>двигают вперёд.</em></h1>
          <p>Соберите мысли в списки, разбейте большие цели на маленькие шаги и отмечайте прогресс.</p>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span>○</span><b>F</b></div>
      </div>

      {state.lists.length === 0 ? (
        <>
        <section className="home-start panel" aria-labelledby="start-title">
          <div className="panel-index">01</div>
          <div>
            <p className="eyebrow">ПЕРВЫЙ ШАГ</p>
            <h2 id="start-title">Создайте свой первый список</h2>
            <p className="muted">Например, «Работа», «Учёба» или «Личное». Вы сможете менять название и удалять списки в любой момент.</p>
            <AddListForm onCreated={(id) => navigate(`/lists/${id}`)} />
          </div>
        </section>
        <section className="empty-state home-empty" aria-live="polite"><span className="empty-symbol" aria-hidden="true" /><h2>No tasks</h2></section>
        </>
      ) : (
        <section className="home-dashboard" aria-labelledby="dashboard-title">
          <div className="section-heading-row"><div><p className="eyebrow">ОБЗОР</p><h2 id="dashboard-title">Ваши списки</h2></div><span className="muted">{openTasks} активных из {totalTasks}</span></div>
          <div className="list-overview-grid">
            {state.lists.map((list, index) => {
              const count = state.tasks.filter((task) => task.listId === list.id && !task.done).length;
              const total = state.tasks.filter((task) => task.listId === list.id).length;
              return <Link className="overview-card" to={`/lists/${list.id}`} key={list.id}>
                <span className="overview-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="overview-card-name">{list.name}</span>
                <span className="overview-card-meta">{count} активных · {total} всего</span>
                <span className="overview-arrow" aria-hidden="true">↗</span>
              </Link>;
            })}
          </div>
          <div className="home-quick-add panel"><div><p className="eyebrow">СЛЕДУЮЩИЙ ШАГ</p><p>Откройте список и добавьте задачу, чтобы увидеть её прогресс.</p></div><span aria-hidden="true">→</span></div>
        </section>
      )}
      <footer className="page-footer"><span>FOCUS / TODO MANAGER</span><span>Сделано для ясности</span></footer>
    </main>
  );
}
