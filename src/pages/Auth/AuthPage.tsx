import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signIn, signUp } from '../../features/auth/authSlice';
import styles from './AuthPage.module.css';

interface Props {
  mode: 'login' | 'register';
}

export default function AuthPage({ mode }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let result;
    if (mode === 'login') {
      result = await dispatch(signIn({ email, password }));
    } else {
      result = await dispatch(signUp({ email, password, name }));
    }
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>VOID.TODAY</div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label className={styles.label}>имя</label>
              <input
                className="input"
                placeholder="как тебя зовут..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>email</label>
            <input
              className="input"
              type="email"
              placeholder="email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>пароль</label>
            <input
              className="input"
              type="password"
              placeholder="пароль..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : mode === 'login' ? 'войти' : 'зарегистрироваться'}
          </button>
        </form>

        <div className={styles.switch}>
          {mode === 'login' ? (
            <>нет аккаунта? <Link to="/register">зарегистрироваться</Link></>
          ) : (
            <>уже есть аккаунт? <Link to="/login">войти</Link></>
          )}
        </div>

        <div className={styles.demo}>
          демо: demo@void.today / password123
        </div>
      </div>
    </div>
  );
}
