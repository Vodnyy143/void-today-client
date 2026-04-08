import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNotes, createNote, deleteNote, setActiveType } from '../../features/notes/notesSlice';
import type { NoteType } from '../../types';
import styles from './Notes.module.css';

const TABS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'все' },
  { value: 'THOUGHT', label: '💡 мысли' },
  { value: 'ARTICLE', label: '📰 статьи' },
  { value: 'SHOPPING', label: '🛒 покупки' },
  { value: 'WISHLIST', label: '👕 вишлист' },
];

const NOTE_COLORS: Record<string, string> = {
  THOUGHT: '#8e44ad',
  ARTICLE: '#2980b9',
  SHOPPING: '#27ae60',
  WISHLIST: '#d35400',
};

export default function Notes() {
  const dispatch = useAppDispatch();
  const { items, loading, activeType } = useAppSelector((s) => s.notes);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<NoteType>('THOUGHT');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    dispatch(fetchNotes(activeType !== 'ALL' ? (activeType as NoteType) : undefined));
  }, [dispatch, activeType]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(createNote({
      type: formType,
      title: title.trim() || undefined,
      content: content.trim() || undefined,
      url: url.trim() || undefined,
      price: price ? parseFloat(price) : undefined,
      tags: [],
    }));
    setTitle(''); setContent(''); setUrl(''); setPrice('');
    setShowForm(false);
  };

  const handleTabChange = (val: string) => {
    dispatch(setActiveType(val));
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.value}
              className={`btn ${activeType === t.value ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((p) => !p)}>
          {showForm ? '✕' : '+ добавить'}
        </button>
      </div>

      {showForm && (
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          <select className="select" value={formType} onChange={(e) => setFormType(e.target.value as NoteType)}>
            <option value="THOUGHT">💡 мысль</option>
            <option value="ARTICLE">📰 статья</option>
            <option value="SHOPPING">🛒 покупка</option>
            <option value="WISHLIST">👕 вишлист</option>
          </select>

          {(formType === 'THOUGHT' || formType === 'ARTICLE') && (
            <>
              <input className="input" placeholder="заголовок..." value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea
                className={`input ${styles.textarea}`}
                placeholder="содержимое..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </>
          )}

          {formType === 'ARTICLE' && (
            <input className="input" placeholder="ссылка..." value={url} onChange={(e) => setUrl(e.target.value)} />
          )}

          {(formType === 'SHOPPING' || formType === 'WISHLIST') && (
            <>
              <input className="input" placeholder="название..." value={title} onChange={(e) => setTitle(e.target.value)} />
              <input className="input" type="number" placeholder="цена..." value={price} onChange={(e) => setPrice(e.target.value)} />
            </>
          )}

          <button className="btn btn-primary" type="submit">сохранить</button>
        </form>
      )}

      {loading && <div className={styles.spinnerWrap}><span className="spinner" /></div>}

      {!loading && items.length === 0 && <div className="empty-state">заметок нет</div>}

      <div className={styles.grid}>
        {items.map((note) => (
          <div
            key={note.id}
            className={`card ${styles.noteCard}`}
            style={{ borderLeftColor: NOTE_COLORS[note.type] ?? 'var(--border)' }}
          >
            <div className={styles.noteHeader}>
              <span className={styles.noteTitle}>{note.title || note.content?.slice(0, 40) || '—'}</span>
              <button
                className={`btn btn-danger ${styles.noteDelete}`}
                onClick={() => dispatch(deleteNote(note.id))}
              >
                ✕
              </button>
            </div>
            {note.content && note.title && (
              <p className={styles.noteContent}>{note.content}</p>
            )}
            {note.url && (
              <a className={styles.noteUrl} href={note.url} target="_blank" rel="noopener noreferrer">
                {note.url}
              </a>
            )}
            {note.price != null && (
              <span className={styles.notePrice}>{note.price} ₽</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
