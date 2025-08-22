import { ICardData } from './interfaces';
export const CardDetails: ICardData[] = [
  {
    title: 'Total Balance',
    amount: 120000,
    description: 'Total balance for',
    icon: 'fa-piggy-bank',
    iconBg: '#E1BFF399',
    percentage: 100,
  },
  {
    title: 'Total Income',
    amount: 500000,
    description: 'Total income for',
    icon: 'fa-hand-holding-dollar',
    iconBg: '#048E3B1A',
    percentage: 41.7,
  },
  {
    title: 'Total Expenses',
    amount: 400000,
    description: 'Total expenses for ',
    icon: 'fa-money-bill-transfer',
    iconBg: '#DFA2261A',
    percentage: 33.3,
  },

  {
    title: 'Top Expenses',
    amount: 800000000000000,
    description: 'Top expenses for',
    icon: 'fa-money-bill-trend-up',
    iconBg: '#E113131A',
    percentage: 25,
  },
];

export interface IChartData {
  expense: string;
  amount: number;
}
