export type Difficulty = 'easy' | 'medium' | 'hard';

export class Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  difficulty: Difficulty;
  met_value: number;
  created_by: string;
  created_at: string;

  constructor(data: Partial<Exercise> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.duration = data.duration || 0;
    this.calories = data.calories || 0;
    this.difficulty = data.difficulty || 'medium';
    this.met_value = data.met_value || 4.0;
    this.created_by = data.created_by || '';
    this.created_at = data.created_at || new Date().toISOString();
  }

  static fromJSON(json: any): Exercise {
    return new Exercise(json);
  }

  toJSON(): Partial<Exercise> {
    return {
      name: this.name,
      duration: this.duration,
      difficulty: this.difficulty,
      met_value: this.met_value
    };
  }
}