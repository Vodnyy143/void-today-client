import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTasks } from '../../features/tasks/tasksSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import TaskCard from '../../components/TaskCard/TaskCard';
import QuickAdd from '../../components/QuickAdd/QuickAdd';
import type { Task } from '../../types';
import styles from './Tasks.module.css';

type Tab = 'ALL' | 'TODO' | 'DONE' | 'ARCHIVED';

const PRIORITY_ORDER: Task['priority'][] = ['HIGH', 'MEDIUM', 'LOW'];
const PRIORITY_LABEL: Record<Task['priority'], string> = {
  HIGH: '🔴 горит',
  MEDIUM: '🟡 надо',
  LOW: '⚫ потом',
};

export default function Tasks() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.tasks);
  const categories = useAppSelector((s) => s.categories.items);

  const [tab, setTab] = useState<Tab>('ALL');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filtered = useMemo(() => {
    return items.filter((t) => {
      if (tab !== 'ALL' && t.status !== tab) return false;
      if (catFilter && t.categoryId !== catFilter) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, tab, search, catFilter]);

  const grouped = useMemo(() => {
    return PRIORITY_ORDER.map((p) => ({
      priority: p,
      tasks: filtered.filter((t) => t.priority === p),
    })).filter((g) => g.tasks.length > 0);
  }, [filtered]);

  return (
    <div>
      <div className={styles.toolbar}>
        <input
          className={`input ${styles.search}`}
          placeholder="поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.tabs}>
          {(['ALL', 'TODO', 'DONE', 'ARCHIVED'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`btn ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'ALL' ? 'все' : t === 'TODO' ? 'в работе' : t === 'DONE' ? 'готово' : 'архив'}
            </button>
          ))}
        </div>

        <select
          className={`select ${styles.catSelect}`}
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="">все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={() => setQuickAddOpen(true)}>
          + задача
        </button>
      </div>

      {loading && (
        <div className={styles.spinnerWrap}>
          <span className="spinner" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">задач нет</div>
      )}

      {grouped.map(({ priority, tasks }) => (
        <div key={priority} className={styles.group}>
          <div className={styles.groupLabel}>{PRIORITY_LABEL[priority]}</div>
          <div className={styles.list}>
            {tasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
      ))}

      {quickAddOpen && <QuickAdd onClose={() => setQuickAddOpen(false)} />}
    </div>
  );
}
