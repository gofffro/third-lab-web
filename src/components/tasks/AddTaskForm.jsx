import { useState } from 'react';
import { createId, useTodos } from '../../state/TodoContext.jsx';

export function AddTaskForm({ listId }) {
  const { dispatch } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Добавьте название задачи.');
      return;
    }
    dispatch({
      type: 'task/added',
      task: {
        id: createId('task'), listId, title: cleanTitle, description: description.trim(),
        done: false, subtasks: [], createdAt: Date.now(),
      },
    });
    setTitle('');
    setDescription('');
    setError('');
  };

  return (
    <form className="add-task-form" onSubmit={submit} noValidate>
      <div className="add-task-fields">
        <label className="sr-only" htmlFor="new-task-title">Название новой задачи</label>
        <input
          id="new-task-title"
          value={title}
          onChange={(event) => { setTitle(event.target.value); setError(''); }}
          placeholder="Title..."
          maxLength={120}
          aria-invalid={Boolean(error)}
        />
        <label className="sr-only" htmlFor="new-task-description">Описание новой задачи</label>
        <input
          id="new-task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="About..."
          maxLength={600}
        />
      </div>
      <button className="add-task-submit" type="submit" aria-label="Добавить задачу"><span aria-hidden="true">+</span><span>Добавить</span></button>
      {error && <p className="field-error add-task-error" role="alert">{error}</p>}
    </form>
  );
}
