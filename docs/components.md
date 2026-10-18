# Дерево компонентов

```text
AppRouter
└── Layout
    ├── Sidebar
    │   ├── ListNav / NavLink
    │   ├── AddListForm
    │   └── ConfirmDialog
    └── Outlet
        ├── HomePage
        │   └── AddListForm / ListOverviewCard
        └── ListPage
            ├── AddTaskForm
            ├── TaskFilters
            ├── SearchField
            ├── TaskItem
            ├── EmptyState
            └── Outlet → TaskPage
                ├── Editable task fields
                ├── SubtaskList
                └── ConfirmDialog
```

`TodoProvider` владеет данными приложения и передаёт вниз только состояние и функции через контекст. `ListPage` хранит только локальный текст поля поиска и вычисляет фильтрованный список из URL и контекста. `TaskPage` хранит временный текст редактируемых полей и отправляет изменения в редьюсер на blur.

