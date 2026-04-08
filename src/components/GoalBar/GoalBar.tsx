import { useAppDispatch } from '../../app/hooks';
import { deleteGoal } from '../../features/goals/goalsSlice';
import type { Goal } from '../../types';
import styles from './GoalBar.module.css';

interface Props {
  goal: Goal;
  colorIdx?: number;
}

const LEVEL_LABEL: Record<Goal['level'], string> = {
  LIFE: 'жизнь',
  MONTH: 'месяц',
  WEEK: 'неделя',
};

const COLORS = ['#c0392b', '#8e44ad', '#2980b9', '#27ae60', '#d35400'];

export default function GoalBar({ goal, colorIdx = 0 }: Props) {
  const dispatch = useAppDispatch();
  const color = COLORS[colorIdx % COLORS.length];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.left}>
          <span className={styles.title}>{goal.title}</span>
          <span className="tag">{LEVEL_LABEL[goal.level]}</span>
        </div>
        <button
          className={`btn btn-danger ${styles.deleteBtn}`}
          onClick={() => dispatch(deleteGoal(goal.id))}
          title="Удалить цель"
        >
          ✕
        </button>
      </div>

      <div className={styles.barWrapper}>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${goal.progress}%`, background: color }}
          />
        </div>
        <span className={styles.percent}>{goal.progress}%</span>
      </div>

      {goal.progress === 0 && (
        <span className={styles.noProgress}>ты даже не начал.</span>
      )}
    </div>
  );
}
