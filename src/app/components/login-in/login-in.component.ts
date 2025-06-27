  import { Component, OnInit } from '@angular/core';
  import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
  import { LogInService } from '../../services/log-in.service';
  import { CustomValidationService } from '../../services/custom-validation.service';
  import { Router } from '@angular/router';
  import {CommonModule} from '@angular/common';
  import {ToastrModule, ToastrService} from 'ngx-toastr';
  import {ApiResponse} from '../../models/api-response';
  import {AuthenticationResponse} from '../../models/authentication-response';


  @Component({
    selector: 'app-login-in',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, ToastrModule],
    templateUrl: './login-in.component.html',
    styleUrls: ['./login-in.component.scss']
  })
  export class LoginInComponent implements OnInit {
    loginForm!: FormGroup;
    isLoading = false;

    constructor(
      private fb: FormBuilder,
      private loginService: LogInService,
      private router: Router,
      private customValidator: CustomValidationService,
      private toastr: ToastrService,

    ) {}

    ngOnInit(): void {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required]]
      }, {
        validators: this.customValidator.passwordMatchValidator('password', 'confirmPassword')
      });
    }

    onSubmit(): void {
      if (this.loginForm.invalid) return;
      const { username, password } = this.loginForm.value;
      this.isLoading = true;
      this.loginService.login({ username, password }).subscribe({
        next: (response: ApiResponse<AuthenticationResponse>) => {
          if (response.result?.token) {
            this.loginService.setToken(response.result.token);
            this.toastr.success('Đăng nhập thành công', 'Thông báo', {timeOut : 2000});
            setTimeout(() => {
              this.router.navigate([''], { replaceUrl: true });
            }, 2500);

          }
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Đăng nhập thất bại, vui lòng thử lại';
          this.toastr.error(errorMessage, 'thất bại', {timeOut: 2000});
        },
        complete: () => this.isLoading = false
      });
    }


    get username() {
      return this.loginForm.get('username');
    }

    get password() {
      return this.loginForm.get('password');
    }

    get confirmPassword() {
      return this.loginForm.get('confirmPassword');
    }
  }
