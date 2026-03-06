import { Injectable } from '@angular/core';

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
}
