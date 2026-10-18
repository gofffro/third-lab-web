# Карта маршрутов и модель данных

| Адрес | Компонент | Назначение |
|---|---|---|
| `/` | `HomePage` | Обзор списков и создание первого списка |
| `/lists/:listId` | `ListPage` | Задачи выбранного списка |
| `/lists/:listId/tasks/:taskId` | `TaskPage` | Вложенная карточка задачи |
| `*` | `NotFoundPage` | Неизвестный адрес |

Параметры строки запроса: `filter=all|active|completed`, `q=текст поиска`. Они сохраняются при перезагрузке и переходах назад/вперёд.

```js
{
  lists: [{ id, name, createdAt }],
  tasks: [{
    id, listId, title, description, done, createdAt,
    subtasks: [{ id, title, done }],
  }],
}
```

Действия редьюсера: `list/added`, `list/updated`, `list/removed`, `task/added`, `task/updated`, `task/toggled`, `task/removed`, `subtask/added`, `subtask/toggled`, `subtask/removed`.

