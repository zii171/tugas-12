import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ToastContainer from '../components/ToastContainer';
import ProductForm from '../components/ProductForm';
import ProductItem from '../components/ProductItem';
import { useToast } from '../hooks/useToast';

function ProductList() {
  const { user, logout } = useAuth();
  const { toasts, showToast, dismiss } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

  // ===== GET /api/v1/products (token otomatis disisipkan oleh interceptor) =====
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      // Kalau 401, interceptor axios sudah otomatis redirect ke /login,
      // jadi di sini cukup tampilkan pesan untuk error lain (network, 500, dll).
      setError(err.response?.data?.message || 'Gagal mengambil data produk');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openAddModal = () => {
    setEditingProduct(null);
    setModalMode('add');
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingProduct(null);
  };

  const handleCreate = async (payload) => {
    try {
      setSubmitting(true);
      await api.post('/products', payload);
      showToast('Produk berhasil ditambahkan', 'success');
      closeModal();
      await fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      showToast(err.response?.data?.message || 'Gagal menambah produk', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (payload) => {
    try {
      setSubmitting(true);
      await api.put(`/products/${editingProduct.id}`, payload);
      showToast('Produk berhasil diperbarui', 'success');
      closeModal();
      await fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      showToast(err.response?.data?.message || 'Gagal memperbarui produk', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setBusyId(id);
      await api.delete(`/products/${id}`);
      showToast('Produk berhasil dihapus', 'success');
      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast(err.response?.data?.message || 'Gagal menghapus produk', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Anda telah logout', 'info');
    // AuthContext.logout() menghapus token -> ProtectedRoute akan redirect ke /login
    // saat komponen ini di-unmount / re-render berikutnya.
  };

  return (
    <div style={styles.page}>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.h1}>📦 Daftar Produk</h1>
            {user && <p style={styles.welcome}>Halo, {user.name} ({user.email})</p>}
          </div>
          <div style={styles.headerActions}>
            <button onClick={openAddModal} style={styles.addBtn}>
              ➕ Tambah Produk
            </button>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              🚪 Logout
            </button>
          </div>
        </div>

        <p>Total produk: {products.length}</p>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading products...</p>
          </div>
        )}

        {!loading && error && (
          <div style={styles.errorContainer}>
            <h2>⚠️ Error</h2>
            <p>{error}</p>
            <button onClick={fetchProducts} style={styles.retryButton}>
              🔄 Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p style={styles.noResults}>Belum ada produk. Klik "Tambah Produk" untuk membuat.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={styles.grid}>
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onEdit={openEditModal}
                onDelete={handleDelete}
                busyId={busyId}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === 'edit' ? 'Edit Produk' : 'Tambah Produk Baru'}
      >
        <ProductForm
          mode={modalMode === 'edit' ? 'edit' : 'add'}
          initialData={editingProduct}
          onSubmit={modalMode === 'edit' ? handleUpdate : handleCreate}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}

const styles = {
  page: { fontFamily: 'Arial, sans-serif' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '20px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' },
  h1: { margin: 0 },
  welcome: { margin: '4px 0 0', fontSize: '13px', color: '#666' },
  headerActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  addBtn: { padding: '10px 18px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  logoutBtn: { padding: '10px 18px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  errorContainer: { textAlign: 'center', padding: '40px' },
  retryButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' },
  noResults: { textAlign: 'center', padding: '40px', color: '#888' },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @media (max-width: 480px) {
    .todo-container { padding: 12px !important; }
  }
`;
if (!document.head.querySelector('style[data-productlist-anim]')) {
  styleSheet.setAttribute('data-productlist-anim', 'true');
  document.head.appendChild(styleSheet);
}

export default ProductList;
