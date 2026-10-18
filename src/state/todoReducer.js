export function todoReducer(state, action) {
  switch (action.type) {
    case 'list/added':
      return { ...state, lists: [...state.lists, action.list] };
    case 'list/updated':
      return {
        ...state,
        lists: state.lists.map((list) => list.id === action.id
          ? { ...list, ...action.changes }
          : list),
      };
    case 'list/removed':
      return {
        lists: state.lists.filter((list) => list.id !== action.id),
        tasks: state.tasks.filter((task) => task.listId !== action.id),
      };
    case 'task/added':
      return { ...state, tasks: [...state.tasks, action.task] };
    case 'task/updated':
      return {
        ...state,
        tasks: state.tasks.map((task) => task.id === action.id
          ? { ...task, ...action.changes }
          : task),
      };
    case 'task/toggled':
      return {
        ...state,
        tasks: state.tasks.map((task) => task.id === action.id
          ? { ...task, done: !task.done }
          : task),
      };
    case 'task/removed':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };
    case 'subtask/added':
      return {
        ...state,
        tasks: state.tasks.map((task) => task.id === action.taskId
          ? { ...task, subtasks: [...task.subtasks, action.subtask] }
          : task),
      };
    case 'subtask/toggled':
      return {
        ...state,
        tasks: state.tasks.map((task) => task.id !== action.taskId
          ? task
          : {
            ...task,
            subtasks: task.subtasks.map((subtask) => subtask.id === action.id
              ? { ...subtask, done: !subtask.done }
              : subtask),
          }),
      };
    case 'subtask/removed':
      return {
        ...state,
        tasks: state.tasks.map((task) => task.id === action.taskId
          ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== action.id) }
          : task),
      };
    default:
      throw new Error(`Неизвестное действие: ${action.type}`);
  }
}
