import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <main className="not-found"><p className="eyebrow">ОШИБКА 404</p><h1>Страница не найдена</h1><p className="muted">Похоже, этот адрес больше не существует.</p><Link className="button button--primary" to="/">Вернуться на главную</Link></main>;
}
