import { useState, useCallback, useEffect, createContext, useContext, useRef } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircle size={18} className="text-emerald-500 shrink-0" />,
  error: <AlertCircle size={18} className="text-primary shrink-0" />,
  warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
  info: <Info size={18} className="text-blue-500 shrink-0" />,
}

const BG = {
  success: "border-emerald-200 bg-emerald-50",
  error: "border-red-200 bg-red-50",
  warning: "border-amber-200 bg-amber-50",
  info: "border-blue-200 bg-blue-50",
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10)
    // Auto-dismiss
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration || 4000)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg max-w-sm transition-all duration-300 ${
        BG[toast.type] || BG.info
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {ICONS[toast.type] || ICONS.info}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-bold text-foreground leading-tight">{toast.title}</p>
        )}
        <p className="text-xs text-foreground/80 leading-relaxed mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onRemove(toast.id), 300)
        }}
        className="shrink-0 rounded-full p-0.5 hover:bg-black/10 text-foreground/50 hover:text-foreground transition"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const addToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, type, title, message, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast portal */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col-reverse gap-2 items-center pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Hook
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>")
  return ctx
}
