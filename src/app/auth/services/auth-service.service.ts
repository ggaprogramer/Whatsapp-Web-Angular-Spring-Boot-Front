import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../interfaces';
import { ConfigService } from '../../config/config-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	constructor(
    private readonly http: HttpClient,
    private readonly configService: ConfigService,
  ) {}

	login(loginRequest: LoginRequest): Observable<LoginResponse> {
		return this.http
      .post<LoginResponse>(this.configService.getApiUrl('/auth/login'), loginRequest, { withCredentials: true })
  }

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
		return this.http
      .post<RegisterResponse>(this.configService.getApiUrl('/auth/register'), registerRequest, { withCredentials: true })
  }

  isAuthenticated() {
		return this.http
      .post(this.configService.getApiUrl('/auth/is-authenticated'), {}, { withCredentials: true })
      .pipe(
				catchError(this.configService.handleErrorHttp)
      );
  }

  logout() {
		return this.http
      .post(this.configService.getApiUrl('/auth/logout'), {}, { withCredentials: true })
      .pipe(
				catchError(this.configService.handleErrorHttp)
      );
  }

}
