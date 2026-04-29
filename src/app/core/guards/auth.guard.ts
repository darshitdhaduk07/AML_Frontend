import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of } from 'rxjs';

/**
 * Guard to prevent unauthenticated access to protected routes.
 * Now includes server-side verification.
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return of(router.parseUrl('/admin/login'));
    }

    return authService.verifyToken().pipe(
        map((isValid) => {
            if (isValid) {
                return true;
            }

            // If token is invalid (expired/malicious), verifyToken() already called logout()
            return router.parseUrl('/admin/login');
        }),
    );
};
