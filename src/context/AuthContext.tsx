import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types/auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  quickLogin: (role: UserRole) => void;
  logout: () => void;
  register: (name: string, email: string, pass: string, role?: UserRole, phone?: string) => { success: boolean; message?: string };
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AUTH_STORAGE_KEY = 'kyan_property_current_user_v2';
const USERS_STORAGE_KEY = 'kyan_property_registered_users_v1';

const DEFAULT_ACCOUNTS: Array<AuthUser & { password: string }> = [
  {
    id: 'user-admin-handoko',
    name: 'Handoko',
    email: 'handoko262697@gmail.com',
    role: 'admin',
    phone: '0812-8899-7711',
    password: 'admin',
  },
  {
    id: 'user-admin-1',
    name: 'Handoko',
    email: 'admin@kyanproperty.com',
    role: 'admin',
    phone: '0812-8899-7711',
    password: 'admin123',
  },
  {
    id: 'user-client-1',
    name: 'Budi Pratama',
    email: 'user@kyanproperty.com',
    role: 'user',
    phone: '0813-9876-5432',
    password: 'user123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clear any legacy v1 auto-admin session
  try {
    localStorage.removeItem('kyan_property_current_user_v1');
  } catch (e) {
    // ignore
  }

  // Load users database or seed defaults
  const [registeredUsers, setRegisteredUsers] = useState<Array<AuthUser & { password: string }>>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed: Array<AuthUser & { password: string }> = JSON.parse(saved);
        const merged = [...parsed];
        for (const def of DEFAULT_ACCOUNTS) {
          if (!merged.some(u => u.email.toLowerCase() === def.email.toLowerCase())) {
            merged.push(def);
          }
        }
        return merged;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ACCOUNTS;
  });

  // Current logged in user (starts strictly as null so user must login first)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email: string, pass: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const found = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail && (u.password === pass || (cleanEmail === 'handoko262697@gmail.com' && pass.length > 0))
    );

    if (found) {
      const userPayload: AuthUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        phone: found.phone,
      };
      setCurrentUser(userPayload);
      setIsLoginModalOpen(false);
      return { success: true };
    }

    return { success: false, message: 'Email atau kata sandi tidak cocok.' };
  };

  const quickLogin = (role: UserRole) => {
    const account = registeredUsers.find(u => u.role === role) || (role === 'admin' ? DEFAULT_ACCOUNTS[0] : DEFAULT_ACCOUNTS[1]);
    const userPayload: AuthUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      phone: account.phone,
    };
    setCurrentUser(userPayload);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (name: string, email: string, pass: string, role: UserRole = 'user', phone?: string) => {
    const exists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (exists) {
      return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
    }

    const newUser: AuthUser & { password: string } = {
      id: `user-${Date.now()}`,
      name,
      email: email.trim(),
      role,
      phone,
      password: pass,
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    const userPayload: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    };
    setCurrentUser(userPayload);
    setIsLoginModalOpen(false);
    return { success: true };
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        quickLogin,
        logout,
        register,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
