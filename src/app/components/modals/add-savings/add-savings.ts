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
  ISavingsCategory,
  ITransactionCategory,
  type ISavings,
} from '../../../models/interfaces';
import { BudgetsService } from '../../../services/budgets/budgets';
import { last } from 'rxjs';
import { DashboardService } from '../../../services/dashboard/dashboard';
import { SavingsService } from '../../../services/savings/savings-service';

@Component({
  selector: 'app-add-savings',
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
    InputTextModule,
  ],
  templateUrl: './add-savings.html',
  styleUrl: './add-savings.scss',
})
export class AddSavings {
  displayUpdateTotalSavingsModal = input<boolean>(false);
  @Input() showAddSavingsModal: boolean = false;
  @Output() showAddSavingsModalChange = new EventEmitter<boolean>();
  @Input() selectedSavings: ISavings | undefined;

  isEditMode = input<boolean>(false);
  isViewMode = input<boolean>(false);
  isCreateMode = input<boolean>(true);
  // @Input() selectedSavings = {};
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  @Output() formDetails = new EventEmitter<ISavings>();
  formSubmitted = false;
  maxDate: Date | undefined;

  transactionType = [
    { name: 'Deposit', code: 'Deposit' },
    { name: 'Withdrawal', code: 'Withdrawal' },
  ];
  savingsGoals: { name: string; code: string }[] = [];
  savingsCategories: { name: string; code: string }[] = [];

  selectedCategory: ISavingsCategory | undefined;
  transactionDate: Date | undefined;
  addSavingsForm: FormGroup = new FormGroup({});
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private budgetService: BudgetsService,
    private dashboardService: DashboardService,
    private savingsService: SavingsService
  ) {}
  ngOnInit(): void {
    this.maxDate = new Date();
    this.savingsCategories = this.getAllSavingsCategories();
  }

  getAllSavingsCategories() {
    let categoriesArr: { name: string; code: string }[] = [];
    this.savingsService.allSavingsCategories().forEach((category) => {
      categoriesArr.push({ name: category.name, code: category.id.toString() });
    });
    return categoriesArr;
  }

  private initEmptyForm() {
    this.addSavingsForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(52)]],
      description: [null, [Validators.required]],
      targetAmount: [null, [Validators.required, Validators.min(0)]],
      amountSaved: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
      savingsCategory: [null, [Validators.required]],
      date: [null, Validators.required],
    });

    // const amountSavedControl = this.addSavingsForm.get('amountSaved');
    // amountSavedControl?.disable({ emitEvent: true });
  }

  private buildForm(savingsGoal: ISavings) {
    if (!this.addSavingsForm) {
      this.initEmptyForm();
    }
    this.addSavingsForm.patchValue(
      {
        ...savingsGoal,
        date: savingsGoal.date ? new Date(savingsGoal.date) : null,
        savingsCategory: savingsGoal.savingCategoryId
          ? savingsGoal.savingCategoryId.toString()
          : null,
      },
      { emitEvent: false }
    );
    this.addSavingsForm.get('amountSaved')?.disable();

    // const amountSavedControl = this.addSavingsForm.get('amountSaved');
    // amountSavedControl?.disable({ emitEvent: true });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const savingsGoal = this.selectedSavings;
    // console.log('This is selected budget', budget);

    if (savingsGoal) {
      this.buildForm(savingsGoal);
    } else {
      this.initEmptyForm();
    }

    if (this.isEditMode()) {
      this.addSavingsForm.enable({ emitEvent: false });
      this.addSavingsForm.get('amountSaved')?.disable();
    }
    // } else {
    //   this.addSavingsForm.disable({ emitEvent: false });
    //   this.addSavingsForm.get('amountSaved')?.disable();
    // }

    const savingCategoryControl = this.addSavingsForm.get('savingCategory');

    if (this.isCreateMode()) {
      this.addSavingsForm.enable({ emitEvent: false });
      this.addSavingsForm.get('amountSaved')?.disable();
    } else {
      savingCategoryControl?.disable({ emitEvent: false });
      this.addSavingsForm.get('amountSaved')?.disable();
    }
  }
  focusUsername() {
    setTimeout(() => {
      this.usernameInput?.nativeElement.focus();
    }, 0);
  }

  onSubmit() {
    // console.log('Submitting form', this.addSavingsForm.value);
    this.formSubmitted = true;
    if (this.addSavingsForm.valid) {
      const savingsId = this.selectedSavings?.id ?? this.generateSavingsId();

      const status = 'Behind';
      // const amountSaved = 0;

      const {
        title,
        description,
        date,
        targetAmount,
        savingsCategory,
        amountSaved,
      } = this.addSavingsForm.getRawValue();

      const payload = {
        id: savingsId,
        title,
        description,
        targetAmount,
        date,
        savingCategoryId: Number(savingsCategory),
        status,
        amountSaved,
      };

      console.log('Submitting form', payload);

      this.formDetails.emit(payload);

      setTimeout(() => {
        this.formSubmitted = false;
        this.selectedSavings = undefined;
        this.addSavingsForm.reset();

        this.showAddSavingsModalChange.emit(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isCreateMode()
            ? 'Savings submitted Successfully'
            : 'Budget Updated Successfully',
          life: 3000,
        });
      }, 1500);
    }
  }

  onCancel() {
    this.showAddSavingsModalChange.emit(false);
    this.addSavingsForm.reset();
  }

  isInvalid(controlName: string) {
    const control = this.addSavingsForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  setDialogHeader() {
    if (this.displayUpdateTotalSavingsModal()) {
      return 'Update Total Savings';
    }
    if ( this.isCreateMode()) {
      return 'Add New Savings Goal';
    } else if (this.isViewMode()) {
      return 'View Savings Goal';
    } else {
      return 'Update Savings ';
    }
  }

  generateSavingsId() {
    const data = this.savingsService.allSavingsData();
    const newId = data.length
      ? Math.max(...data.map((item) => item.id)) + 1
      : 1;
    return newId;
  }

  private getTotalBudgetedAmount() {
    return this.dashboardService.totalBalance();
  }
}
