import { Id, toast } from 'react-toastify';

type ToastProps = 'error' | 'success' | 'info' | 'warning' | 'loading';

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

export function updateToast(
  id: Id,
  message: string,
  type: 'error' | 'success' | 'info' | 'warning'
) {
  return toast.update(id, {
    render: message,
    isLoading: false,
    type: type,
  });
}
