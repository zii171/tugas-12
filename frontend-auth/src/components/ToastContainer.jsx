const TYPE_STYLE = {
  success: { bg: '#28a745', icon: '✅' },
  error: { bg: '#dc3545', icon: '⚠️' },
  info: { bg: '#17a2b8', icon: 'ℹ️' },
};

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div style={styles.container}>
      {toasts.map((toast) => {
        const style = TYPE_STYLE[toast.type] || TYPE_STYLE.info;
        return (
          <div
            key={toast.id}
            style={{ ...styles.toast, backgroundColor: style.bg }}
            onClick={() => onDismiss(toast.id)}
          >
            <span>{style.icon}</span>
            <span style={styles.message}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '16px',
    right: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 2000,
    maxWidth: '90vw',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    minWidth: '220px',
    fontSize: '14px',
    animation: 'toast-in 0.2s ease-out',
  },
  message: { flex: 1 },
};

// Animasi masuk toast
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes toast-in {
    from { transform: translateX(30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
if (!document.head.querySelector('style[data-toast-anim]')) {
  styleSheet.setAttribute('data-toast-anim', 'true');
  document.head.appendChild(styleSheet);
}

export default ToastContainer;
