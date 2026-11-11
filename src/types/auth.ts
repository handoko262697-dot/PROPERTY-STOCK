export type UserRole = 'admin' | 'user';
export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: ApprovalStatus;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role: UserRole;
}

export interface SalesSettings {
  name: string;
  phone: string;
  whatsapp: string;
  updatedAt?: string;
}
