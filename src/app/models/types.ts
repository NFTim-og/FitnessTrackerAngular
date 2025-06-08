export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'balance';
  duration_minutes: number;
  calories_per_minute: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  met_value: number;
  equipment_needed: string;
  muscle_groups: string[];
  instructions: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;

  // Legacy fields for backward compatibility
  duration: number;
  calories: number;
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