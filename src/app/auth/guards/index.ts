import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const routesProtected: CanActivateFn = () => {
	const authService = inject(AuthService);
    const router = inject(Router);
	return authService.isAuthenticated().pipe(
        // Se a resposta for bem-sucedida, o usuário está autenticado e pode acessar a rota protegida
        map(() => true),
        // Se ocorrer um erro (como 401 Unauthorized), o usuário não está autenticado
        catchError(() => of(router.createUrlTree(['/auth/login'])))
    );
};

export const routesFree: CanActivateFn = () => {
	const authService = inject(AuthService);
    const router = inject(Router);
	return authService.isAuthenticated().pipe(
        // Se a resposta for bem-sucedida, o usuário está autenticado não pode acessar as rotas de login, registro, etc.
        map(() => router.createUrlTree(['/'])),
        // Se ocorrer um erro (como 401 Unauthorized), o usuário não está autenticado e pode acessar as rotas de login, registro, etc.
        catchError(() => of(true))
    );
};