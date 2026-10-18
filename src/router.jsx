import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './pages/Layout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ListPage } from './pages/ListPage.jsx';
import { TaskPage } from './pages/TaskPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="lists/:listId" element={<ListPage />}>
            <Route path="tasks/:taskId" element={<TaskPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
