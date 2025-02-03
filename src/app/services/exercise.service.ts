import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Exercise } from '../models/types';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private supabaseClient: SupabaseClient;
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  exercises$ = this.exercisesSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.supabaseClient = this.supabaseService.client;
  }

  async loadExercises() {
    try {
      const { data, error } = await this.supabaseClient
        .from('exercises')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      this.exercisesSubject.next(data || []);
    } catch (error) {
      console.error('Error loading exercises:', error);
      this.exercisesSubject.next([]);
      throw error;
    }
  }

  async getExercise(id: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting exercise:', error);
      throw error;
    }
  }

  async createExercise(exercise: Omit<Exercise, 'id' | 'created_at' | 'created_by'>) {
    try {
      const user = this.supabaseService.currentUser;
      if (!user) throw new Error('User must be authenticated to create exercises');

      const { data, error } = await this.supabaseClient
        .from('exercises')
        .insert([{ ...exercise, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      await this.loadExercises();
      return data;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  }

  async updateExercise(id: string, exercise: Partial<Exercise>) {
    try {
      const { data, error } = await this.supabaseClient
        .from('exercises')
        .update(exercise)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await this.loadExercises();
      return data;
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  }

  async deleteExercise(id: string) {
    try {
      const { error } = await this.supabaseClient
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await this.loadExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }

  async searchExercises(query: string, difficulty?: string) {
    try {
      let queryBuilder = this.supabaseClient
        .from('exercises')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('name', { ascending: true });

      if (difficulty) {
        queryBuilder = queryBuilder.eq('difficulty', difficulty);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching exercises:', error);
      throw error;
    }
  }
}