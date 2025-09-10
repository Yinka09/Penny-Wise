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
  computed,
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
  ITransactionCategory,
  ITransactionsTableData,
  type ISavingsTableData,
} from '../../../models/interfaces';
import { SavingsService } from '../../../services/savings/savings-service';

@Component({
  selector: 'app-add-savings-history',
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
  templateUrl: './add-savings-history.html',
  styleUrl: './add-savings-history.scss',
})
export class AddSavingsHistory implements OnInit, OnChanges {
  @Input() showAddSavingsModal: boolean = false;
  @Output() showAddSavingsModalChange = new EventEmitter<boolean>();

  @Input() selectedSavings: ISavingsTableData | undefined;

  isEditMode = input<boolean>(true);
  isViewMode = input<boolean>(false);
  isCreateMode = input<boolean>(true);
  // @Input() selectedTransaction = {};
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  @Output() formDetails = new EventEmitter<ISavingsTableData>();
  formSubmitted = false;
  maxDate: Date | undefined;

  transactionType = computed(() => {
    return this.totalSavingsAmount() > 0
      ? [
          { name: 'Deposit', code: 'Deposit' },
          { name: 'Withdrawal', code: 'Withdrawal' },
        ]
      : [{ name: 'Deposit', code: 'Deposit' }];
  });
  savingsGoals: { name: string; code: string }[] = [];
  savingsCategories: { name: string; code: string }[] = [];

  // paymentMethod: ITransactionCategory[] = [
  //   { name: 'Cash', code: 'Cash' },
  //   { name: 'Bank Transfer', code: 'Bank transfer' },
  //   { name: 'Debit Card', code: 'Debit Card' },
  //   { name: 'Credit Card', code: 'Credit Card' },
  //   { name: 'Mobile Payment', code: 'Mobile Payment' },
  // ];

  transactionDate: Date | undefined;
  addSavingsHistoryForm: FormGroup = new FormGroup({});
  totalSavingsAmount = computed(() => {
    return this.savingsService.totalSavingsBalance();
  });
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private savingsService: SavingsService
  ) {}
  ngOnInit(): void {
    this.maxDate = new Date();
    this.savingsGoals = this.getAllSavingsGoals();
    this.savingsCategories = this.getAllSavingsCategories();

    // console.log('These are savings goals', this.savingsGoals);
    // console.log('These are savings categories', this.savingsCategories);
  }

  getAllSavingsGoals() {
    let goalsArr: { name: string; code: string }[] = [];
    this.savingsService.allSavingsData().forEach((goal) => {
      goalsArr.push({ name: goal.title, code: goal.id.toString() });
    });
    return goalsArr;
  }

  getAllSavingsCategories() {
    let categoriesArr: { name: string; code: string }[] = [];
    this.savingsService.allSavingsCategories().forEach((category) => {
      categoriesArr.push({ name: category.name, code: category.id.toString() });
    });
    return categoriesArr;
  }

  private initEmptyForm() {
    this.addSavingsHistoryForm = this.fb.group({
      type: [null, Validators.required],
      savingGoal: [null, Validators.required],
      date: [null, Validators.required],
      amount: [null, Validators.required],
      description: ['', Validators.required],
    });
  }

  private buildForm(txn: ISavingsTableData) {
    if (!this.addSavingsHistoryForm) {
      this.initEmptyForm();
    }
    // this.addSavingsHistoryForm.patchValue(txn, { emitEvent: false });
    this.addSavingsHistoryForm.patchValue(
      {
        ...txn,
        date: txn.date ? new Date(txn.date) : null,
        savingGoal: txn.savingsId ? txn.savingsId.toString() : null,
      },
      { emitEvent: false }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const txn = this.selectedSavings;
    // console.log('This is selected transaction', txn);

    if (txn) {
      this.buildForm(txn);
    } else {
      this.initEmptyForm();
    }

    if (this.isEditMode()) {
      this.addSavingsHistoryForm.enable({ emitEvent: false });
    } else {
      this.addSavingsHistoryForm.disable({ emitEvent: false });
    }
  }
  focusUsername() {
    setTimeout(() => {
      this.usernameInput?.nativeElement.focus();
    }, 0);
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.addSavingsHistoryForm.valid) {
      const id = this.selectedSavings?.id ?? this.generateSavingsId();
      const savingsGoal = this.savingsService.getSavingsGoalById(
        Number(this.addSavingsHistoryForm.value.savingGoal)
      );

      // console.log('This is saving category', savingsGoal);
      const { type, savingGoal, date, amount, description } =
        this.addSavingsHistoryForm.value;

      const payload = {
        id,
        type,
        savingCategoryId: savingsGoal?.savingCategoryId || 0,
        date,
        amount,
        savingsId: Number(savingGoal),
        description,
      };

      // console.log('Submitting form', payload);

      this.formDetails.emit(payload);

      setTimeout(() => {
        this.formSubmitted = false;

        this.addSavingsHistoryForm.reset();
        this.showAddSavingsModalChange.emit(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail:
            this.isEditMode() && this.isCreateMode()
              ? 'Savings submitted Successfully'
              : 'Savings Updated Successfully',
          life: 3000,
        });
      }, 1500);
    }
  }

  onCancel() {
    this.showAddSavingsModalChange.emit(false);
    this.addSavingsHistoryForm.reset();
  }

  isInvalid(controlName: string) {
    const control = this.addSavingsHistoryForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  setDialogHeader() {
    if (this.isEditMode() && this.isCreateMode()) {
      return 'Add New History';
    } else if (this.isViewMode()) {
      return 'View History';
    } else {
      return 'Update History';
    }
  }

  onChangeTransactionType(event: any) {
    // console.log('Selected transaction type', event.value);
    if (event.value === 'Income') {
      // this.showIncomeCategories = true;
      // this.showExpenseCategories = false;
    } else {
      // this.showExpenseCategories = true;
      // this.showIncomeCategories = false;
    }
  }

  onCloseModal(event: any) {
    this.showAddSavingsModalChange.emit(event);
    // this.showExpenseCategories = false;
    // this.showIncomeCategories = false;
    // this.addSavingsHistoryForm.reset();
  }

  generateSavingsId() {
    const data = this.savingsService.allSavingsData();
    const newId = data.length
      ? Math.max(...data.map((item) => item.id)) + 1
      : 1;
    return newId;
  }
}
