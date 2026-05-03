import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { TypeMessage, StatusMessage } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  urlFrontend = 'http://localhost:4200'; 
  urlBackend = 'http://localhost:8080';

  getApiUrl(endpoint: string): string {
    return `${this.urlBackend}${endpoint}`;
  }

  getFrontEndUrl(endpoint: string): string {
    return `${this.urlFrontend}${endpoint}`;
  }

  handleErrorHttp(error: HttpErrorResponse) {
      console.error('Erro HTTP:', error);
  
      let message = 'Erro inesperado';
  
      if (error.error instanceof ErrorEvent) {
        message = error.error.message;
      } else {
        message = `Erro ${error.status}:${error.message}`;
      }
  
      return throwError(() => new Error(message));
  }

  // System Message
  private selectedMessage$ = this.makeMessage();

  private makeMessage(): Subject<StatusMessage>{
    return new Subject<StatusMessage>();
  }

  getMessage() {
    return this.selectedMessage$.asObservable();
  }

  sendMessage(status: StatusMessage) {
    this.selectedMessage$.next(status);

    let intervalOut = setTimeout(() => {
      this.selectedMessage$.next({...status, disabled: true});
      clearTimeout(intervalOut);
    }, status.duration);
  }

  completeMessage(){
    this.selectedMessage$.complete();
  }
}
