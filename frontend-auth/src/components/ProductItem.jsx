function ProductItem({ product, onEdit, onDelete, busyId }) {
  const isBusy = busyId === product.id;

  const handleDeleteClick = () => {
    if (window.confirm(`Yakin ingin menghapus produk "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <h3 style={styles.name}>{product.name}</h3>
        <span
          style={{
            ...styles.badge,
            backgroundColor: product.isAvailable ? '#d4edda' : '#f8d7da',
            color: product.isAvailable ? '#155724' : '#721c24',
          }}
        >
          {product.isAvailable ? '✅ Tersedia' : '❌ Tidak tersedia'}
        </span>
      </div>

      <p style={styles.price}>💰 Rp {Number(product.price).toLocaleString('id-ID')}</p>
      {product.description && <p style={styles.description}>{product.description}</p>}

      <div style={styles.meta}>
        <span style={styles.category}>📁 {product.category}</span>
        <span style={styles.stock}>📦 Stok: {product.stock}</span>
      </div>

      <div style={styles.actions}>
        <button onClick={() => onEdit(product)} style={styles.editBtn} disabled={isBusy}>
          ✏️ Edit
        </button>
        <button onClick={handleDeleteClick} style={styles.deleteBtn} disabled={isBusy}>
          {isBusy ? '⏳' : '🗑️ Hapus'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#f8f9fa',
    padding: '18px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '12px',
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' },
  name: { margin: 0, fontSize: '17px' },
  badge: { fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' },
  price: { fontSize: '18px', fontWeight: 'bold', color: '#28a745', margin: '8px 0 4px' },
  description: { fontSize: '13px', color: '#555', margin: '4px 0' },
  meta: { display: 'flex', gap: '16px', fontSize: '13px', color: '#666', marginTop: '8px', flexWrap: 'wrap' },
  category: {},
  stock: {},
  actions: { display: 'flex', gap: '8px', marginTop: '12px' },
  editBtn: { padding: '6px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  deleteBtn: { padding: '6px 14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};

export default ProductItem;
