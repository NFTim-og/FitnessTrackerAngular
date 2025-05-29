export type Difficulty = 'easy' | 'medium' | 'hard';

export class Exercise {
  id: string = '';
  name: string = '';
  duration: number = 0;
  calories: number = 0;
  difficulty: Difficulty = 'medium';
  met_value: number = 4.0;
  created_by: string = '';
  created_at: string = new Date().toISOString();
  updated_at: string = new Date().toISOString();

  constructor(data: Partial<Exercise> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.duration = data.duration || 0;
    this.calories = data.calories || 0;
    this.difficulty = data.difficulty || 'medium';
    this.met_value = data.met_value || 4.0;
    this.created_by = data.created_by || '';
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
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