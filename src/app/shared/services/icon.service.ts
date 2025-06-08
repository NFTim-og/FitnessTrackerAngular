import { Injectable } from '@angular/core';

/**
 * Icon Service
 * Provides consistent icon mappings for different categories, difficulties, and actions
 */
@Injectable({
  providedIn: 'root'
})
export class IconService {

  /**
   * Get icon name for exercise category
   */
  getCategoryIcon(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      'cardio': 'heart',
      'strength': 'dumbbell',
      'flexibility': 'stretch-horizontal',
      'balance': 'scale',
      'sports': 'trophy'
    };
    return categoryIcons[category] || 'activity';
  }

  /**
   * Get icon name for difficulty level
   */
  getDifficultyIcon(difficulty: string): string {
    const difficultyIcons: { [key: string]: string } = {
      'beginner': 'circle',
      'intermediate': 'circle-dot',
      'advanced': 'target'
    };
    return difficultyIcons[difficulty] || 'circle';
  }

  /**
   * Get icon name for muscle group
   */
  getMuscleGroupIcon(muscleGroup: string): string {
    const muscleGroupIcons: { [key: string]: string } = {
      'chest': 'shield',
      'back': 'shield-check',
      'shoulders': 'triangle',
      'arms': 'zap',
      'biceps': 'zap',
      'triceps': 'zap',
      'forearms': 'minus',
      'legs': 'move-vertical',
      'quadriceps': 'move-vertical',
      'hamstrings': 'move-vertical',
      'calves': 'move-vertical',
      'glutes': 'square',
      'core': 'hexagon',
      'abs': 'hexagon',
      'obliques': 'diamond',
      'full_body': 'user',
      'cardio': 'heart'
    };
    return muscleGroupIcons[muscleGroup.toLowerCase().replace(' ', '_')] || 'circle';
  }

  /**
   * Get icon name for equipment
   */
  getEquipmentIcon(equipment: string): string {
    const equipmentIcons: { [key: string]: string } = {
      'none': 'user',
      'bodyweight': 'user',
      'dumbbells': 'dumbbell',
      'barbell': 'minus',
      'resistance_bands': 'link',
      'kettlebell': 'circle',
      'pull_up_bar': 'minus',
      'yoga_mat': 'square',
      'treadmill': 'play',
      'bicycle': 'bike',
      'elliptical': 'repeat'
    };
    return equipmentIcons[equipment.toLowerCase().replace(' ', '_')] || 'wrench';
  }

  /**
   * Get icon name for action buttons
   */
  getActionIcon(action: string): string {
    const actionIcons: { [key: string]: string } = {
      'edit': 'edit',
      'delete': 'trash-2',
      'add': 'plus',
      'save': 'check',
      'cancel': 'x',
      'search': 'search',
      'filter': 'filter',
      'sort': 'arrow-up-down',
      'view': 'eye',
      'play': 'play',
      'pause': 'pause',
      'stop': 'square',
      'settings': 'settings',
      'info': 'info',
      'warning': 'alert-triangle',
      'error': 'alert-circle',
      'success': 'check-circle'
    };
    return actionIcons[action] || 'circle';
  }

  /**
   * Get color class for category
   */
  getCategoryColor(category: string): string {
    const categoryColors: { [key: string]: string } = {
      'cardio': 'text-red-600 bg-red-50',
      'strength': 'text-blue-600 bg-blue-50',
      'flexibility': 'text-green-600 bg-green-50',
      'balance': 'text-purple-600 bg-purple-50',
      'sports': 'text-orange-600 bg-orange-50'
    };
    return categoryColors[category] || 'text-gray-600 bg-gray-50';
  }

  /**
   * Get color class for difficulty
   */
  getDifficultyColor(difficulty: string): string {
    const difficultyColors: { [key: string]: string } = {
      'beginner': 'text-green-600 bg-green-50',
      'intermediate': 'text-yellow-600 bg-yellow-50',
      'advanced': 'text-red-600 bg-red-50'
    };
    return difficultyColors[difficulty] || 'text-gray-600 bg-gray-50';
  }

  /**
   * Get color class for muscle group
   */
  getMuscleGroupColor(muscleGroup: string): string {
    const muscleGroupColors: { [key: string]: string } = {
      'chest': 'text-blue-600 bg-blue-50',
      'back': 'text-indigo-600 bg-indigo-50',
      'shoulders': 'text-purple-600 bg-purple-50',
      'arms': 'text-orange-600 bg-orange-50',
      'biceps': 'text-orange-600 bg-orange-50',
      'triceps': 'text-orange-600 bg-orange-50',
      'forearms': 'text-orange-600 bg-orange-50',
      'legs': 'text-green-600 bg-green-50',
      'quadriceps': 'text-green-600 bg-green-50',
      'hamstrings': 'text-green-600 bg-green-50',
      'calves': 'text-green-600 bg-green-50',
      'glutes': 'text-pink-600 bg-pink-50',
      'core': 'text-yellow-600 bg-yellow-50',
      'abs': 'text-yellow-600 bg-yellow-50',
      'obliques': 'text-yellow-600 bg-yellow-50',
      'full_body': 'text-gray-600 bg-gray-50',
      'cardio': 'text-red-600 bg-red-50'
    };
    return muscleGroupColors[muscleGroup.toLowerCase().replace(' ', '_')] || 'text-gray-600 bg-gray-50';
  }

  // Material Icons versions
  getCategoryMaterialIcon(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      'strength': 'fitness_center',
      'cardio': 'directions_run',
      'flexibility': 'self_improvement',
      'balance': 'balance',
      'endurance': 'timer',
      'power': 'flash_on',
      'agility': 'speed',
      'coordination': 'gesture',
      'general': 'sports'
    };

    return categoryIcons[category.toLowerCase()] || 'sports';
  }

  getDifficultyMaterialIcon(difficulty: string): string {
    const difficultyIcons: { [key: string]: string } = {
      'beginner': 'radio_button_unchecked',
      'intermediate': 'adjust',
      'advanced': 'gps_fixed'
    };

    return difficultyIcons[difficulty.toLowerCase()] || 'radio_button_unchecked';
  }

  // Material Icons for muscle groups
  getMuscleGroupMaterialIcon(muscleGroup: string): string {
    const muscleGroupIcons: { [key: string]: string } = {
      'chest': 'fitness_center',
      'back': 'accessibility_new',
      'shoulders': 'sports_gymnastics',
      'arms': 'sports_martial_arts',
      'biceps': 'sports_martial_arts',
      'triceps': 'sports_martial_arts',
      'forearms': 'sports_martial_arts',
      'legs': 'directions_walk',
      'quadriceps': 'directions_walk',
      'hamstrings': 'directions_walk',
      'calves': 'directions_walk',
      'glutes': 'sports_gymnastics',
      'core': 'self_improvement',
      'abs': 'self_improvement',
      'obliques': 'self_improvement',
      'full_body': 'accessibility',
      'cardio': 'favorite'
    };

    return muscleGroupIcons[muscleGroup.toLowerCase().replace(' ', '_')] || 'fitness_center';
  }

  // Material Icons for equipment types
  getEquipmentMaterialIcon(equipment: string): string {
    const equipmentIcons: { [key: string]: string } = {
      'dumbbells': 'fitness_center',
      'barbell': 'fitness_center',
      'kettlebell': 'fitness_center',
      'resistance_bands': 'sports_gymnastics',
      'pull_up_bar': 'sports_gymnastics',
      'bench': 'weekend',
      'cable_machine': 'settings',
      'treadmill': 'directions_run',
      'stationary_bike': 'pedal_bike',
      'rowing_machine': 'rowing',
      'elliptical': 'sports',
      'bodyweight': 'accessibility',
      'medicine_ball': 'sports_volleyball',
      'foam_roller': 'sports_gymnastics',
      'yoga_mat': 'self_improvement',
      'jump_rope': 'sports',
      'suspension_trainer': 'sports_gymnastics'
    };

    return equipmentIcons[equipment.toLowerCase().replace(' ', '_')] || 'build';
  }

  // Material Icons for action buttons
  getActionMaterialIcon(action: string): string {
    const actionIcons: { [key: string]: string } = {
      'edit': 'edit',
      'delete': 'delete',
      'add': 'add',
      'save': 'save',
      'cancel': 'close',
      'search': 'search',
      'filter': 'filter_list',
      'sort': 'sort',
      'view': 'visibility',
      'play': 'play_arrow',
      'pause': 'pause',
      'stop': 'stop',
      'settings': 'settings',
      'info': 'info',
      'warning': 'warning',
      'error': 'error',
      'success': 'check_circle'
    };

    return actionIcons[action] || 'help';
  }
}