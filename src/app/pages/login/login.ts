import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { Ripple } from 'primeng/ripple';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    Toast,
    ButtonModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [MessageService],
})
export class Login implements OnInit, OnDestroy {
  isLoading = false;
  error: string = '';

  viewPassword: boolean = false;

  destroy$ = new Subject<void>();
  loginForm: FormGroup = new FormGroup({});
  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
        },
      ],
      password: [
        '',
        {
          validators: [Validators.required, Validators.minLength(6)],
        },
      ],
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // console.log('Form submitted with payload:', { email, password });
    this.isLoading = true;
    this.authService
      .login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resData) => {
          // console.log(resData);
          sessionStorage.setItem('userInitials', resData.email);
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login Successful',
          });
          this.loginForm.reset();
          setTimeout(() => {
            this.router.navigate(['/main/dashboard']);
          }, 1000);
        },
        (errorMessage) => {
          // console.log(errorMessage);
          this.error = errorMessage;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
          });
          // this.showErrorAlert(errorMessage);
          this.isLoading = false;
        }
      );
  }

  togglePasswordVisibility() {
    this.viewPassword = !this.viewPassword;
  }

  get isEmailInvalid() {
    return (
      ((this.loginForm.get('email')?.dirty ||
        this.loginForm.get('email')?.touched) &&
        this.loginForm.get('email')?.hasError('required')) ||
      this.loginForm.get('email')?.hasError('email')
    );
  }
  get isPasswordInvalid() {
    return (
      ((this.loginForm.get('password')?.dirty ||
        this.loginForm.get('password')?.touched) &&
        this.loginForm.get('password')?.hasError('required')) ||
      this.loginForm.get('password')?.hasError('minlength')
    );
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Message Content',
    });
  }

  onHandleError() {
    this.error = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
