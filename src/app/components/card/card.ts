import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ICardData } from '../../models/interfaces';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  @Input() cardItem!: ICardData;
  monthName = new Date().toLocaleString('default', { month: 'long' });
  year = new Date().getFullYear();
  constructor() {}
  getCardStyles(item: ICardData) {
    const itemTitle = item.title;

    switch (itemTitle) {
      case 'Total Balance':
        return {
          icon: 'assets/dashboard/total.svg',
          iconBg: '#E1BFF399',
          color: '#521C78',
        };

      case 'Total Income':
        return {
          icon: 'assets/dashboard/successful.svg',
          iconBg: '#048E3B1A',
          color: '#048E3B',
        };

      case 'Total Expenses':
        return {
          icon: 'assets/dashboard/failed.svg',
          iconBg: '#E113131A',
          color: '#E11313',
        };
      case 'Top Category':
        return {
          icon: 'assets/dashboard/pending.svg',
          iconBg: '#DFA2261A',
          color: '#DFA226',
        };

      default:
        return {
          icon: 'assets/dashboard/task.svg',
          iconBg: 'green',
          color: 'grey',
        };
    }
  }

  trimText(value: any): string {
    return value.length > 10 ? value.substring(0, 10) + '...' : value;
  }
}
