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
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { Subject, takeUntil } from 'rxjs';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;
    if (val1 === val2) {
      return null;
    }
    return { valuesNotEqual: true };
  };
}

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [
    Toast,
    ButtonModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  providers: [MessageService],
})
export class Signup implements OnInit, OnDestroy {
  isLoading = false;
  error: string = '';

  viewPassword: boolean = false;
  viewConfirmPassword: boolean = false;

  destroy$ = new Subject<void>();
  signUpForm: FormGroup = new FormGroup({});
  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      fullName: ['', Validators.required],
      // middleName: ['', Validators.required],
      // lastName: ['', Validators.required],
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
        },
      ],
      // password: [
      //   '',
      //   {
      //     validators: [Validators.required, Validators.minLength(6)],
      //   },
      // ],
      // confirmPassword: [
      //   '',
      //   {
      //     validators: [Validators.required, Validators.minLength(6)],
      //   },
      // ],
      passwords: this.fb.group(
        {
          password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
          }),
          confirmPassword: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
          }),
        },
        {
          validators: [equalValues('password', 'confirmPassword')],
        }
      ),
    });
  }

  onSubmit() {
    if (!this.signUpForm.valid) {
      return;
    }

    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.passwords.password;

    // console.log('Form submitted with payload:', { email, password });
    this.isLoading = true;
    this.authService
      .signUp(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resData) => {
          // console.log(resData);
          localStorage.setItem('userInitials', resData.email);
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account created successfully',
          });
          setTimeout(() => {
            this.router.navigate(['./main/dashboard']);
          }, 1500);
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

    this.signUpForm.reset();
  }

  togglePasswordVisibility() {
    this.viewPassword = !this.viewPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.viewConfirmPassword = !this.viewConfirmPassword;
  }

  get isFullNameInvalid() {
    return (
      (this.signUpForm.get('fullName')?.dirty ||
        this.signUpForm.get('fullName')?.touched) &&
      this.signUpForm.get('fullName')?.hasError('required')
    );
  }
  // get isFirstNameInvalid() {
  //   return (
  //     (this.signUpForm.get('firstName')?.dirty ||
  //       this.signUpForm.get('firstName')?.touched) &&
  //     this.signUpForm.get('firstName')?.hasError('required')
  //   );
  // }
  // get isLastNameInvalid() {
  //   return (
  //     (this.signUpForm.get('lastName')?.dirty ||
  //       this.signUpForm.get('lastName')?.touched) &&
  //     this.signUpForm.get('lastName')?.hasError('required')
  //   );
  // }
  // get isMiddleNameInvalid() {
  //   return (
  //     (this.signUpForm.get('middleName')?.dirty ||
  //       this.signUpForm.get('middleName')?.touched) &&
  //     this.signUpForm.get('middleName')?.hasError('required')
  //   );
  // }

  get isEmailInvalid() {
    return (
      ((this.signUpForm.get('email')?.dirty ||
        this.signUpForm.get('email')?.touched) &&
        this.signUpForm.get('email')?.hasError('required')) ||
      this.signUpForm.get('email')?.hasError('email')
    );
  }
  get isPasswordInvalid() {
    const passwordControl = this.signUpForm.get('passwords.password');

    return (
      ((passwordControl?.dirty || passwordControl?.touched) &&
        passwordControl?.hasError('required')) ||
      passwordControl?.hasError('minlength')
    );
  }
  get isConfirmPasswordInvalid() {
    const passwordControl = this.signUpForm.get('passwords.confirmPassword');

    return (
      ((passwordControl?.dirty || passwordControl?.touched) &&
        passwordControl?.hasError('required')) ||
      passwordControl?.hasError('minlength')
    );
  }

  get isPasswordMismatch() {
    const passwordsGroup = this.signUpForm.get('passwords');
    return (
      passwordsGroup?.errors?.['valuesNotEqual'] &&
      (passwordsGroup.get('confirmPassword')?.dirty ||
        passwordsGroup.get('confirmPassword')?.touched)
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
