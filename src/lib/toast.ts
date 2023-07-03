import { toast } from 'react-toastify';

type ToastProps = 'error' | 'success' | 'info' | 'warning';

export default function Toast(message: string, type: ToastProps = 'info') {
  return toast[type](message, {
    position: 'bottom-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: false,
  });
}
