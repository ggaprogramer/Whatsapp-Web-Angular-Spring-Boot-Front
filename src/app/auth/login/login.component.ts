import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service.service';
import { LoginRequest, LoginResponse } from '../interfaces';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  formLoader: boolean = false;

  submit(){
    if(this.form.valid){
      const loginRequest: LoginRequest = {
        email: this.form.value.email!,
        password: this.form.value.password!,
        rememberPassword: false
      };
      this.authService.login(loginRequest)
      .pipe(
          tap(value => { 
            this.formLoader = true;
          })
        )
      .subscribe({
        next: (response: LoginResponse) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.formLoader = false;
          console.error('Login error:', error);
        },
        complete: () => { 
          this.formLoader = false;
        }
      });
    }
  }
}
