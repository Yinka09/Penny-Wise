import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-section',
  imports: [],
  templateUrl: './grid-section.html',
  styleUrl: './grid-section.scss',
})
export class GridSection {
  @Input() title: string = '';
  @Input() showPhotoGrid = false;
  featuresArray = [
    {
      id: 1,
      title: 'Intitutive Budgeting',
      description:
        'Create and manage budgets effortlessly to stay on track with your spending and savings goals.',
      icon: 'fa-book',
    },
    {
      id: 2,
      title: 'Smart Expense Tracking',
      description:
        'Automatically categorize transactions and get real-time updates on where your money goes.',
      icon: 'fa-money-bill-wave',
    },
    {
      id: 3,
      title: 'Detailed Financial Reports',
      description:
        'Visualize your financial health with easy to understand charts and graphs.',
      icon: 'fa-chart-simple',
    },
    {
      id: 4,
      title: 'Bills Reminders',
      description:
        'Never miss a payment again with customizable alerts and reminders for all your bills.',
      icon: 'fa-bell',
    },
    {
      id: 5,
      title: 'Secure Data Sync',
      description:
        'Keep your financial data safe and accessible across all your devices with secure protection.',
      icon: 'fa-lock',
    },
    {
      id: 6,
      title: 'Savings Goal Management',
      description:
        'Set achievable savings goals and track your progress daily to reach them faster.',
      icon: 'fa-piggy-bank',
    },
  ];

  photoArray = [
    {
      id: 1,
      title: 'Budget Overview',
      imgSrc: 'landing-page/budget-overview.png',
    },
    {
      id: 2,
      title: 'Expense Tracking',
      imgSrc: 'landing-page/expense-analytics.png',
    },
    {
      id: 3,
      title: 'Spending Report',
      imgSrc: 'landing-page/spending-reports.png',
    },
    {
      id: 4,
      title: 'Savings Goals',
      imgSrc: 'landing-page/saving-goals.png',
    },
    {
      id: 5,
      title: 'Bill Management',
      imgSrc: 'landing-page/bill-management.png',
    },
    {
      id: 6,
      title: 'Account Transactions',
      imgSrc: 'landing-page/account-transactions.png',
    },
  ];
}
