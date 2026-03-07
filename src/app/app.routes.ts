import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { routesProtected, routesFree } from './auth/guards';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent, 
        canActivate: [routesProtected],
        title: 'Home',
    },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
                title: 'Login',
                canActivate: [routesFree],
            },
            {
                path: 'register',
                component: RegisterComponent,
                title: 'Registro',
                canActivate: [routesFree],
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
                title: 'Esqueci minha senha',
                canActivate: [routesFree],
            }
        ],
    },
    {
        path: 'dashboard',
        component: DashboardComponent, 
        canActivate: [routesProtected],
        title: 'Dashboard',
    },
];
