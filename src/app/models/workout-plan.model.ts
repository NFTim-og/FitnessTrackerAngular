import { Exercise } from './exercise.model';

export class WorkoutExercise {
  id: string = '';
  workout_plan_id: string = '';
  exercise_id: string = '';
  order: number = 0;
  exercise?: Exercise;

  constructor(data: Partial<WorkoutExercise> = {}) {
    this.id = data.id || '';
    this.workout_plan_id = data.workout_plan_id || '';
    this.exercise_id = data.exercise_id || '';
    this.order = data.order || 0;
    this.exercise = data.exercise ? new Exercise(data.exercise) : undefined;
  }

  static fromJSON(json: any): WorkoutExercise {
    return new WorkoutExercise({
      ...json,
      exercise: json.exercise ? Exercise.fromJSON(json.exercise) : undefined
    });
  }
}

export class WorkoutPlan {
  id: string = '';
  name: string = '';
  description: string = '';
  category: string = '';
  difficulty: string = '';
  estimatedDurationMinutes: number = 0;
  targetCalories: number = 0;
  created_by: string = '';
  createdBy: string = '';
  creatorName: string = '';
  isPublic: boolean = true;
  created_at: string = new Date().toISOString();
  updated_at: string = new Date().toISOString();
  createdAt: string = new Date().toISOString();
  updatedAt: string = new Date().toISOString();
  exercises?: WorkoutExercise[];

  constructor(data: Partial<WorkoutPlan> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.difficulty = data.difficulty || '';
    this.estimatedDurationMinutes = data.estimatedDurationMinutes || 0;
    this.targetCalories = data.targetCalories || 0;
    this.created_by = data.created_by || data.createdBy || '';
    this.createdBy = data.createdBy || data.created_by || '';
    this.creatorName = data.creatorName || '';
    this.isPublic = data.isPublic !== undefined ? data.isPublic : true;
    this.created_at = data.created_at || data.createdAt || new Date().toISOString();
    this.updated_at = data.updated_at || data.updatedAt || new Date().toISOString();
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
    this.exercises = data.exercises?.map(e => new WorkoutExercise(e));
  }

  static fromJSON(json: any): WorkoutPlan {
    return new WorkoutPlan({
      id: json.id,
      name: json.name,
      description: json.description,
      category: json.category,
      difficulty: json.difficulty,
      estimatedDurationMinutes: json.estimatedDurationMinutes,
      targetCalories: json.targetCalories,
      createdBy: json.createdBy,
      creatorName: json.creatorName,
      isPublic: json.isPublic,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
      exercises: json.exercises?.map((e: any) => WorkoutExercise.fromJSON(e))
    });
  }

  toJSON(): Partial<WorkoutPlan> {
    return {
      name: this.name,
      description: this.description
    };
  }

  getExercises(): Exercise[] {
    return this.exercises
      ?.filter(we => we.exercise)
      .map(we => we.exercise!)
      .sort((a, b) => a.name.localeCompare(b.name)) || [];
  }
}