import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {UserDTO, UserPasswordUpdateDTO, UsersService, UserUpdateDTO} from '../services';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  isLoading: boolean = false;
  errorMessage: string | null = null;
  updateSuccess: boolean = false;
  passwordChangeSuccess: boolean = false;
  passwordErrorMessage: string | null = null;
  currentUser: UserDTO | null = null;
  userForm!: FormGroup;
  passwordForm!: FormGroup;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;

  constructor(private fb: FormBuilder, private usersService: UsersService) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      username: [{value: '', disabled: true}, Validators.required],
      phoneNumber: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern('^\\+?[0-9]+$')]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), this.passwordStrengthValidator()]],
      confirmNewPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.usersService.getCurrentUser().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (user: UserDTO) => {
        this.currentUser = user;
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          phoneNumber: user.phoneNumber || ''
        });
        this.userForm.markAsPristine();
        this.userForm.markAsUntouched();
      },
      error: (err) => {
        console.error('Failed to load user profile', err);
        this.errorMessage = 'Errore nel caricamento del profilo. Riprova più tardi.';
      }
    });
  }

  onUpdateProfile(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      this.errorMessage = 'Compila correttamente tutti i campi richiesti.';
      return;
    }

    if (this.userForm.pristine) {
      this.errorMessage = 'Nessuna modifica rilevata. Impossibile salvare.';
      return;
    }

    this.updateSuccess = false;
    this.errorMessage = null;

    const userUpdate: UserUpdateDTO = {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      phoneNumber: this.userForm.value.phoneNumber || undefined
    };

    this.usersService.updateUser(userUpdate, this.currentUser?.id).subscribe({
      next: (updatedUser: UserDTO) => {
        this.currentUser = updatedUser;
        this.updateSuccess = true;
        this.userForm.markAsPristine();
        this.userForm.markAsUntouched();
        setTimeout(() => this.updateSuccess = false, 3000);
      },
      error: (err) => {
        console.error('Failed to update user profile', err);
        this.passwordErrorMessage = 'Errore durante il cambio password.';
      }
    });
  }

  onChangePassword(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) {
      this.passwordErrorMessage = 'Compila correttamente tutti i campi della password.';
      return;
    }

    this.passwordChangeSuccess = false;
    this.passwordErrorMessage = null;

    const passwordUpdate: UserPasswordUpdateDTO = {
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.usersService.changePassword(passwordUpdate).subscribe({
      next: () => {
        this.passwordChangeSuccess = true;
        this.passwordForm.reset();
        setTimeout(() => this.passwordChangeSuccess = false, 3000);
      },
      error: (err) => {
        console.error('Failed to change password', err);
        this.passwordErrorMessage = 'Errore durante il cambio password.';
      }
    });
  }

  passwordStrengthValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
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

  passwordMatchValidator(form: AbstractControl) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : {mismatch: true};
  }

  isFieldInvalid(formGroup: FormGroup, field: string) {
    const formField = formGroup.get(field);
    return !!(formField?.invalid && (formField?.touched || formField?.dirty));
  }

  get passwordFormControl() {
    return this.passwordForm.controls;
  }

  goBack() {
    window.history.back();
  }

  togglePasswordVisibility(field: 'old' | 'new' | 'confirmNew'): void {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmNew') {
      this.showConfirmNewPassword = !this.showConfirmNewPassword;
    }
  }
}
