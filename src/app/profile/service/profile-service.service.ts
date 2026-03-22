import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from '../../config/config-service.service';
import { StatusResponse } from '../../config/interfaces';
import { catchError, delay } from 'rxjs/operators';
import { AlterInfoProfileRequest, AlterInfoProfileResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    constructor(
        private readonly http: HttpClient,
        private readonly configService: ConfigService,
    ) {}

    alterInfoProfile(alterInfoProfileRequest: AlterInfoProfileRequest): Observable<StatusResponse> {
        return this.http
        .put<StatusResponse>(this.configService.getApiUrl('/profile/update'), 
        alterInfoProfileRequest, { withCredentials: true })
        .pipe(
            catchError(this.configService.handleErrorHttp)
        );
    }

    getInfoProfile(): Observable<AlterInfoProfileResponse> {
        return this.http
        .get<AlterInfoProfileResponse>(this.configService.getApiUrl('/profile'), { withCredentials: true })
        .pipe(
            catchError(this.configService.handleErrorHttp)
        );
    }
}