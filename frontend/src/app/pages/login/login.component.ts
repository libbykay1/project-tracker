import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Credentials } from 'src/app/shared/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor( private router: Router, private authService: AuthService,) {
    this.loginForm = new FormGroup({

      //TODO change back to email - adjust validator
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }


  // logs the user in - checks if admin and routes properly
  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: Credentials = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          // Handle successful login

          if (response.admin) {
            this.router.navigate(['/select-company']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error: any) => {
          this.errorMessage = 'Invalid username or password';
        }
      });
    }
  }
}


