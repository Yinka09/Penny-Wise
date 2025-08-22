import { API_KEY } from '../../environments/environment';
export const SIGNUP_BASE_URL =
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + API_KEY;

export const SIGNIN_BASE_URL =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  API_KEY;
