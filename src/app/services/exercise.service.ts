import { Injectable, inject } from '@angular/core';
import { Exercise } from '../models/types';
import { BaseDataService } from '../shared/services/base-data.service';
import { SupabaseService } from './supabase.service';
import { PaginationParams } from '../shared/interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService extends BaseDataService<Exercise> {
  constructor(private supabaseService: SupabaseService) {
    super(inject(SupabaseService).client, 'exercises');
  }
  async loadExercises(params: PaginationParams) {
    try {
      const response = await this.fetchPaginatedData(params);
      this.dataSubject.next(response.data);
      this.totalCountSubject.next(response.totalCount);
    } catch (error) {
      console.error('Error loading exercises:', error);
      this.dataSubject.next([]);
      this.totalCountSubject.next(0);
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
      await this.loadExercises({ page: 1, perPage: 6 });
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
      await this.loadExercises({ page: 1, perPage: 6 });
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
      await this.loadExercises({ page: 1, perPage: 6 });
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }
  async searchExercises(query: string, difficulty: string, params: PaginationParams) {
    try {
      const response = await this.fetchPaginatedData(params, (queryBuilder) => {
        let q = queryBuilder.ilike('name', `%${query}%`);
        if (difficulty) {
          q = q.eq('difficulty', difficulty);
        }
        return q;
      });
      
      this.dataSubject.next(response.data);
      this.totalCountSubject.next(response.totalCount);
    } catch (error) {
      console.error('Error searching exercises:', error);
      this.dataSubject.next([]);
      this.totalCountSubject.next(0);
      throw error;
    }
  }
}