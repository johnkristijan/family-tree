import { toast } from 'vue3-toastify'

export function useToast() {
  const showSuccess = (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    })
  }

  const showError = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    })
  }

  const showWarning = (message) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    })
  }

  const showInfo = (message) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    })
  }

  const showConfirm = (message, options = {}) => {
    return new Promise((resolve) => {
      // For better UX, we'll use a more styled window.confirm
      // In production, you'd want to use a proper modal dialog component
      const result = window.confirm(message)
      resolve(result)
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  }
}
