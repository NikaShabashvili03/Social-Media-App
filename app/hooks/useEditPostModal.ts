import { create } from 'zustand';
import { SafePosts } from '../types';

interface EditPostModal {
  isOpen: boolean;
  data: any, 
  setData: (item: any) => void;
  onOpen: () => void;
  onClose: () => void;
}

const useEditPostModal = create<EditPostModal>((set) => ({
  isOpen: false,
  data: [],
  setData: (item) => set({data: item}),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useEditPostModal;
