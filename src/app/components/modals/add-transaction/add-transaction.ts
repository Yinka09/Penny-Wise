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
  ITransactionCategory,
  ITransactionsTableData,
} from '../../../models/interfaces';

@Component({
  standalone: true,
  selector: 'app-add-transaction',
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
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.scss',
})
export class AddTransactionComponent implements OnInit, OnChanges {
  @Input() showAddTransactionModal: boolean = false;
  @Output() showAddTransactionModalChange = new EventEmitter<boolean>();
  @Input() selectedTransaction: ITransactionsTableData | undefined;
  // selectedTransaction = input<ITransactionsTableData | undefined>(undefined);
  isEditMode = input<boolean>(true);
  isViewMode = input<boolean>(false);
  isCreateMode = input<boolean>(true);
  // @Input() selectedTransaction = {};
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  @Output() formDetails = new EventEmitter<ITransactionsTableData>();
  formSubmitted = false;
  maxDate: Date | undefined;

  showExpenseCategories = false;
  showIncomeCategories = false;
  expenseCategories: ITransactionCategory[] = [
    { name: 'Rent', code: 'Rent' },
    { name: 'Transportation', code: 'Transportation' },
    { name: 'Salary Payment', code: 'Salary Payment' },
    { name: 'Family', code: 'Family' },
    { name: 'Food Stuffs', code: 'Food Stuffs' },
    { name: 'Bills & Subscriptions', code: 'Bills Subscriptions' },

    { name: 'Toiletries', code: 'Toiletries' },
    { name: 'Restaurant & Dining', code: 'Restaurant & Dining' },

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
  incomeCategories: ITransactionCategory[] = [
    { name: 'Income', code: 'Income' },
    { name: 'Salary Payment', code: 'Salary Payment' },
    { name: 'Family', code: 'Family' },
    { name: 'Rent', code: 'Rent' },
    { name: 'Gifts & Donations', code: 'Gifts Donations' },
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
  addTransactionForm: FormGroup = new FormGroup({});

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.maxDate = new Date();
  }

  private initEmptyForm() {
    this.addTransactionForm = this.fb.group({
      type: [null, Validators.required],
      category: [null, Validators.required],
      date: [null, Validators.required],
      amount: [null, Validators.required],
      paymentMethod: [null, Validators.required],
      description: ['', Validators.required],
    });
  }

  private buildForm(txn: ITransactionsTableData) {
    if (!this.addTransactionForm) {
      this.initEmptyForm();
    }
    // this.addTransactionForm.patchValue(txn, { emitEvent: false });
    this.addTransactionForm.patchValue(
      {
        ...txn,
        date: txn.date ? new Date(txn.date) : null,
      },
      { emitEvent: false }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const txn = this.selectedTransaction;
    // console.log('This is selected transaction', txn);

    if (txn) {
      this.buildForm(txn);
    } else {
      this.initEmptyForm();
    }

    if (this.isEditMode()) {
      this.addTransactionForm.enable({ emitEvent: false });
    } else {
      this.addTransactionForm.disable({ emitEvent: false });
    }
  }
  focusUsername() {
    setTimeout(() => {
      this.usernameInput?.nativeElement.focus();
    }, 0);
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.addTransactionForm.valid) {
      const transactionId =
        this.selectedTransaction?.transactionId ?? this.generateTransactionId();

      const { type, category, date, amount, paymentMethod, description } =
        this.addTransactionForm.value;

      const payload = {
        transactionId,
        type,
        category,
        date,
        amount,
        paymentMethod,
        description,
      };

      // console.log('Submitting form', payload);

      this.formDetails.emit(payload);
      // this.formDetails.emit({
      //   transactionId,
      //   type,
      //   category,
      //   date: formattedDate,
      //   amount,
      //   paymentMethod,
      //   description,
      // });

      setTimeout(() => {
        this.formSubmitted = false;

        this.showIncomeCategories = false;
        this.showExpenseCategories = false;
        this.addTransactionForm.reset();
        this.showAddTransactionModalChange.emit(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail:
            this.isEditMode() && this.isCreateMode()
              ? 'Transaction submitted Successfully'
              : 'Transaction Updated Successfully',
          life: 3000,
        });
      }, 1500);
    }
  }

  onCancel() {
    this.showAddTransactionModalChange.emit(false);
    this.addTransactionForm.reset();
  }

  isInvalid(controlName: string) {
    const control = this.addTransactionForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  setDialogHeader() {
    if (this.isEditMode() && this.isCreateMode()) {
      return 'Add New Transaction';
    } else if (this.isViewMode()) {
      return 'View Transaction';
    } else {
      return 'Update Transaction';
    }
  }

  onChangeTransactionType(event: any) {
    // console.log('Selected transaction type', event.value);
    if (event.value === 'Income') {
      this.showIncomeCategories = true;
      this.showExpenseCategories = false;
    } else {
      this.showExpenseCategories = true;
      this.showIncomeCategories = false;
    }
  }

  onCloseModal(event: any) {
    this.showAddTransactionModalChange.emit(event);
    this.showExpenseCategories = false;
    this.showIncomeCategories = false;
    // this.addTransactionForm.reset();
  }
  generateTransactionId() {
    let newNum = '';
    const constantText = 'TNX-';
    for (let i = 0; i < 4; i++) {
      let randamString = Math.floor(Math.random() * 10);
      newNum += randamString;
    }
    return constantText + newNum;
  }
}
