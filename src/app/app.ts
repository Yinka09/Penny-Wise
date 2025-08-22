import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './pages/main/main';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, MainComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'penny-wise';
}
