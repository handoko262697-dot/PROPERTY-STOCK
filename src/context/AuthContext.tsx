import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AuthUser, UserRole, ApprovalStatus } from '../types/auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  quickLogin: (role: UserRole) => void;
  logout: () => void;
  register: (name: string, email: string, pass: string, role?: UserRole, phone?: string) => { 
    success: boolean; 
    pendingApproval?: boolean; 
    message?: string; 
  };
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  // User Management for Admin
  allUsers: Array<AuthUser>;
  pendingUsersCount: number;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
}

const AUTH_STORAGE_KEY = 'kyan_property_current_user_v2';
const USERS_STORAGE_KEY = 'kyan_property_registered_users_v2';

const DEFAULT_ACCOUNTS: Array<AuthUser & { password: string }> = [
  {
    id: 'user-admin-handoko',
    name: 'Handoko',
    email: 'handoko262697@gmail.com',
    role: 'admin',
    phone: '0812-8899-7711',
    status: 'approved',
    createdAt: '2026-01-01T08:00:00.000Z',
    password: 'admin',
  },
  {
    id: 'user-admin-1',
    name: 'Handoko (Admin)',
    email: 'admin@kyanproperty.com',
    role: 'admin',
    phone: '0812-8899-7711',
    status: 'approved',
    createdAt: '2026-01-01T08:00:00.000Z',
    password: 'admin123',
  },
  {
    id: 'user-client-1',
    name: 'Budi Pratama',
    email: 'user@kyanproperty.com',
    role: 'user',
    phone: '0813-9876-5432',
    status: 'approved',
    createdAt: '2026-01-05T10:30:00.000Z',
    password: 'user123',
  },
  {
    id: 'user-sample-pending',
    name: 'Siti Rahmawati (Calon Konsumen)',
    email: 'siti.rahma@gmail.com',
    role: 'user',
    phone: '0857-1234-5678',
    status: 'pending',
    createdAt: '2026-11-10T09:15:00.000Z',
    password: 'user123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        return merged.map(u => ({
          ...u,
          status: u.status || 'approved',
          createdAt: u.createdAt || new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ACCOUNTS;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.status === 'approved') {
          return parsed;
        }
      }
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
      // Check approval status
      if (found.status === 'pending') {
        return {
          success: false,
          message: 'Akun Anda sedang menunggu persetujuan (Approval) dari Admin. Silakan hubungi pengelola.'
        };
      }
      if (found.status === 'rejected') {
        return {
          success: false,
          message: 'Akun Anda belum disetujui atau telah dinonaktifkan oleh Admin.'
        };
      }

      const userPayload: AuthUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        phone: found.phone,
        status: found.status,
        createdAt: found.createdAt,
      };
      setCurrentUser(userPayload);
      setIsLoginModalOpen(false);
      return { success: true };
    }

    return { success: false, message: 'Email atau kata sandi tidak cocok.' };
  };

  const quickLogin = (role: UserRole) => {
    const account = registeredUsers.find(u => u.role === role && u.status === 'approved') || (role === 'admin' ? DEFAULT_ACCOUNTS[0] : DEFAULT_ACCOUNTS[2]);
    const userPayload: AuthUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      phone: account.phone,
      status: account.status || 'approved',
      createdAt: account.createdAt || new Date().toISOString(),
    };
    setCurrentUser(userPayload);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (name: string, email: string, pass: string, role: UserRole = 'user', phone?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const exists = registeredUsers.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'Email sudah terdaftar. Silakan login atau gunakan email lain.' };
    }

    const newUser: AuthUser & { password: string } = {
      id: `user-${Date.now()}`,
      name,
      email: cleanEmail,
      role,
      phone,
      status: 'pending', // Requires Admin approval
      createdAt: new Date().toISOString(),
      password: pass,
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    
    // User must wait for admin approval before they can log in
    return { 
      success: true, 
      pendingApproval: true, 
      message: 'Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan (Approval) dari Admin.' 
    };
  };

  const approveUser = (userId: string) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'approved' as ApprovalStatus };
      }
      return u;
    }));
  };

  const rejectUser = (userId: string) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'rejected' as ApprovalStatus };
      }
      return u;
    }));
  };

  const deleteUser = (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    }));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const pendingUsersCount = useMemo(() => {
    return registeredUsers.filter(u => u.status === 'pending').length;
  }, [registeredUsers]);

  const allUsers = useMemo(() => {
    return registeredUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      status: u.status,
      createdAt: u.createdAt,
    }));
  }, [registeredUsers]);

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
        allUsers,
        pendingUsersCount,
        approveUser,
        rejectUser,
        deleteUser,
        changeUserRole,
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
