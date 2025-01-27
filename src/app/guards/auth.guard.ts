import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { map, take } from 'rxjs/operators';

export const authGuard = () => {
  const router = inject(Router);
  const supabaseService = inject(SupabaseService);

  return supabaseService.user$.pipe(
    take(1),
    map(user => {
      if (user) return true;
      
      router.navigate(['/auth/login']);
      return false;
    })
  );
};