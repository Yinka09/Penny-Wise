import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICardData } from '../../models/interfaces';
type MaskedKeys =
  | 'Total Budget'
  | 'Total Income'
  | 'Total Expenses'
  | 'Total Savings'
  | string;

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
  isMasked: Record<MaskedKeys, boolean> = {
    'Total Budget': true,
    'Total Income': true,
    'Total Expenses': true,
    'Total Savings': true,
  };

  constructor() {}
  getCardStyles(item: ICardData) {
    const itemTitle = item.title;

    switch (itemTitle) {
      case 'Total Budget':
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
      case 'Total Savings':
        return {
          icon: 'assets/dashboard/pending.svg',
          iconBg: '#F0F9FF',
          color: '#0078BD',
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
    return value.length > 20 ? value.substring(0, 10) + '...' : value;
  }

  toggleVisibility(item: MaskedKeys) {
    this.isMasked[item] = !this.isMasked[item];
  }

  showVisibleAmount(item: ICardData, title: MaskedKeys) {
    return this.isMasked[title] ? '*****' : this.valueFormatter(item.amount);
  }

  valueFormatter(value: number | null) {
    if (value !== null) {
      return this.trimText(
        new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
        }).format(value)
      );
    }
    return '';
  }
}
