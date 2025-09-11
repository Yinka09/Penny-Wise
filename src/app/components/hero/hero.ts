import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  @Input() title: string = '';
  @Input() bgColor: string = '';
  @Input() textSizeArray: string[] = [];
  @Input() description: string = '';
  @Input() showButton: boolean = false;
  @Input() imgSrc: string = '';
  listArray = [
    'Achieve Savings Goals Faster',
    'Reduce Unnecessary Spending',
    'Gain Financial Clarity & Control',
    'Make Smarter Investment Decisions',
  ];
}
