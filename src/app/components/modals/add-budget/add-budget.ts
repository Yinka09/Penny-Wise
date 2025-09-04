import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit,
  input,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgModel,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { FluidModule } from 'primeng/fluid';
import { TextareaModule } from 'primeng/textarea';
import { Message } from 'primeng/message';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  IBudgetsCategory,
  type ITransactionCategory,
} from '../../../models/interfaces';
import { BudgetsService } from '../../../services/budgets/budgets';
import { last } from 'rxjs';
import { DashboardService } from '../../../services/dashboard/dashboard';

@Component({
  selector: 'app-add-budget',
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    DatePickerModule,
    FluidModule,
    InputNumber,
    TextareaModule,
    Toast,
  ],
  templateUrl: './add-budget.html',
  styleUrl: './add-budget.scss',
})
export class AddBudget implements OnInit, OnChanges {
  displayUpdateTotalBudgetModal = input<boolean>(false);
  @Input() showAddBudgetModal: boolean = false;
  @Output() showAddBudgetModalChange = new EventEmitter<boolean>();
  @Input() selectedBudget: IBudgetsCategory | undefined;
  // selectedBudget = input<IBudgetsCategory | undefined>(undefined);
  isEditMode = input<boolean>(false);
  isViewMode = input<boolean>(false);
  isCreateMode = input<boolean>(true);
  // @Input() selectedBudget = {};
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  @Output() formDetails = new EventEmitter<IBudgetsCategory>();
  formSubmitted = false;
  maxDate: Date | undefined;

  categories: ITransactionCategory[] = [
    { name: 'Family', code: 'Family' },
    { name: 'Food Stuffs', code: 'Food Stuffs' },
    { name: 'Toiletries', code: 'Toiletries' },
    { name: 'Rent', code: 'Rent' },
    { name: 'Restaurant & Dining', code: 'Restaurant & Dining' },
    { name: 'Bills & Subscriptions', code: 'Bills Subscriptions' },
    { name: 'Transportation', code: 'Transportation' },
    { name: 'Entertainment', code: 'Entertainment' },
    { name: 'Utilities', code: 'Utilities' },
    { name: 'Healthcare', code: 'Healthcare' },
    { name: 'Education', code: 'Education' },
    { name: 'Shopping', code: 'Shopping' },
    { name: 'Travel', code: 'Travel' },
    { name: 'Personal Care', code: 'Personal Care' },
    { name: 'Gifts & Donations', code: 'Gifts Donations' },
    { name: 'Loan', code: 'Loan' },
    { name: 'Miscellaneous', code: 'Miscellaneous' },
  ];
  transactionType: ITransactionCategory[] = [
    { name: 'Income', code: 'Income' },
    { name: 'Expense', code: 'Expense' },
  ];
  paymentMethod: ITransactionCategory[] = [
    { name: 'Cash', code: 'Cash' },
    { name: 'Bank Transfer', code: 'Bank transfer' },
    { name: 'Debit Card', code: 'Debit Card' },
    { name: 'Credit Card', code: 'Credit Card' },
    { name: 'Mobile Payment', code: 'Mobile Payment' },
  ];
  selectedCategory: ITransactionCategory | undefined;
  transactionDate: Date | undefined;
  addBudgetForm: FormGroup = new FormGroup({});
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private budgetService: BudgetsService,
    private dashboardService: DashboardService
  ) {}
  ngOnInit(): void {
    this.maxDate = new Date();
  }

  private initEmptyForm() {
    if (!this.displayUpdateTotalBudgetModal()) {
      this.addBudgetForm = this.fb.group({
        budgetCategory: [null, [Validators.required]],
        amountBudgeted: [null, [Validators.required, Validators.min(0)]],
        // amountSpent: [null, [Validators.required, Validators.min(0)]],
      });
    } else {
      this.addBudgetForm = this.fb.group({
        budgetCategory: ['Select Category', [Validators.required]],
        amountBudgeted: [
          this.getTotalBudgetedAmount(),
          [Validators.required, Validators.min(0)],
        ],
        // amountSpent: [null, [Validators.required, Validators.min(0)]],
      });
    }
  }

  private buildForm(budget: IBudgetsCategory) {
    if (!this.addBudgetForm) {
      this.initEmptyForm();
    }
    this.addBudgetForm.patchValue(budget, { emitEvent: false });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const budget = this.selectedBudget;
    // console.log('This is selected budget', budget);

    if (budget) {
      this.buildForm(budget);
    } else {
      this.initEmptyForm();
    }

    if (this.isEditMode()) {
      this.addBudgetForm.enable({ emitEvent: false });
    } else {
      this.addBudgetForm.disable({ emitEvent: false });
    }

    const budgetCategoryControl = this.addBudgetForm.get('budgetCategory');

    if (this.isCreateMode()) {
      this.addBudgetForm.enable({ emitEvent: false });
    } else {
      budgetCategoryControl?.disable({ emitEvent: false });
    }
  }
  focusUsername() {
    setTimeout(() => {
      this.usernameInput?.nativeElement.focus();
    }, 0);
  }

  onSubmit() {
    // console.log('Submitting form', this.addBudgetForm.value);
    this.formSubmitted = true;
    if (this.addBudgetForm.valid) {
      const budgetId = this.selectedBudget?.id ?? this.generateBudgetId();

      const { budgetCategory, amountBudgeted, amountSpent } =
        this.addBudgetForm.getRawValue();

      this.formDetails.emit({
        id: budgetId,
        budgetCategory,
        amountBudgeted,
        amountSpent,
      });

      // const allBudgets = this.budgetService.getBudgetCatagoriesWithAmount();

      // const currentTotalBudget = Object.values(allBudgets).reduce(
      //   (acc, curr) => acc + curr,
      //   0
      // );
      // const totalAmountBudgeted = this.dashboardService.totalBalance();
      // console.log({ currentTotalBudget });
      // console.log({ totalAmountBudgeted });

      setTimeout(() => {
        this.formSubmitted = false;
        this.selectedBudget = undefined;
        this.addBudgetForm.reset();

        this.showAddBudgetModalChange.emit(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isCreateMode()
            ? 'Budget submitted Successfully'
            : 'Budget Updated Successfully',
          life: 3000,
        });
      }, 1500);
    }
  }

  onCancel() {
    this.showAddBudgetModalChange.emit(false);
    this.addBudgetForm.reset();
  }

  isInvalid(controlName: string) {
    const control = this.addBudgetForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  setDialogHeader() {
    if (this.displayUpdateTotalBudgetModal()) {
      return 'Update Total Budget';
    }
    if (this.isEditMode() && this.isCreateMode()) {
      return 'Add New Budget';
    } else if (this.isViewMode()) {
      return 'View Budget';
    } else {
      return 'Update Budget';
    }
  }

  generateBudgetId() {
    let lastId = this.budgetService.getLastItemId(
      this.budgetService.allBudgetCategories()
    );
    const newId = lastId + 1;
    // for (let i = 0; i < 4; i++) {
    //   let randamString = Math.floor(Math.random() * 10);
    //   newId += randamString;
    // }
    return newId;
  }

  private getTotalBudgetedAmount() {
    return this.dashboardService.totalBalance();
  }
}
