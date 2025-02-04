export interface Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  difficulty: 'easy' | 'medium' | 'hard';
  met_value: number;
  created_by: string;
  created_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_plan_id: string;
  exercise_id: string;
  order: number;
  exercise?: Exercise;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  exercises?: WorkoutExercise[];
}

export interface UserWorkoutPlan {
  id: string;
  user_id: string;
  workout_plan_id: string;
  started_at: string;
  workout_plan?: WorkoutPlan;
}

export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'user';
}
export interface UserProfile {
  id: string;
  weight_kg: number;
  height_cm: number;
  created_at: string;
  updated_at: string;
}

export interface WeightHistory {
  id: string;
  user_id: string;
  weight_kg: number;
  recorded_at: string;
}