export type UserRole = 'admin' | 'user';

export class User {
  id: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.role = data.role || 'user';
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
  }
}