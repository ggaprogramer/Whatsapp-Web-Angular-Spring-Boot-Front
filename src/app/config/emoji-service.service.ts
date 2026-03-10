import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { ConfigService } from './config-service.service';
import { Emoji } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  constructor(
      private readonly http: HttpClient,
      private readonly configService: ConfigService,
    ) {}
  
    emojiFilter(type: string): Observable<Emoji[]> {
        return this.http
        .get<Emoji[]>(this.configService.getApiUrl(`/emoji/filter/${type}`), { withCredentials: true })
        .pipe(
            catchError(this.configService.handleErrorHttp)
        );
    }
}