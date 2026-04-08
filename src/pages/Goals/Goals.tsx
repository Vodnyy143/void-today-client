import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchGoals, createGoal } from '../../features/goals/goalsSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import GoalBar from '../../components/GoalBar/GoalBar';
import type { GoalLevel } from '../../types';
import styles from './Goals.module.css';

const SECTIONS: { level: GoalLevel; label: string }[] = [
  { level: 'LIFE', label: 'жизнь' },
  { level: 'MONTH', label: 'месяц' },
  { level: 'WEEK', label: 'неделя' },
];

export default function Goals() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.goals);
  const categories = useAppSelector((s) => s.categories.items);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<GoalLevel>('MONTH');
  const [deadline, setDeadline] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await dispatch(createGoal({
      title: title.trim(),
      level,
      ...(deadline ? { deadline } : {}),
      ...(categoryId ? { categoryId } : {}),
    }));
    setTitle('');
    setDeadline('');
    setCategoryId('');
    setShowForm(false);
  };

  return (
    <div>
      <div className={styles.header}>
        <button className="btn btn-primary" onClick={() => setShowForm((p) => !p)}>
          {showForm ? '✕ отмена' : '+ цель'}
        </button>
      </div>

      {showForm && (
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="название цели..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <div className={styles.formRow}>
            <select className="select" value={level} onChange={(e) => setLevel(e.target.value as GoalLevel)}>
              <option value="LIFE">жизнь</option>
              <option value="MONTH">месяц</option>
              <option value="WEEK">неделя</option>
            </select>
            <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">без категории</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              className="input"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="дедлайн"
            />
          </div>
          <button className="btn btn-primary" type="submit">создать</button>
        </form>
      )}

      {loading && (
        <div className={styles.spinnerWrap}><span className="spinner" /></div>
      )}

      {SECTIONS.map(({ level: lvl, label }) => {
        const levelItems = items.filter((g) => g.level === lvl);
        return (
          <section key={lvl} className={styles.section}>
            <div className={styles.sectionTitle}>{label}</div>
            {levelItems.length === 0 ? (
              <div className="empty-state">целей нет</div>
            ) : (
              <div className={styles.list}>
                {levelItems.map((g, i) => (
                  <GoalBar key={g.id} goal={g} colorIdx={i} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
