import { toast } from 'sonner';

export const showToast = (message, type) => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message);
    }
};
