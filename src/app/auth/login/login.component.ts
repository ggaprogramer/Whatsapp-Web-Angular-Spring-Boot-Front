import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service.service';
import { ConfigService } from '../../config/config-service.service';
import { LoginRequest, LoginResponse } from '../interfaces';
import { tap, finalize } from 'rxjs/operators';

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
    private readonly configService: ConfigService,
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

      this.formLoader = true;
      this.authService.login(loginRequest)
      .pipe(
          finalize(() => { 
            this.formLoader = false;
          })
        )
      .subscribe({
        next: (response: LoginResponse) => {
          this.router.navigate(['/']);
        }, 
        error: (error) => {
          let errors = this.form.errors;
          const responseBody = error.error;
          const errorType = responseBody.type;

          if(errorType == 'email'){
            this.form.get('email')!.setErrors({
              'emailNoExists': responseBody.message
            }); 
          } else if(errorType == 'password'){
            this.form.get('password')!.setErrors({
              'passwordIncorrect': responseBody.message
            }); 
          } else if(errorType == 'system'){
            this.form.setErrors({
              ...errors,
              'system': responseBody.message
            }); 
          }
          
          this.configService.sendMessage({
            message: responseBody.message, 
            status: 'ERROR',
            disabled: false,
            duration: 3000,
          });
        }
      });
    }
  }
}
