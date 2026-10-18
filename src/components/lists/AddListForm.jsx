import { useState } from 'react';
import { createId, useTodos } from '../../state/TodoContext.jsx';

export function AddListForm({ onCreated }) {
  const { dispatch } = useTodos();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Введите название списка.');
      return;
    }
    const list = { id: createId('list'), name: cleanName, createdAt: Date.now() };
    dispatch({ type: 'list/added', list });
    setName('');
    setError('');
    onCreated?.(list.id);
  };

  return (
    <form className="add-list-form" onSubmit={submit} noValidate>
      <label htmlFor="new-list-name">Новый список</label>
      <div className="inline-input">
        <input
          id="new-list-name"
          value={name}
          onChange={(event) => { setName(event.target.value); setError(''); }}
          placeholder="Например, Учёба"
          maxLength={80}
          aria-invalid={Boolean(error)}
        />
        <button className="square-button" type="submit" aria-label="Создать список">+</button>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
    </form>
  );
}
