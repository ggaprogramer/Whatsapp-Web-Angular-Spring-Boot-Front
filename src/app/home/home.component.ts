import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/services/auth-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private readonly authService: AuthService) {}

  logout() {
    this.authService.logout().subscribe({
      next: (error) => {
        console.log('Logout success:', error);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
