import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthenticationService} from '../services';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const authRequest = {
        usernameOrEmail: this.loginForm.get('usernameOrEmail')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(authRequest).subscribe({
        next: (response) => {
          const authToken = response.token;
          localStorage.setItem('auth_token', authToken || '');
          localStorage.setItem('refresh_token', response.refreshToken || '');
          
          if (authToken) {
            const decodedAuthToken = this.authService.decodeJwt(authToken);
            if (decodedAuthToken && decodedAuthToken.exp) {
              const authExpiresAt = new Date(decodedAuthToken.exp * 1000);
              localStorage.setItem('auth_token_expiry', authExpiresAt.toISOString());
            } else {
              console.warn('Invalid claim "exp"');
            }
          }

          this.router.navigate(['/home']).then(() => console.log('Login successful'));
        },
        error: (error) => {
          console.error('Error during login:', error);
          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Credenziali non valide. Riprova.';
          } else {
            this.errorMessage = 'Si è verificato un errore durante l\'accesso. Riprova più tardi.';
          }
        }
      });
    }
  }

  loginWithGoogle() {

  }

  loginWithKeycloak() {

  }
}
