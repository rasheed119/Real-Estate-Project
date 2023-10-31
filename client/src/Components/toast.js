import { toast } from 'react-toastify';

const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light',
    });
  };
export default showToast;