import { useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchDashboard, fetchWeekly, fetchGraveyard } from '../../features/stats/statsSlice';
import HeatMap from '../../components/HeatMap/HeatMap';
import styles from './Stats.module.css';

export default function Stats() {
  const dispatch = useAppDispatch();
  const { dashboard, weekly, graveyard, loading } = useAppSelector((s) => s.stats);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchWeekly());
    dispatch(fetchGraveyard());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      {/* Stat cards */}
      <div className={styles.statsGrid}>
        <div className="card">
          <div className={styles.statValue}>{loading ? '…' : dashboard?.doneTasks ?? 0}</div>
          <div className={styles.statLabel}>выполнено всего</div>
        </div>
        <div className="card">
          <div className={styles.statValue}>{loading ? '…' : (dashboard?.streak ?? 0)} 🔥</div>
          <div className={styles.statLabel}>стрик</div>
        </div>
        <div className="card">
          <div className={styles.statValue}>{loading ? '…' : `${dashboard?.completionRate ?? 0}%`}</div>
          <div className={styles.statLabel}>выполнение</div>
        </div>
        <div className="card">
          <div className={styles.statValue}>{loading ? '…' : dashboard?.weeklyDone ?? 0}</div>
          <div className={styles.statLabel}>за неделю</div>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="card">
        <div className={styles.sectionTitle}>задачи за 7 дней</div>
        {weekly.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekly} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#111114', border: '1px solid #1e1e24', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font)' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="count" fill="#c0392b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">нет данных</div>
        )}
      </div>

      {/* Goals progress chart */}
      {dashboard?.goals && dashboard.goals.length > 0 && (
        <div className="card">
          <div className={styles.sectionTitle}>прогресс целей</div>
          <ResponsiveContainer width="100%" height={Math.max(100, dashboard.goals.length * 40)}>
            <BarChart
              layout="vertical"
              data={dashboard.goals.map((g) => ({ name: g.title, progress: g.progress }))}
              margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font)' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={160} tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#111114', border: '1px solid #1e1e24', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font)' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="progress" fill="#8e44ad" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* HeatMap */}
      {dashboard?.heatmap && dashboard.heatmap.length > 0 && (
        <div className="card">
          <div className={styles.sectionTitle}>активность (90 дней)</div>
          <HeatMap data={dashboard.heatmap.slice(-90)} />
        </div>
      )}

      {/* Graveyard */}
      <div className="card">
        <div className={styles.sectionTitle}>кладбище задач</div>
        {graveyard.length === 0 ? (
          <div className="empty-state">архив пуст</div>
        ) : (
          <div className={styles.graveyard}>
            {graveyard.map((t) => (
              <div key={t.id} className={styles.graveyardItem}>
                <span className={styles.graveyardTitle}>{t.title}</span>
                {t.completedAt && (
                  <span className={styles.graveyardDate}>
                    {new Date(t.completedAt).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
