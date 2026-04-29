import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard to restrict access based on user roles.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const expectedRoles = route.data['expectedRoles'] as string[];
    const userRole = authService.getUserRole();

    if (userRole && expectedRoles.includes(userRole)) {
        return true;
    }

    // Redirect to unauthorized or login if role doesn't match
    console.warn(
        `Unauthorized access attempt. User role: ${userRole}, Expected: ${expectedRoles}`,
    );
    return router.parseUrl('/admin/login');
};
