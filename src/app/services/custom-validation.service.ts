import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {
  private apiUrl = 'http://your-backend-url/api/check-username'; // Thay bằng URL API thật

  constructor(private http: HttpClient) {}

  passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup): void => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return;
      }

      if (confirmPasswordControl.errors && !(confirmPasswordControl.errors['passwordMismatch'])) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }


}
