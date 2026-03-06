import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service.service';
import { RegisterRequest, RegisterResponse } from '../interfaces';
import { passwordsMatchValidator } from '../validators';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    constructor(private readonly authService: AuthService) {}

  form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password1: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(8)]),
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
      this.authService.register(registerRequest)
      .pipe(
        tap(value => { 
          this.formLoader = true;
        })
      )
      .subscribe({
        next: (response: RegisterResponse) => {
          console.log('Register response:', response);
        },
        error: (error) => {
          console.error('Register error:', error);
          this.formLoader = false;
        },
        complete: () => { 
          this.formLoader = false; 
        }
      });
    }
  }
}
