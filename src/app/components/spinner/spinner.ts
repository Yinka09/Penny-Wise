import { Component } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  imports: [ProgressSpinner],
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.scss'],
})
export class SpinnerComponent {}
