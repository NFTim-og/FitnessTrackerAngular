export type UserRole = 'admin' | 'user';

export class User {
  id: string;
  email: string;
  role: UserRole;

  constructor(data: Partial<User> = {}) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.role = data.role || 'user';
  }

  static fromJSON(json: any): User {
    return new User(json);
  }

  toJSON(): Partial<User> {
    return {
      id: this.id,
      email: this.email,
      role: this.role
    };
  }
}

export class UserProfile {
  id: string;
  weight_kg: number;
  height_cm: number;
  created_at: string;
  updated_at: string;

  constructor(data: Partial<UserProfile> = {}) {
    this.id = data.id || '';
    this.weight_kg = data.weight_kg || 0;
    this.height_cm = data.height_cm || 0;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  static fromJSON(json: any): UserProfile {
    return new UserProfile(json);
  }

  toJSON(): Partial<UserProfile> {
    return {
      weight_kg: this.weight_kg,
      height_cm: this.height_cm
    };
  }
}

export class WeightHistory {
  id: string;
  user_id: string;
  weight_kg: number;
  recorded_at: string;

  constructor(data: Partial<WeightHistory> = {}) {
    this.id = data.id || '';
    this.user_id = data.user_id || '';
    this.weight_kg = data.weight_kg || 0;
    this.recorded_at = data.recorded_at || new Date().toISOString();
  }

  static fromJSON(json: any): WeightHistory {
    return new WeightHistory(json);
  }
}