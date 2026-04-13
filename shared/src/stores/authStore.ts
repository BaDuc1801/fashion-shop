import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginApiResponse, UserMeData } from '../api/user/user.response';

export type AuthUser = {
  userId: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
};

export const ADMIN_PANEL_ROLE = 'admin' as const;

export const isAdminUser = (user: AuthUser | null | undefined) =>
  user?.role?.toLowerCase() === ADMIN_PANEL_ROLE;

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setSessionFromLogin: (data: LoginApiResponse) => void;
  mergeUserFromMe: (me: UserMeData) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSessionFromLogin: (data) => {
        const token = data.token;
        const userId = data.user._id;
        const email = data.user.email;
        const name = data.user.name;
        const role = data.user.role;
        const avatar = data.user.avatar;
        set({
          token,
          user: { userId, email, name, role, avatar },
        });
      },
      mergeUserFromMe: (me) => {
        if (!get().user) return;
        set({
          user: {
            userId: me._id,
            email: me.email,
            name: me.name,
            role: me.role,
            avatar: me.avatar,
          },
        });
      },
      clearSession: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: 'fashion-monorepo-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    },
  ),
);
