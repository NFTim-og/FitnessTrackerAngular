import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { WorkoutPlan, WorkoutExercise } from '../models/types';
import { SupabaseService } from './supabase.service';

interface PaginationParams {
  page: number;
  perPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlanService {
  private supabaseClient: SupabaseClient;
  private workoutPlansSubject = new BehaviorSubject<WorkoutPlan[]>([]);
  private totalCountSubject = new BehaviorSubject<number>(0);
  private currentParams: PaginationParams = { page: 1, perPage: 1 };
  
  workoutPlans$ = this.workoutPlansSubject.asObservable();
  totalCount$ = this.totalCountSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.supabaseClient = this.supabaseService.client;
  }

  async loadWorkoutPlans(params: PaginationParams) {
    try {
      this.currentParams = params;
      // First, get total count
      const { count, error: countError } = await this.supabaseClient
        .from('workout_plans')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      this.totalCountSubject.next(count || 0);

      // Then get paginated data
      const { data, error } = await this.supabaseClient
        .from('workout_plans')
        .select(`
          *,
          exercises:workout_exercises(
            exercise:exercises(*)
          )
        `)
        .order('name', { ascending: true })
        .range(
          (params.page - 1) * params.perPage,
          params.page * params.perPage - 1
        );

      if (error) throw error;
      this.workoutPlansSubject.next(data || []);
    } catch (error) {
      console.error('Error loading workout plans:', error);
      this.workoutPlansSubject.next([]);
      throw error;
    }
  }

  async getWorkoutPlan(id: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('workout_plans')
        .select(`
          *,
          exercises:workout_exercises(
            exercise:exercises(*)
          )
        `)
        .eq('id', id)
        .order('name', { ascending: true })
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting workout plan:', error);
      throw error;
    }
  }

  async createWorkoutPlan(workoutPlan: Omit<WorkoutPlan, 'id' | 'created_at' | 'created_by'>, exercises: { id: string; order: number }[]) {
    try {
      const user = this.supabaseService.currentUser;
      if (!user) throw new Error('User must be authenticated to create workout plans');

      // Start a transaction by creating the workout plan
      const { data: plan, error: planError } = await this.supabaseClient
        .from('workout_plans')
        .insert([{ ...workoutPlan, created_by: user.id }])
        .select()
        .single();

      if (planError) throw planError;

      // Add exercises to the workout plan
      if (exercises.length > 0) {
        const workoutExercises = exercises.map(exercise => ({
          workout_plan_id: plan.id,
          exercise_id: exercise.id,
          order: exercise.order
        }));

        const { error: exercisesError } = await this.supabaseClient
          .from('workout_exercises')
          .insert(workoutExercises);

        if (exercisesError) throw exercisesError;
      }

      await this.loadWorkoutPlans(this.currentParams);
      return plan;
    } catch (error) {
      console.error('Error creating workout plan:', error);
      throw error;
    }
  }

  async updateWorkoutPlan(
    id: string,
    workoutPlan: Partial<WorkoutPlan>,
    exercises?: { id: string; order: number }[]
  ) {
    try {
      // Update the workout plan
      const { data: plan, error: planError } = await this.supabaseClient
        .from('workout_plans')
        .update(workoutPlan)
        .eq('id', id)
        .select()
        .single();

      if (planError) throw planError;

      // If exercises are provided, update them
      if (exercises) {
        // First, remove existing exercises
        const { error: deleteError } = await this.supabaseClient
          .from('workout_exercises')
          .delete()
          .eq('workout_plan_id', id);

        if (deleteError) throw deleteError;

        // Then, add the new exercises
        if (exercises.length > 0) {
          const workoutExercises = exercises.map(exercise => ({
            workout_plan_id: id,
            exercise_id: exercise.id,
            order: exercise.order
          }));

          const { error: exercisesError } = await this.supabaseClient
            .from('workout_exercises')
            .insert(workoutExercises);

          if (exercisesError) throw exercisesError;
        }
      }

      await this.loadWorkoutPlans(this.currentParams);
      return plan;
    } catch (error) {
      console.error('Error updating workout plan:', error);
      throw error;
    }
  }

  async deleteWorkoutPlan(id: string) {
    try {
      const { error } = await this.supabaseClient
        .from('workout_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await this.loadWorkoutPlans(this.currentParams);
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      throw error;
    }
  }

  async searchWorkoutPlans(query: string, params: PaginationParams) {
    try {
      this.currentParams = params;
      // First, get filtered total count
      const { count, error: countError } = await this.supabaseClient
        .from('workout_plans')
        .select('*', { count: 'exact', head: true })
        .ilike('name', `%${query}%`);

      if (countError) throw countError;
      this.totalCountSubject.next(count || 0);

      // Then get paginated and filtered data
      const { data, error } = await this.supabaseClient
        .from('workout_plans')
        .select(`
          *,
          exercises:workout_exercises(
            exercise:exercises(*)
          )
        `)
        .ilike('name', `%${query}%`)
        .range(
          (params.page - 1) * params.perPage,
          params.page * params.perPage - 1
        );

      if (error) throw error;
      this.workoutPlansSubject.next(data || []);
    } catch (error) {
      console.error('Error searching workout plans:', error);
      throw error;
    }
  }
}