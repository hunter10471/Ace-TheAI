import { create } from "zustand";

interface ModalState {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
}

export const useModalStore = create<ModalState>(
  (set): ModalState => ({
    isLoginModalOpen: false,
    isRegisterModalOpen: false,
    openLoginModal: () => set({ isLoginModalOpen: true }),
    closeLoginModal: () => set({ isLoginModalOpen: false }),
    openRegisterModal: () => set({ isRegisterModalOpen: true }),
    closeRegisterModal: () => set({ isRegisterModalOpen: false }),
  })
);
