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
        this.userSubject.next({
          id: session.user.id,
          email: session.user.email!
        });
      }

      // Listen for auth changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          this.userSubject.next({
            id: session.user.id,
            email: session.user.email!
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
}