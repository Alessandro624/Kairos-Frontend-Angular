import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AuthenticationService} from '../services';

@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {
  forgotPasswordForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      usernameOrEmail: ['', Validators.required]
    });
  }

  onSubmit() {
    this.errorMessage = null; // Resetta i messaggi
    this.successMessage = null;

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const passwordResetRequest = {usernameOrEmail: this.forgotPasswordForm.get('usernameOrEmail')?.value};

    console.log('Forgot password request for ', passwordResetRequest);

    this.authService.forgotPassword(passwordResetRequest).subscribe({
        next: () => {
          console.log('Password reset request successful');
          this.successMessage = 'Le istruzioni per il recupero password sono state inviate all\'indirizzo email fornito.';
          setTimeout(() => {
            this.router.navigate(['/login']).then(() => console.log('Login redirect successful'));
          }, 4000);
        }, error: (error) => {
          console.error('Error during login:', error);
          if (error.status === 400) {
            this.errorMessage = 'Errore nell\'invio. Riprova.';
          } else {
            this.errorMessage = 'Si è verificato un errore durante l\'invio. Riprova più tardi.';
          }
        }
      }
    )
  }
}
