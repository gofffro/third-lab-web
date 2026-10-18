import { Link, useLocation } from 'react-router-dom';
import { useTodos } from '../../state/TodoContext.jsx';

export function TaskItem({ task, listId }) {
  const { dispatch } = useTodos();
  const location = useLocation();
  const doneSubtasks = task.subtasks.filter((subtask) => subtask.done).length;
  const hasSubtasks = task.subtasks.length > 0;

  return (
    <li className={`task-item${task.done ? ' task-item--done' : ''}`}>
      <input
        id={`task-${task.id}`}
        className="task-check"
        type="checkbox"
        checked={task.done}
        onChange={() => dispatch({ type: 'task/toggled', id: task.id })}
        aria-label={`${task.done ? 'Вернуть в активные' : 'Выполнить'}: ${task.title}`}
      />
      <div className="task-item-content">
        <Link className="task-item-title" to={`/lists/${listId}/tasks/${task.id}${location.search}`}>
          {task.title}
        </Link>
        {task.description && <p className="task-item-description">{task.description}</p>}
        {hasSubtasks && <span className="task-progress"><span aria-hidden="true">◒</span> {doneSubtasks}/{task.subtasks.length} подзадач</span>}
      </div>
      <Link className="task-open" to={`/lists/${listId}/tasks/${task.id}${location.search}`} aria-label={`Открыть задачу ${task.title}`} title="Открыть карточку">→</Link>
    </li>
  );
}
