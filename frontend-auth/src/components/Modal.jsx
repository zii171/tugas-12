function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #eee',
  },
  title: { margin: 0, fontSize: '18px' },
  closeBtn: {
    border: 'none',
    background: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#666',
  },
  body: { padding: '20px' },
};

export default Modal;
