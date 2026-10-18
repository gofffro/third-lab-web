import { useSearchParams } from 'react-router-dom';

const filters = [
  ['all', 'Все'],
  ['active', 'Активные'],
  ['completed', 'Выполненные'],
];

export function TaskFilters({ counts }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get('filter') || 'all';

  const setFilter = (filter) => {
    const next = new URLSearchParams(searchParams);
    if (filter === 'all') next.delete('filter');
    else next.set('filter', filter);
    setSearchParams(next);
  };

  return (
    <div className="filters" aria-label="Фильтр задач">
      {filters.map(([value, label]) => (
        <button key={value} type="button" className={current === value ? 'filter active' : 'filter'} onClick={() => setFilter(value)} aria-pressed={current === value}>
          {label}<span>{counts[value]}</span>
        </button>
      ))}
    </div>
  );
}
