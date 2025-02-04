import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private async getUserRole(userId: string): Promise<'admin' | 'user'> {
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
          .insert({ user_id: userId, role: 'user' })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user role:', insertError);
          return 'user';
        }

        return newRole.role;
      } else {
        console.error('Error fetching user role:', error);
      }
      return 'user'; // Default to user role if there's an error
    }

    return data?.role || 'user';
  }

  constructor() {
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

    // Check for existing session
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.user) {
        const role = await this.getUserRole(session.user.id);
        this.userSubject.next({
          id: session.user.id,
          email: session.user.email!,
          role
        });
      }

      // Listen for auth changes
      this.supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const role = await this.getUserRole(session.user.id);
          this.userSubject.next({
            id: session.user.id,
            email: session.user.email!,
            role
          });
        } else {
          this.userSubject.next(null);
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.userSubject.next(null);
    }
  }

  async signUp(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password
      });
      
      // If signup successful, create user role record
      if (data.user) {
        await this.supabase
          .from('user_roles')
          .insert([{
            user_id: data.user.id,
            role: 'user' // Default role for new users
          }]);
      }

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
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

      if (error) throw error;

      // If changing current user's role, update the subject
      if (userId === this.currentUser?.id) {
        this.userSubject.next({
          ...this.currentUser,
          role
        });
      }
    } catch (error) {
      console.error('Error setting user role:', error);
      throw error;
    }
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}