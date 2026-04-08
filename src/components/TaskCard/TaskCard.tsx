import { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { updateTask, deleteTask, toggleCheckpoint } from '../../features/tasks/tasksSlice';
import type { Task } from '../../types';
import styles from './TaskCard.module.css';

interface Props {
  task: Task;
}

const PRIORITY_LABEL: Record<Task['priority'], string> = {
  HIGH: '🔴 горит',
  MEDIUM: '🟡 надо',
  LOW: '⚫ потом',
};

export default function TaskCard({ task }: Props) {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const isDone = task.status === 'DONE';

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(updateTask({ id: task.id, status: isDone ? 'TODO' : 'DONE' }));
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(updateTask({ id: task.id, status: 'ARCHIVED' }));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteTask(task.id));
  };

  const doneCount = task.checkpoints.filter((c) => c.done).length;
  const totalCount = task.checkpoints.length;

  return (
    <div
      className={`${styles.card} ${isDone ? styles.done : ''}`}
      onClick={() => task.type === 'MACRO' && setExpanded((p) => !p)}
    >
      <div className={styles.main}>
        <button className={styles.checkbox} onClick={handleToggle}>
          {isDone ? '✓' : ''}
        </button>

        <span className={`${styles.title} ${isDone ? styles.striked : ''}`}>{task.title}</span>

        <div className={styles.tags}>
          <span className="tag">{PRIORITY_LABEL[task.priority]}</span>
          {task.category && (
            <span className="tag" style={{ borderColor: task.category.color, color: task.category.color }}>
              {task.category.name}
            </span>
          )}
          {task.dueDate && (
            <span className="tag">{new Date(task.dueDate).toLocaleDateString('ru-RU')}</span>
          )}
        </div>

        <div className={styles.actions}>
          <button className={`btn ${styles.actionBtn}`} onClick={handleArchive} title="Архивировать">
            ▽
          </button>
          <button className={`btn btn-danger ${styles.actionBtn}`} onClick={handleDelete} title="Удалить">
            ✕
          </button>
        </div>
      </div>

      {task.type === 'MACRO' && totalCount > 0 && (
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(doneCount / totalCount) * 100}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {doneCount}/{totalCount}
          </span>
        </div>
      )}

      {expanded && task.checkpoints.length > 0 && (
        <ul className={styles.checkpoints}>
          {task.checkpoints
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((cp) => (
              <li key={cp.id} className={styles.checkpoint}>
                <button
                  className={`${styles.checkbox} ${cp.done ? styles.cpDone : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(toggleCheckpoint({ taskId: task.id, cpId: cp.id }));
                  }}
                >
                  {cp.done ? '✓' : ''}
                </button>
                <span className={cp.done ? styles.striked : ''}>{cp.title}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
