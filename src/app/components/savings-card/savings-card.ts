import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { ISavings } from '../../models/interfaces';
import { SavingsService } from '../../services/savings/savings-service';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-savings-card',
  imports: [ProgressBarModule, CommonModule, CurrencyPipe],
  templateUrl: './savings-card.html',
  styleUrl: './savings-card.scss',
})
export class SavingsCard implements OnInit {
  @Input() percentageBudgetSpent = 50;
  @Input() strokeColor = 'green';
  @Input() data!: ISavings;
  @Output() updateSavingsEmitter = new EventEmitter<ISavings>();
  @Output() deleteSavingsEmitter = new EventEmitter<ISavings>();
  progressData = {};
  constructor(private savingsService: SavingsService) {}
  ngOnInit(): void {
    this.getProgressData();
  }

  getSavingsCategoryById(id: number) {
    return this.savingsService.getSavingsCategoryById(id);
  }

  getProgressData() {
    this.progressData = {
      percent: this.getProgressPercentage(this.data),
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: this.getStrokeColor(this.data),
      innerStrokeColor: this.getStrokeColor(this.data),
      animation: true,
      animationDuration: 2500,
    };
  }

  getStrokeColor(item: ISavings): string {
    const percentageSpent = this.getProgressPercentage(item);

    switch (true) {
      case percentageSpent <= 35:
        return '#FF0000';
      case percentageSpent <= 80:
        return '#78C000';
      case percentageSpent > 80:
        return '#00A63E';
      default:
        return '#78C000';
    }
  }

  getProgressText(item: ISavings) {
    const percentage = this.getProgressPercentage(item);
    switch (true) {
      case percentage <= 45:
        return { text: 'Behind', color: ['text-red-600', 'bg-red-100'] };
      case percentage <= 99:
        return { text: 'On Track', color: ['text-lime-700', 'bg-lime-200'] };
      case percentage === 100:
        return { text: 'Completed', color: ['text-green-700', 'bg-green-200'] };
      default:
        return { text: 'Ahead', color: ['text-green-700', 'bg-green-200'] };
    }
  }

  getProgressPercentage(item: ISavings): number {
    // const totalExpenses = this.dashboardService.getTotalExpenses();

    const perecentageBalance = Number(
      ((item.amountSaved / item.targetAmount) * 100).toFixed(1)
    );
    return perecentageBalance;
  }

  updateSavings(savings: ISavings) {
    this.updateSavingsEmitter.emit(savings);
  }

  deleteSavings(savings: ISavings) {
    this.deleteSavingsEmitter.emit(savings);
  }
}
