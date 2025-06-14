import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AuthenticationService} from '../services';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  currentStep: number = 1;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private redirectTimeout: any | null = null;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthenticationService) {
  }

  ngOnDestroy(): void {
    if (this.redirectTimeout) {
      console.log('Sign-in redirect timeout cleared.');
      clearTimeout(this.redirectTimeout);
    }
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      username: [''], // Not valid in the First Step
      email: [''],    // Not valid in the First Step
      password: ['']  // Not valid in the First Step
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.errorMessage = 'Si prega di correggere gli errori nel form.';
      return;
    }

    this.isLoading = true;

    const formData = this.registrationForm.value;
    console.log('Registration data:', formData);

    this.authService.register(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registrazione avvenuta con successo! Verrai reindirizzato alla pagina di login.';
        this.redirectTimeout = setTimeout(() => {
          this.router.navigate(['/login']).then(() => console.log('Login redirect successful'));
        }, 4000);
      }, error: (error) => {
        this.isLoading = false;
        console.error('Error during sign-in:', error);
        if (error.status === 400) {
          this.errorMessage = 'Compila correttamente i campi e riprova.';
        } else {
          this.errorMessage = 'Si è verificato un errore durante la registrazione. Riprova più tardi.';
        }
      }
    })
  }

  nextStep(): void {
    this.errorMessage = null;
    if (this.currentStep === 1) {
      this.registrationForm.get('firstName')?.markAsTouched();
      this.registrationForm.get('lastName')?.markAsTouched();

      if (this.registrationForm.get('firstName')?.valid && this.registrationForm.get('lastName')?.valid) {
        this.currentStep = 2;

        this.registrationForm.get('username')?.setValidators([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z0-9._-]+$')
        ]);

        this.registrationForm.get('email')?.setValidators([
          Validators.required,
          Validators.email
        ]);

        this.registrationForm.get('password')?.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),

          this.passwordStrengthValidator()
        ]);

        this.registrationForm.get('username')?.updateValueAndValidity();
        this.registrationForm.get('email')?.updateValueAndValidity();
        this.registrationForm.get('password')?.updateValueAndValidity();
      } else {
        this.errorMessage = 'Compila correttamente i campi obbligatori.';
      }
    }
  }

  prevStep(): void {
    this.errorMessage = null;
    if (this.currentStep === 2) {
      this.currentStep = 1;

      this.registrationForm.get('username')?.clearValidators();
      this.registrationForm.get('email')?.clearValidators();
      this.registrationForm.get('password')?.clearValidators();

      this.registrationForm.get('username')?.updateValueAndValidity();
      this.registrationForm.get('email')?.updateValueAndValidity();
      this.registrationForm.get('password')?.updateValueAndValidity();
    }
  }

  passwordStrengthValidator(): (control: any) => { [key: string]: any } | null {
    return (control: any): { [key: string]: any } | null => {
      const value = control.value || '';
      const errors: { [key: string]: boolean } = {};

      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[@#$%^&+=!*()\-_]/.test(value);

      if (!hasUpper) errors['requireUpper'] = true;
      if (!hasLower) errors['requireLower'] = true;
      if (!hasNumber) errors['requireNumber'] = true;
      if (!hasSpecial) errors['requireSpecial'] = true;

      return Object.keys(errors).length ? errors : null;
    };
  }

  isFieldInvalid(field: string) {
    const formField = this.registrationForm.get(field);
    return !!(formField?.invalid && formField?.touched);
  }
}
