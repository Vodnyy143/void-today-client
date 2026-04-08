import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createTask } from '../../features/tasks/tasksSlice';
import styles from './QuickAdd.module.css';

interface Props {
  onClose: () => void;
}

export default function QuickAdd({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.items);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'MICRO' | 'MACRO'>('MICRO');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [categoryId, setCategoryId] = useState('');
  const [checkpoints, setCheckpoints] = useState<string[]>(['']);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const handleEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = () => {
    if (!title.trim()) return;
    const dto: Parameters<typeof createTask>[0] = {
      title: title.trim(),
      type,
      priority,
      ...(categoryId ? { categoryId } : {}),
      ...(type === 'MACRO'
        ? {
            checkpoints: checkpoints
              .filter((c) => c.trim())
              .map((c, i) => ({ title: c.trim(), order: i })),
          }
        : {}),
    };
    dispatch(createTask(dto));
    onClose();
  };

  const handleTitleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && type === 'MICRO') {
      handleSave();
    }
  };

  const handleCheckpointKey = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCheckpoints((prev) => {
        const next = [...prev];
        next.splice(idx + 1, 0, '');
        return next;
      });
      setTimeout(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>(`.${styles.cpInput}`);
        inputs[idx + 1]?.focus();
      }, 0);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.heading}>новая задача</span>
          <button className="btn" onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <input
            ref={titleRef}
            className="input"
            placeholder="название задачи..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKey}
          />

          <div className={styles.row}>
            <select className="select" value={type} onChange={(e) => setType(e.target.value as 'MICRO' | 'MACRO')}>
              <option value="MICRO">MICRO</option>
              <option value="MACRO">MACRO</option>
            </select>

            <select className="select" value={priority} onChange={(e) => setPriority(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}>
              <option value="HIGH">горит</option>
              <option value="MEDIUM">надо</option>
              <option value="LOW">потом</option>
            </select>

            <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">без категории</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {type === 'MACRO' && (
            <div className={styles.checkpoints}>
              <span className={styles.cpLabel}>чекпоинты</span>
              {checkpoints.map((cp, idx) => (
                <input
                  key={idx}
                  className={`input ${styles.cpInput}`}
                  placeholder={`шаг ${idx + 1}...`}
                  value={cp}
                  onChange={(e) => {
                    const next = [...checkpoints];
                    next[idx] = e.target.value;
                    setCheckpoints(next);
                  }}
                  onKeyDown={(e) => handleCheckpointKey(e, idx)}
                />
              ))}
            </div>
          )}

          <div className={styles.footer}>
            <span className={styles.hint}>
              {type === 'MICRO' ? 'Enter — сохранить' : 'Enter в поле — добавить шаг'}
              {' · Esc — закрыть'}
            </span>
            <button className="btn btn-primary" onClick={handleSave}>
              сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
