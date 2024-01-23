import { create } from 'zustand';

interface NotificationModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useNotificationModal = create<NotificationModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useNotificationModal;
