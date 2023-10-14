import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service.service';

export const loginGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (await authService.isAuthenticated()) {
    router.navigate(['home']);
    return false;
  } else {
    return true;
  }
}