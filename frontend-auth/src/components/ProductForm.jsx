import { useState } from 'react';

const emptyForm = { name: '', price: '', description: '', category: '', stock: '', isAvailable: true };

function ProductForm({ mode = 'add', initialData = null, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(() =>
    initialData
      ? {
          name: initialData.name || '',
          price: initialData.price ?? '',
          description: initialData.description || '',
          category: initialData.category || '',
          stock: initialData.stock ?? '',
          isAvailable: initialData.isAvailable ?? true,
        }
      : emptyForm,
  );
  const [localError, setLocalError] = useState(null);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length === 0) {
      setLocalError('Nama produk tidak boleh kosong');
      return;
    }
    if (form.price === '' || Number(form.price) < 0) {
      setLocalError('Harga harus diisi dan tidak boleh negatif');
      return;
    }
    if (form.category.trim().length === 0) {
      setLocalError('Kategori tidak boleh kosong');
      return;
    }
    setLocalError(null);

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      category: form.category.trim(),
      stock: form.stock === '' ? 0 : Number(form.stock),
      isAvailable: form.isAvailable,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Nama Produk
        <input type="text" value={form.name} onChange={handleChange('name')} style={styles.input} disabled={submitting} autoFocus />
      </label>

      <div style={styles.row}>
        <label style={styles.label}>
          Harga (Rp)
          <input type="number" min="0" value={form.price} onChange={handleChange('price')} style={styles.input} disabled={submitting} />
        </label>
        <label style={styles.label}>
          Stok
          <input type="number" min="0" value={form.stock} onChange={handleChange('stock')} style={styles.input} disabled={submitting} />
        </label>
      </div>

      <label style={styles.label}>
        Kategori
        <input type="text" value={form.category} onChange={handleChange('category')} style={styles.input} disabled={submitting} />
      </label>

      <label style={styles.label}>
        Deskripsi
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          style={{ ...styles.input, minHeight: '70px', resize: 'vertical' }}
          disabled={submitting}
        />
      </label>

      <label style={styles.checkboxLabel}>
        <input type="checkbox" checked={form.isAvailable} onChange={handleChange('isAvailable')} disabled={submitting} />
        Tersedia (isAvailable)
      </label>

      {localError && <p style={styles.error}>{localError}</p>}

      <div style={styles.actions}>
        {onCancel && (
          <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={submitting}>
            Batal
          </button>
        )}
        <button type="submit" style={styles.submitBtn} disabled={submitting}>
          {submitting ? '⏳ Menyimpan...' : mode === 'edit' ? '💾 Simpan Perubahan' : '➕ Tambah Produk'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 'bold', color: '#444', flex: 1 },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#444' },
  row: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  input: { padding: '10px 12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px', fontWeight: 'normal', fontFamily: 'inherit' },
  error: { color: '#dc3545', margin: 0, fontSize: '13px' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' },
  cancelBtn: { padding: '10px 16px', backgroundColor: '#e9ecef', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  submitBtn: { padding: '10px 18px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
};

export default ProductForm;
