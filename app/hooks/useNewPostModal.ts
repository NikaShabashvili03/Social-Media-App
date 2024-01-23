import { create } from 'zustand';

interface NewPostModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useNewPostModal = create<NewPostModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useNewPostModal;
