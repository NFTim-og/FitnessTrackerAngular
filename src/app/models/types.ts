export interface Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  difficulty: 'easy' | 'medium' | 'hard';
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
}