import { ToastContainer } from 'react-toastify'
import { useTheme } from '../hooks/useTheme'

export function AppToasts() {
  const { theme } = useTheme()

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      theme={theme}
    />
  )
}
