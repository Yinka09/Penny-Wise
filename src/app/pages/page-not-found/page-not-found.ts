import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-page-not-found',
  imports: [LottieComponent],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss',
})
export class PageNotFoundComponent {
  options: AnimationOptions = {
    path: 'page-not-found/page-not-found2.json',
  };
}
