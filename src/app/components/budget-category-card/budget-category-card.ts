import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { BudgetsService } from '../../services/budgets/budgets';
import { IBudgetsCategory } from '../../models/interfaces';

@Component({
  selector: 'app-budget-category-card',
  imports: [CommonModule, ProgressBarModule],
  templateUrl: './budget-category-card.html',
  styleUrl: './budget-category-card.scss',
})
export class BudgetCategoryCard {
  // budgetCardData = input<IBudgetsCategory[]>([]);
  @Input() budgetCardData!: IBudgetsCategory;
  @Input() amountBudgeted!: number;
  @Input() totalAmountSpent!: number;
  @Input() budgetCategory!: string;
  @Input() overBudgetWarningMessage!: number | undefined;
  @Input() percentageBudgetSpent!: number;
  @Input() strokeColor!: string;
  @Output() updateBudgetEmitter = new EventEmitter<IBudgetsCategory>();
  @Output() deleteBudgetEmitter = new EventEmitter<IBudgetsCategory>();

  updateCategory(cardData: IBudgetsCategory) {
    this.updateBudgetEmitter.emit(cardData);
  }

  deleteCategory(catergory: IBudgetsCategory) {
    this.deleteBudgetEmitter.emit(catergory);
  }
}
