import { ToastContainer, toast as reactToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toast = () => {
    return (
        <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="relative flex items-center rounded-full overflow-hidden cursor-pointer bg-gray-900/90 backdrop-blur-xl border border-white/10 shadow-2xl mb-4 mx-4 text-white font-medium text-sm"
        />
    );
};

export const toast = reactToast;