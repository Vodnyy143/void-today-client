import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setMood } from '../../features/mood/moodSlice';
import type { MoodType } from '../../types';
import styles from './MoodPicker.module.css';

const MOODS: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'DEAD', emoji: '💀', label: 'мертвец' },
  { value: 'OK', emoji: '😶', label: 'ок' },
  { value: 'ANGRY', emoji: '😤', label: 'злой' },
  { value: 'FIRE', emoji: '🔥', label: 'режим' },
  { value: 'CHAOS', emoji: '🤡', label: 'хаос' },
];

export default function MoodPicker() {
  const dispatch = useAppDispatch();
  const today = useAppSelector((s) => s.mood.today);

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>настроение</span>
      <div className={styles.buttons}>
        {MOODS.map(({ value, emoji, label }) => (
          <button
            key={value}
            className={`${styles.btn} ${today?.value === value ? styles.active : ''}`}
            onClick={() => dispatch(setMood(value))}
            title={label}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
