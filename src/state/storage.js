export const STORAGE_KEY = 'todo-app:v2';

export const EMPTY_STATE = { lists: [], tasks: [] };

function isSubtask(value) {
  return value && typeof value === 'object'
    && typeof value.id === 'string'
    && typeof value.title === 'string'
    && typeof value.done === 'boolean';
}

function isList(value) {
  return value && typeof value === 'object'
    && typeof value.id === 'string'
    && typeof value.name === 'string';
}

function isTask(value) {
  return value && typeof value === 'object'
    && typeof value.id === 'string'
    && typeof value.listId === 'string'
    && typeof value.title === 'string'
    && typeof value.description === 'string'
    && typeof value.done === 'boolean'
    && Array.isArray(value.subtasks)
    && value.subtasks.every(isSubtask);
}

export function sanitizeState(value) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.lists) || !Array.isArray(value.tasks)) {
    return null;
  }
  if (!value.lists.every(isList) || !value.tasks.every(isTask)) return null;
  const listIds = new Set(value.lists.map((list) => list.id));
  if (value.tasks.some((task) => !listIds.has(task.listId))) return null;
  return {
    lists: value.lists.map((list) => ({
      id: list.id,
      name: list.name.slice(0, 80),
      createdAt: Number.isFinite(list.createdAt) ? list.createdAt : Date.now(),
    })),
    tasks: value.tasks.map((task) => ({
      id: task.id,
      listId: task.listId,
      title: task.title.slice(0, 120),
      description: task.description.slice(0, 600),
      done: task.done,
      createdAt: Number.isFinite(task.createdAt) ? task.createdAt : Date.now(),
      subtasks: task.subtasks.map((subtask) => ({
        id: subtask.id,
        title: subtask.title.slice(0, 120),
        done: subtask.done,
      })),
    })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    return sanitizeState(JSON.parse(raw)) ?? EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
