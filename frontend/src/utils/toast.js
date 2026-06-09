import toast from 'react-hot-toast'

const baseStyle = {
  background: 'var(--card)',
  color: 'var(--foreground)',
  border: '1px solid var(--border)',
}

export const appToast = {
  success(message, options) {
    return toast.success(message, { style: baseStyle, ...options })
  },
  error(message, options) {
    return toast.error(message, { style: baseStyle, ...options })
  },
  warning(message, options) {
    return toast(message, {
      icon: '⚠️',
      style: { ...baseStyle, borderColor: 'hsl(45 93% 47% / 0.4)' },
      ...options,
    })
  },
  info(message, options) {
    return toast(message, {
      icon: 'ℹ️',
      style: baseStyle,
      ...options,
    })
  },
  promise(promise, messages) {
    return toast.promise(promise, messages, { style: baseStyle })
  },
  dismiss(id) {
    toast.dismiss(id)
  },
}
