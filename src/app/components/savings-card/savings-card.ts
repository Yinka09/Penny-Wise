import { Component, Input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-savings-card',
  imports: [ProgressBarModule],
  templateUrl: './savings-card.html',
  styleUrl: './savings-card.scss',
})
export class SavingsCard {
  @Input() percentageBudgetSpent = 50;
  @Input() strokeColor = 'green';
}
