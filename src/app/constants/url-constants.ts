import { environment } from '../../environments/environment.development';
export const SIGNUP_BASE_URL =
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
  environment.API_KEY;

export const SIGNIN_BASE_URL =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  environment.API_KEY;
