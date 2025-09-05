import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-menu-renderer',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, CommonModule],
  templateUrl: './action-menu-renderer.component.html',
  styleUrl: './action-menu-renderer.component.scss',
})
export class ActionMenuRendererComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  transactionType: string = '';
  @Output() actionSelected: EventEmitter<any> = new EventEmitter<any>();
  agInit(params: ICellRendererParams): void {
    this.params = params;

    this.transactionType = params.data.type;
  }
  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  checkTransactionType() {
    return this.transactionType === 'Income' ? true : false;
  }

  onSelectCustomerAction() {
    this.actionSelected.emit(this.params.data);
  }

  onView() {
    if (this.params.context) {
      this.params.context.componentParent.onViewTransaction(this.params.data);
    }
  }

  onEdit() {
    if (this.params.context && this.params.context.componentParent) {
      this.params.context.componentParent.onEditTransaction(this.params.data);
    }
  }
  onAddToExpense(event: any, type: 'Income' | 'Expense') {
    if (this.params.context && this.params.context.componentParent) {
      this.params.context.componentParent.onUpdateTransactionType(
        this.params.data,
        event,
        type
      );
    }
  }
  // onAddToExpense(event: any, type: string) {
  //   if (this.params.context && this.params.context.componentParent) {
  //     this.params.context.componentParent.onAddTransactionToExpense(
  //       this.params.data,
  //       event,
  //       type
  //     );
  //   }
  // }
  onAddToIncome(event: any, type: string) {
    if (this.params.context && this.params.context.componentParent) {
      this.params.context.componentParent.onUpdateTransactionType(
        this.params.data,
        event,
        type
      );
    }
  }
  // onAddToIncome(event: any, type: string) {
  //   if (this.params.context && this.params.context.componentParent) {
  //     this.params.context.componentParent.onAddTransactionToIncome(
  //       this.params.data,
  //       event,
  //       type
  //     );
  //   }
  // }

  onDelete(event: any) {
    if (this.params.context && this.params.context.componentParent) {
      this.params.context.componentParent.onDeleteTransaction(
        this.params.data,
        event
      );
    }
  }
  // onWhitelistCustomer() {
  //   if (this.params.context && this.params.context.componentParent) {
  //     this.params.context.componentParent.onWhitelistCustomer(this.params.data);
  //   }
  // }
  // onHotlistCustomer() {
  //   if (this.params.context && this.params.context.componentParent) {
  //     this.params.context.componentParent.onHotlistCustomer(this.params.data);
  //   }
  // }
}
