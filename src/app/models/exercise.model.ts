export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Category = 'cardio' | 'strength' | 'flexibility' | 'balance';

export class Exercise {
  id: string = '';
  name: string = '';
  description: string = '';
  category: Category = 'strength';
  duration_minutes: number = 0;
  calories_per_minute: number = 0;
  difficulty: Difficulty = 'intermediate';
  met_value: number = 4.0;
  equipment_needed: string = 'none';
  muscle_groups: string[] = [];
  instructions: string = '';
  is_public: boolean = true;
  created_by: string = '';
  created_at: string = new Date().toISOString();
  updated_at: string = new Date().toISOString();

  // Legacy fields for backward compatibility
  get duration(): number { return this.duration_minutes; }
  set duration(value: number) { this.duration_minutes = value; }

  get calories(): number { return this.calories_per_minute * this.duration_minutes; }

  constructor(data: any = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || 'strength';

    // Handle both API response format (camelCase) and form data (snake_case)
    this.duration_minutes = data.duration_minutes || data.durationMinutes || data.duration || 0;
    this.calories_per_minute = Number(data.calories_per_minute || data.caloriesPerMinute) || 0;
    this.difficulty = data.difficulty || 'intermediate';
    this.met_value = Number(data.met_value || data.metValue) || 4.0;
    this.equipment_needed = data.equipment_needed || data.equipmentNeeded || 'none';
    this.muscle_groups = data.muscle_groups || data.muscleGroups || [];
    this.instructions = data.instructions || '';
    this.is_public = data.is_public !== undefined ? data.is_public : (data.isPublic !== undefined ? data.isPublic : true);
    this.created_by = data.created_by || data.createdBy || '';
    this.created_at = data.created_at || data.createdAt || new Date().toISOString();
    this.updated_at = data.updated_at || data.updatedAt || new Date().toISOString();
  }

  static fromJSON(json: any): Exercise {
    return new Exercise(json);
  }

  toJSON(): Partial<Exercise> {
    return {
      name: this.name,
      description: this.description,
      category: this.category,
      duration_minutes: this.duration_minutes,
      calories_per_minute: this.calories_per_minute,
      difficulty: this.difficulty,
      met_value: this.met_value,
      equipment_needed: this.equipment_needed,
      muscle_groups: this.muscle_groups,
      instructions: this.instructions,
      is_public: this.is_public
    };
  }
}