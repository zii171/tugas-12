import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, name, password);
      setSuccess(true);
      // Redirect otomatis ke login setelah 1.5 detik
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Register gagal:', err);
      // Backend mengembalikan 409 kalau email sudah terdaftar
      if (err.response?.status === 409) {
        setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
      } else {
        setError(err.response?.data?.message || 'Registrasi gagal, coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>📝 Daftar Akun</h1>

        <label style={styles.label}>
          Nama
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
            disabled={loading}
          />
        </label>

        <label style={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
            disabled={loading}
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            minLength={6}
            disabled={loading}
          />
        </label>

        {error && <p style={styles.error}>⚠️ {error}</p>}
        {success && (
          <p style={styles.success}>✅ Registrasi berhasil! Mengalihkan ke halaman login...</p>
        )}

        <button type="submit" style={styles.button} disabled={loading || success}>
          {loading ? '⏳ Memproses...' : 'Daftar'}
        </button>

        <p style={styles.footerText}>
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    fontFamily: 'Arial, sans-serif',
    padding: '16px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '380px',
  },
  title: { margin: 0, textAlign: 'center' },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 'bold', color: '#444' },
  input: { padding: '10px 12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px', fontWeight: 'normal' },
  error: { color: '#dc3545', fontSize: '13px', margin: 0 },
  success: { color: '#28a745', fontSize: '13px', margin: 0 },
  button: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    marginTop: '4px',
  },
  footerText: { textAlign: 'center', fontSize: '13px', color: '#555', margin: 0 },
};

export default RegisterPage;
