import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../../../services/main/main';
import { ToastModule } from 'primeng/toast';
import {
  Subject,
  takeUntil,
  Subscription,
  tap,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ICardData } from '../../../models/interfaces';
import { CardDetails } from '../../../models/mock-data';
import { CardComponent } from '../../../components/card/card';
import { AgChartComponent } from '../../../components/ag-chart/ag-chart';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [ToastModule, CommonModule, CardComponent, AgChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [MessageService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  cardData: any = [];

  monthName = new Date().toLocaleString('default', { month: 'long' });
  year = new Date().getFullYear();

  allSubscription: Subscription[] = [];

  private destroy$ = new Subject<void>();
  constructor(
    private mainService: MainService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.mainService.setHeaderTitle('Dashboard');
    this.cardData = CardDetails;
  }

  getData() {
    return [
      { expense: 'Food', amount: 60000 },
      { expense: 'Clothing', amount: 40000 },
      { expense: 'Rent', amount: 7000 },
      { expense: 'Groceries', amount: 5000 },
      { expense: 'Donations', amount: 3000 },
      { expense: 'Miscellaneous', amount: 3000 },
    ];
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
