import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchDashboard } from '../../features/stats/statsSlice';
import { fetchTasks, fetchChaos, updateTask } from '../../features/tasks/tasksSlice';
import { fetchMoodToday } from '../../features/mood/moodSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import MoodPicker from '../../components/MoodPicker/MoodPicker';
import GoalBar from '../../components/GoalBar/GoalBar';
import HeatMap from '../../components/HeatMap/HeatMap';
import styles from './Dashboard.module.css';

const QUOTES = [
  { text: 'Потеря — это не что иное, как перемена, а перемена — это радость природы.', author: 'Марк Аврелий' },
  { text: 'Нет попутного ветра для того, кто не знает, в какой гавани он ищет причала.', author: 'Сенека' },
  { text: 'Не трать время на сожаления о прошлом. Живи настоящим.', author: 'Марк Аврелий' },
  { text: 'Я знаю только то, что ничего не знаю. Но другие не знают даже этого.', author: 'Довлатов' },
  { text: 'Будущее нас тревожит, прошлое удерживает. Вот почему нам так тяжело в настоящем.', author: 'Флобер' },
  { text: 'Делай что должен, и будь что будет.', author: 'Марк Аврелий' },
];

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { dashboard, loading } = useAppSelector((s) => s.stats);
  const { items: tasks, chaos } = useAppSelector((s) => s.tasks);
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchTasks({ status: 'TODO' }));
    dispatch(fetchChaos());
    dispatch(fetchMoodToday());
    dispatch(fetchCategories());
  }, [dispatch]);

  const today = tasks.slice(0, 3);
  const restCount = Math.max(0, tasks.length - 3);

  return (
    <div className={styles.layout}>
      {/* Left column */}
      <div className={styles.left}>
        {/* Stat cards */}
        <div className={styles.statsGrid}>
          <div className="card">
            <div className={styles.statValue}>{loading ? '…' : dashboard?.doneToday ?? 0}</div>
            <div className={styles.statLabel}>сделано сегодня</div>
          </div>
          <div className="card">
            <div className={styles.statValue}>{loading ? '…' : dashboard?.weeklyDone ?? 0}</div>
            <div className={styles.statLabel}>за неделю</div>
          </div>
          <div className="card">
            <div className={styles.statValue}>{loading ? '…' : (dashboard?.streak ?? 0)} 🔥</div>
            <div className={styles.statLabel}>стрик (дней)</div>
          </div>
          <div className="card">
            <div className={styles.statValue}>{loading ? '…' : `${dashboard?.completionRate ?? 0}%`}</div>
            <div className={styles.statLabel}>выполнение</div>
          </div>
        </div>

        {/* Tasks today */}
        <div className="card">
          <div className={styles.sectionTitle}>сегодня</div>
          {today.length === 0 ? (
            <div className="empty-state">задач нет — отдыхаешь?</div>
          ) : (
            <div className={styles.taskList}>
              {today.map((task) => (
                <div key={task.id} className={styles.taskRow}>
                  <button
                    className={styles.checkbox}
                    onClick={() =>
                      dispatch(updateTask({ id: task.id, status: task.status === 'DONE' ? 'TODO' : 'DONE' }))
                    }
                  >
                    {task.status === 'DONE' ? '✓' : ''}
                  </button>
                  <span className={task.status === 'DONE' ? styles.striked : ''}>{task.title}</span>
                </div>
              ))}
              {restCount > 0 && (
                <Link to="/tasks" className={styles.moreLink}>
                  ещё {restCount} задач →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Chaos task */}
        <div className="card">
          <div className={styles.sectionTitle}>хаос-задача</div>
          {chaos ? (
            <>
              <div className={styles.chaosTitle}>{chaos.title}</div>
              <div className={styles.chaosActions}>
                <button className="btn" onClick={() => dispatch(fetchChaos())}>следующая</button>
                <button
                  className="btn btn-primary"
                  onClick={() => dispatch(updateTask({ id: chaos.id, status: 'DONE' }))}
                >
                  ладно, сделаю
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">задач нет</div>
          )}
        </div>

        {/* HeatMap */}
        {dashboard?.heatmap && dashboard.heatmap.length > 0 && (
          <div className="card">
            <div className={styles.sectionTitle}>активность</div>
            <HeatMap data={dashboard.heatmap} />
          </div>
        )}
      </div>

      {/* Right column */}
      <div className={styles.right}>
        <MoodPicker />

        {/* Life goal */}
        {dashboard?.goals?.filter((g) => g.level === 'LIFE').map((g, i) => (
          <div key={g.id} className="card">
            <div className={styles.sectionTitle}>главная цель</div>
            <GoalBar goal={g} colorIdx={i} />
          </div>
        ))}

        {/* Monthly goals */}
        {dashboard?.goals?.some((g) => g.level === 'MONTH') && (
          <div className="card">
            <div className={styles.sectionTitle}>цели на месяц</div>
            <div className={styles.goalList}>
              {dashboard.goals
                .filter((g) => g.level === 'MONTH')
                .map((g, i) => (
                  <GoalBar key={g.id} goal={g} colorIdx={i} />
                ))}
            </div>
          </div>
        )}

        {/* Quote */}
        <div className="card">
          <div className={styles.sectionTitle}>мудрость</div>
          <blockquote className={styles.quote}>
            <p>«{QUOTES[quoteIdx].text}»</p>
            <footer className={styles.quoteAuthor}>— {QUOTES[quoteIdx].author}</footer>
          </blockquote>
          <button
            className={`btn ${styles.nextQuote}`}
            onClick={() => setQuoteIdx((i) => (i + 1) % QUOTES.length)}
          >
            следующая мудрость
          </button>
        </div>
      </div>
    </div>
  );
}
