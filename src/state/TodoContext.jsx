import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { loadState, saveState } from './storage.js';
import { todoReducer } from './todoReducer.js';

const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const value = useContext(TodoContext);
  if (!value) throw new Error('useTodos должен использоваться внутри TodoProvider');
  return value;
}

export function createId(prefix = 'id') {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
