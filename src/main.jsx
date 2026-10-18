import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './router.jsx';
import { TodoProvider } from './state/TodoContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import './styles/tokens.css';
import './styles/base.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <TodoProvider>
        <AppRouter />
      </TodoProvider>
    </ThemeProvider>
  </StrictMode>,
);
