import { Injectable } from '@angular/core';
import { AuthResponseData, User } from '../../models/auth.model';
import {
  SIGNIN_BASE_URL,
  SIGNUP_BASE_URL,
  DELETEUSER_BASE_URL,
} from '../../constants/url-constants';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(SIGNUP_BASE_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(SIGNIN_BASE_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  deleteUser(idToken: string) {
    return this.http.post(DELETEUSER_BASE_URL, { idToken }).pipe(
      catchError(this.handleError),
      tap((resData) => {
        console.log(resData);

        // this.logout();
      })
    );
  }

  autoLogin() {
    const userDataString = sessionStorage.getItem('userData');
    if (!userDataString) {
      return;
    }
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(userDataString);

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);

    this.router.navigate(['/login']);
    sessionStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    // console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000 + 3 * 60 * 60 * 1000
    );
    // const expirationDate = new Date(new Date().getTime() + expiresIn * 1000); // Convert resData.expiresIn to milliseconds number. Add it to the current timestamp(JS time since creation in milliseconds). Then convert the result to a date object.
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    // this.autoLogout(expiresIn * 1000);
    this.autoLogout(expiresIn * 3 * 60 * 60 * 1000);
    sessionStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    // console.log(errorRes);
    let errorMessage = 'An unknown error occured';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;
      //   case 'EMAIL_NOT_FOUND':
      //   case 'INVALID_PASSWORD':
      //     errorMessage = 'Invalid Credentials!.';
      //     break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid Login Credentials!';
        break;

      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      case 'INVALID_ID_TOKEN':
        errorMessage =
          "The user's credential is no longer valid. The user must sign in again.";
        break;
      case 'USER_NOT_FOUND':
        errorMessage = 'User not found.';
        break;
    }
    return throwError(errorMessage);
  }
}
