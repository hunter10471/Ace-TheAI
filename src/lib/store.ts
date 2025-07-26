import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ModalState {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
}

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
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

export const useThemeStore = create<ThemeState>(
  (set, get): ThemeState => ({
    isDarkMode: false,
    toggleDarkMode: () => {
      const newMode = !get().isDarkMode;
      set({ isDarkMode: newMode });
      if (typeof window !== 'undefined') {
        if (newMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }
      }
    },
    setDarkMode: (isDark: boolean) => {
      set({ isDarkMode: isDark });
      if (typeof window !== 'undefined') {
        if (isDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }
      }
    }
  })
);

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
}));
