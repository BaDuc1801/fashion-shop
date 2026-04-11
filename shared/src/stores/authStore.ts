import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setApiBearerToken } from '../api/axios';
import type { LoginResponseData, UserMeData } from '../api/user/user.response';

export type AuthUser = Omit<LoginResponseData, 'token'>;

export const ADMIN_PANEL_ROLE = 'ADMIN' as const;

export const isAdminUser = (user: AuthUser | null | undefined) =>
  user?.role === ADMIN_PANEL_ROLE;

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setSessionFromLogin: (data: LoginResponseData) => void;
  mergeUserFromMe: (me: UserMeData) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSessionFromLogin: (data) => {
        const { token, userId, email, fullName, role } = data;
        setApiBearerToken(token);
        set({
          token,
          user: { userId, email, fullName, role },
        });
      },
      mergeUserFromMe: (me) => {
        const prev = get().user;
        if (!prev) return;
        const userId = me.userId ?? me.id ?? prev.userId;
        set({
          user: {
            userId,
            email: me.email ?? prev.email,
            fullName: me.fullName ?? prev.fullName,
            role: me.role ?? prev.role,
          },
        });
      },
      clearSession: () => {
        setApiBearerToken(null);
        set({ token: null, user: null });
      },
    }),
    {
      name: 'fashion-monorepo-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        if (state?.token) {
          setApiBearerToken(state.token);
        }
      },
    },
  ),
);
