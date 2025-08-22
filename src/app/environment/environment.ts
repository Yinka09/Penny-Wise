export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};

export const API_KEY = 'AIzaSyC9ubkYP_WXAwPjwJs2YFNFnhRHtt2MFyg';
export const SIGNUP_BASE_URL =
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + API_KEY;

export const SIGNIN_BASE_URL =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  API_KEY;
