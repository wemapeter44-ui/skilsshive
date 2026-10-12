import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import './Toast.css'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (message, type = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((current) => [...current, { id, message, type }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={show}>
      {children}

      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={'toast ' + t.type}>
            {t.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="toast-text">{t.message}</span>
            <button
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const show = useContext(ToastContext)
  if (!show) {
    throw new Error('useToast must be used inside a ToastProvider')
  }
  return show
}