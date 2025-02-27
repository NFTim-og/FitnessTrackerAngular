import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { AppError } from '../shared/models/error.model';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private errorHandler: ErrorHandlerService) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }
    );

    this.initializeAuth();
  }

  private async getUserRole(userId: string): Promise<'admin' | 'user'> {
    try {
      const { data, error } = await this.supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If the error is that the record doesn't exist, create it with default role
        if (error.code === 'PGRST116' || error.code === '42P01') {
          const { data: newRole, error: insertError } = await this.supabase
            .from('user_roles')
            .insert([{ user_id: userId, role: 'user' }])
            .select()
            .single();

          if (insertError) {
            throw this.errorHandler.handleError(insertError, 'SupabaseService.getUserRole.createRole');
          }

          return newRole.role;
        } else {
          throw this.errorHandler.handleError(error, 'SupabaseService.getUserRole.fetchRole');
        }
      }
      return data?.role || 'user';
    } catch (error) {
      throw this.errorHandler.handleError(error, 'SupabaseService.getUserRole');
    }
  }

  private async initializeAuth() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.user) {
        const role = await this.getUserRole(session.user.id);
        this.userSubject.next(new User({
          id: session.user.id,
          email: session.user.email || '',
          role
        }));
      }

      // Listen for auth changes
      this.supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const role = await this.getUserRole(session.user.id);
          this.userSubject.next(new User({
            id: session.user.id,
            email: session.user.email || '',
            role
          }));
        } else {
          this.userSubject.next(null);
        }
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'SupabaseService.initializeAuth');
      this.userSubject.next(null);
    }
  }

  async signUp(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        throw this.errorHandler.handleError(error, 'SupabaseService.signUp');
      }
      
      // If signup successful, create user role record
      if (data.user) {
        const { error: roleError } = await this.supabase
          .from('user_roles')
          .insert([{
            user_id: data.user.id,
            role: 'user' // Default role for new users
          }]);
          
        if (roleError) {
          throw this.errorHandler.handleError(roleError, 'SupabaseService.signUp.createRole');
        }
      }

      return data;
    } catch (error) {
      throw this.errorHandler.handleError(error, 'SupabaseService.signUp');
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw this.errorHandler.handleError(error, 'SupabaseService.signIn');
      }
      return data;
    } catch (error) {
      throw this.errorHandler.handleError(error, 'SupabaseService.signIn');
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw this.errorHandler.handleError(error, 'SupabaseService.signOut');
      }
    } catch (error) {
      throw this.errorHandler.handleError(error, 'SupabaseService.signOut');
    }
  }

  get currentUser() {
    return this.userSubject.value;
  }

  get client() {
    return this.supabase;
  }

  async setUserRole(userId: string, role: 'admin' | 'user') {
    try {
      const { error } = await this.supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role
        });

      if (error) {
        throw this.errorHandler.handleError(error, 'SupabaseService.setUserRole');
      }

      // If changing current user's role, update the subject
      if (userId === this.currentUser?.id) {
        this.userSubject.next(new User({
          ...this.currentUser,
          role
        }));
      }
    } catch (error) {
      throw this.errorHandler.handleError(error, 'SupabaseService.setUserRole');
    }
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}