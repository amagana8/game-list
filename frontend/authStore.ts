import create from 'zustand';

interface UserState {
  username: string;
  accessToken: string;
  setUsername: (newUsername: string) => void;
  setAccessToken: (newAccessToken: string) => void;
  setUser: (newUser: { username: string; accessToken: string }) => void;
  resetUser: () => void;
}

export const useAuthStore = create<UserState>((set) => ({
  username: '',
  accessToken: '',
  setAccessToken: (newAccessToken) =>
    set((state) => ({ ...state, accessToken: newAccessToken })),
  setUsername: (newUsername) =>
    set((state) => ({ ...state, username: newUsername })),
  setUser: (newUser) =>
    set({ username: newUser.username, accessToken: newUser.accessToken }),
  resetUser: () => set({ username: '', accessToken: '' }),
}));
