import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { UserProfile, WeightHistory } from '../models/types';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private supabaseClient: SupabaseClient;
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.supabaseClient = this.supabaseService.client;
    this.loadProfile();
  }

  async loadProfile() {
    try {
      const { data, error } = await this.supabaseClient
        .from('user_profiles')
        .select('*')
        .single();

      if (error) throw error;
      this.profileSubject.next(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      this.profileSubject.next(null);
    }
  }

  async createProfile(weight_kg: number, height_cm: number) {
    try {
      const { data, error } = await this.supabaseClient
        .from('user_profiles')
        .insert([{
          id: this.supabaseService.currentUser?.id,
          weight_kg,
          height_cm
        }])
        .select()
        .single();

      if (error) throw error;

      // Also record initial weight in history
      await this.recordWeight(weight_kg);

      this.profileSubject.next(data);
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async updateProfile(weight_kg: number, height_cm: number) {
    try {
      const { data, error } = await this.supabaseClient
        .from('user_profiles')
        .update({ weight_kg, height_cm })
        .eq('id', this.supabaseService.currentUser?.id)
        .select()
        .single();

      if (error) throw error;

      // Record new weight in history
      await this.recordWeight(weight_kg);

      this.profileSubject.next(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async recordWeight(weight_kg: number) {
    try {
      const { error } = await this.supabaseClient
        .from('user_weight_history')
        .insert([{
          user_id: this.supabaseService.currentUser?.id,
          weight_kg
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error recording weight:', error);
      throw error;
    }
  }

  async getWeightHistory() {
    try {
      const { data, error } = await this.supabaseClient
        .from('user_weight_history')
        .select('*')
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting weight history:', error);
      throw error;
    }
  }

  calculateCalories(metValue: number, durationMinutes: number): number {
    const profile = this.profileSubject.value;
    if (!profile) return 0;

    // Formula: Calories = MET × Weight (kg) × Duration (hours)
    const durationHours = durationMinutes / 60;
    return Math.round(metValue * profile.weight_kg * durationHours);
  }
}