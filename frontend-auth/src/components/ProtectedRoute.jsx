import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Membungkus halaman yang hanya boleh diakses setelah login.
// Kalau belum ada token valid di AuthContext -> redirect ke /login.
function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();

  // Tunggu proses cek localStorage selesai dulu, biar tidak "kedip" redirect
  if (initializing) {
    return (
      <div style={styles.loading}>
        <p>Memuat...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
};

export default ProtectedRoute;
