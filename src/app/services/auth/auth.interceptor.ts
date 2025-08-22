import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth';
import { exhaustMap, take } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return authService.user.pipe(
    take(1),
    exhaustMap((user) => {
      if (!user) {
        return next(req);
      }

      const modifiedReq = req.clone({
        params: new HttpParams().set('auth', user.token ?? ''),
      });
      return next(modifiedReq);
    })
  );
};
