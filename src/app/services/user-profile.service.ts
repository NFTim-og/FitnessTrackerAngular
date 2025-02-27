import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { UserProfile, WeightHistory } from '../models/user.model';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private supabaseClient: SupabaseClient;
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private errorHandler: ErrorHandlerService
  ) {
    this.supabaseClient = this.supabaseService.client;
    this.loadProfile();
  }

  async loadProfile() {
    try {
      const { data, error } = await this.supabaseClient
        .from('user_profiles')
        .select('*')
        .single();

      if (error) {
        throw this.errorHandler.handleError(error, 'UserProfileService.loadProfile');
      }
      this.profileSubject.next(data ? UserProfile.fromJSON(data) : null);
    } catch (error) {
      this.errorHandler.handleError(error, 'UserProfileService.loadProfile');
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

      if (error) {
        throw this.errorHandler.handleError(error, 'UserProfileService.createProfile');
      }

      // Also record initial weight in history
      await this.recordWeight(weight_kg);

      const profile = UserProfile.fromJSON(data);
      this.profileSubject.next(profile);
      return profile;
    } catch (error) {
      throw this.errorHandler.handleError(error, 'UserProfileService.createProfile');
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

      if (error) {
        throw this.errorHandler.handleError(error, 'UserProfileService.updateProfile');
      }

      // Record new weight in history
      await this.recordWeight(weight_kg);

      const profile = UserProfile.fromJSON(data);
      this.profileSubject.next(profile);
      return profile;
    } catch (error) {
      throw this.errorHandler.handleError(error, 'UserProfileService.updateProfile');
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

      if (error) {
        throw this.errorHandler.handleError(error, 'UserProfileService.recordWeight');
      }
    } catch (error) {
      throw this.errorHandler.handleError(error, 'UserProfileService.recordWeight');
    }
  }

  async getWeightHistory() {
    try {
      const { data, error } = await this.supabaseClient
        .from('user_weight_history')
        .select('*')
        .order('recorded_at', { ascending: false });

      if (error) {
        throw this.errorHandler.handleError(error, 'UserProfileService.getWeightHistory');
      }
      return (data || []).map(wh => WeightHistory.fromJSON(wh));
    } catch (error) {
      throw this.errorHandler.handleError(error, 'UserProfileService.getWeightHistory');
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