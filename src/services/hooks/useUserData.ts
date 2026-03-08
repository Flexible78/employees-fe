import { create } from 'zustand'
import { UserData } from '../../models/AuthData'

interface AuthState {
    userData: UserData | null;
    login: (user: UserData) => void;
    logout: () => void;
}

export const useUserData = create<AuthState>((set) => ({
    userData: null,
    login: (user) => set({ userData: user }),
    logout: () => set({ userData: null }),
}));
