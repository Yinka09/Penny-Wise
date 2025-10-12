import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  Input,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-grid-section',
  imports: [],
  templateUrl: './grid-section.html',
  styleUrl: './grid-section.scss',
  animations: [
    trigger('fadeInCard', [
      state('hidden', style({ opacity: 0, transform: 'translateY(100px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('600ms ease-out')),
    ]),
  ],
})
export class GridSection implements AfterViewInit {
  @Input() title: string = '';
  @Input() showPhotoGrid = false;

  @ViewChildren('featureCard') featureCards!: QueryList<ElementRef>;
  @ViewChildren('photoCard') photoCards!: QueryList<ElementRef>;

  cardStates: { [key: number]: 'hidden' | 'visible' } = {};
  photoCardStates: { [key: number]: 'hidden' | 'visible' } = {};

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

  ngAfterViewInit() {
    this.observeCards(this.featureCards, this.featuresArray, this.cardStates);
    this.observeCards(this.photoCards, this.photoArray, this.photoCardStates);
  }

  constructor() {
    this.featuresArray.forEach((item) => (this.cardStates[item.id] = 'hidden'));
    this.photoArray.forEach(
      (item) => (this.photoCardStates[item.id] = 'hidden')
    );
  }

  private observeCards(
    cards: QueryList<ElementRef>,
    dataArray: { id: number }[],
    states: Record<number, 'hidden' | 'visible'>
  ) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardIndex = cards
            .toArray()
            .findIndex((el) => el.nativeElement === entry.target);

          if (cardIndex === -1) return;

          const id = dataArray[cardIndex].id;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            states[id] = 'visible';
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.05) {
            states[id] = 'hidden';
          }
        });
      },
      {
        threshold: [0.05, 0.2, 0.4],
        rootMargin: '40px 0px -20px 0px',
      }
    );

    cards.forEach((card) => observer.observe(card.nativeElement));
  }
}
