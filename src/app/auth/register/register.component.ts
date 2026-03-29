import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service.service';
import { RegisterRequest, RegisterResponse } from '../interfaces';
import { ConfigService } from '../../config/config-service.service';
import { passwordsMatchValidator } from '../validators';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    constructor(
      private readonly authService: AuthService,
      private readonly configService: ConfigService,
      private readonly router: Router,
    ) {}

  form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      password1: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]),
    }, { validators: passwordsMatchValidator });

  formLoader: boolean = false;

  submit(){
    if(this.form.valid){
      const registerRequest: RegisterRequest = {
        name: this.form.value.name!,
        username: this.form.value.username!,
        email: this.form.value.email!,
        password1: this.form.value.password1!,
        password2: this.form.value.password2!,
        roles: ['USER']
      };

      this.formLoader = true;
      this.authService.register(registerRequest)
      .pipe(
        finalize(() => { 
          this.formLoader = false;
        })
      )
      .subscribe({
        next: (response: RegisterResponse) => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          let errors = this.form.errors;
          const responseBody = error.error;
          const errorType = responseBody.type;

          if(errorType == 'email'){
            this.form.get('email')!.setErrors({
              'emailExists': responseBody.message
            }); 
          } else if(errorType == 'username'){
            this.form.get('username')!.setErrors({
              'usernameExists': responseBody.message
            }); 
          } else if(errorType == 'system'){
            this.form.setErrors({
              ...errors,
              'system': responseBody.message
            }); 
          } else if(errorType == 'roles'){
            this.form.setErrors({
              ...errors,
              'roles': responseBody.message
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
