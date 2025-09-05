import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { AuthService } from './services/auth/auth';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'penny-wise';
  constructor(private authService: AuthService) {
    this.authService.autoLogin();
  }
}
