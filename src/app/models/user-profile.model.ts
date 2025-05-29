export class UserProfile {
  id: string;
  user_id: string;
  weight_kg: number | null;
  height_cm: number | null;
  created_at: Date;
  updated_at: Date;

  constructor(data: any) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.weight_kg = data.weight_kg;
    this.height_cm = data.height_cm;
    this.created_at = new Date(data.created_at);
    this.updated_at = new Date(data.updated_at);
  }

  get bmi(): number | null {
    if (!this.weight_kg || !this.height_cm) return null;
    const heightInMeters = this.height_cm / 100;
    return this.weight_kg / (heightInMeters * heightInMeters);
  }

  get bmiCategory(): string {
    const bmi = this.bmi;
    if (!bmi) return 'Unknown';
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }
}

export class WeightRecord {
  id: string;
  user_id: string;
  weight_kg: number;
  recorded_at: Date;

  constructor(data: any) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.weight_kg = data.weight_kg;
    this.recorded_at = new Date(data.recorded_at);
  }
}
