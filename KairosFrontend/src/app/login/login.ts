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
          const refreshToken = response.refreshToken;

          if (authToken && refreshToken) {
            this.authService.setTokens(authToken, refreshToken);
            this.router.navigate(['/home']).then(() => console.log('Login successful'));
          } else {
            this.errorMessage = 'Autenticazione non avvenuta. Riprova';
            console.error("Authentication tokens not found in response.");
            this.router.navigate(['/login']).then(() => console.log('Retry login'));
          }
        },
        error: (error) => {
          console.error('Error during login:', error);
          if (error.status === 400 || error.status === 401) {
            this.errorMessage = 'Credenziali non valide. Riprova.';
          } else {
            this.errorMessage = 'Si è verificato un errore durante l\'accesso. Riprova più tardi.';
          }
        }
      });
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithKeycloak() {
    this.authService.loginWithKeycloak();
  }
}
