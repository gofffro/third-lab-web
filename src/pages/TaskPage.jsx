import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { createId, useTodos } from '../state/TodoContext.jsx';

export function TaskPage() {
  const { listId, taskId } = useParams();
  const { state, dispatch } = useTodos();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const task = state.tasks.find((item) => item.id === taskId && item.listId === listId);
  const list = state.lists.find((item) => item.id === listId);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    titleRef.current?.focus();
  }, [taskId, task?.title, task?.description]);

  if (!task || !list) {
    return <div className="task-overlay"><section className="task-dialog not-found" role="dialog" aria-modal="true"><p className="eyebrow">ОШИБКА 404</p><h2>Задача не найдена</h2><p className="muted">Проверьте ссылку или вернитесь к списку.</p><Link className="button button--primary" to={`/lists/${listId || ''}`}>Вернуться к списку</Link></section></div>;
  }

  const saveField = (field, value) => {
    const clean = value.trim();
    if (field === 'title' && !clean) {
      setTitle(task.title);
      return;
    }
    if (clean !== task[field]) dispatch({ type: 'task/updated', id: task.id, changes: { [field]: clean } });
  };

  const addSubtask = (event) => {
    event.preventDefault();
    const clean = subtaskTitle.trim();
    if (!clean) return;
    dispatch({ type: 'subtask/added', taskId: task.id, subtask: { id: createId('subtask'), title: clean, done: false } });
    setSubtaskTitle('');
  };

  const close = () => navigate(`/lists/${list.id}${searchParams.toString() ? `?${searchParams}` : ''}`);
  const removeTask = () => {
    dispatch({ type: 'task/removed', id: task.id });
    navigate(`/lists/${list.id}`);
  };
  const doneCount = task.subtasks.filter((subtask) => subtask.done).length;
  const progress = task.subtasks.length ? Math.round(doneCount / task.subtasks.length * 100) : 0;

  return (
    <div className="task-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className="task-dialog" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title">
        <header className="task-dialog-header"><div><p className="eyebrow">КАРТОЧКА ЗАДАЧИ</p><p className="task-dialog-breadcrumb">{list.name} <span>/</span> {task.done ? 'Готово' : 'В работе'}</p></div><button className="dialog-close" type="button" onClick={close} aria-label="Закрыть карточку">×</button></header>
        <div className="task-dialog-body">
          <label className="field-label" htmlFor="task-title">Название</label>
          <input ref={titleRef} id="task-title" className="task-title-input" value={title} onChange={(event) => setTitle(event.target.value)} onBlur={() => saveField('title', title)} maxLength={120} />
          <label className="field-label" htmlFor="task-description">Описание</label>
          <textarea id="task-description" className="task-description-input" value={description} onChange={(event) => setDescription(event.target.value)} onBlur={() => saveField('description', description)} maxLength={600} rows={4} placeholder="Добавьте описание..." />

          <section className="subtasks-section" aria-labelledby="subtasks-title">
            <div className="subtasks-heading"><div><p className="eyebrow">МАЛЕНЬКИЕ ШАГИ</p><h2 id="subtasks-title">Подзадачи</h2></div><strong>{doneCount} <span>из</span> {task.subtasks.length}</strong></div>
            {task.subtasks.length > 0 && <div className="progress-bar" aria-label={`Выполнено ${doneCount} из ${task.subtasks.length}`}><span style={{ width: `${progress}%` }} /></div>}
            <ul className="subtask-list">
              {task.subtasks.map((subtask) => <li key={subtask.id} className={subtask.done ? 'subtask done' : 'subtask'}>
                <input id={`subtask-${subtask.id}`} type="checkbox" checked={subtask.done} onChange={() => dispatch({ type: 'subtask/toggled', taskId: task.id, id: subtask.id })} />
                <label htmlFor={`subtask-${subtask.id}`}>{subtask.title}</label>
                <button type="button" onClick={() => dispatch({ type: 'subtask/removed', taskId: task.id, id: subtask.id })} aria-label={`Удалить подзадачу ${subtask.title}`}>×</button>
              </li>)}
            </ul>
            <form className="subtask-add" onSubmit={addSubtask}><input value={subtaskTitle} onChange={(event) => setSubtaskTitle(event.target.value)} placeholder="Добавить подзадачу" maxLength={120} aria-label="Новая подзадача" /><button type="submit" aria-label="Добавить подзадачу">+</button></form>
          </section>
        </div>
        <footer className="task-dialog-footer"><span>Создано {new Date(task.createdAt).toLocaleDateString('ru-RU')}</span><button className="danger-link" type="button" onClick={() => setDeleteOpen(true)}>Удалить задачу</button></footer>
      </section>
      <ConfirmDialog open={deleteOpen} title="Удалить задачу?" description={`«${task.title}» и все её подзадачи будут удалены.`} onCancel={() => setDeleteOpen(false)} onConfirm={removeTask} />
    </div>
  );
}
