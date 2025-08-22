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
  customerStatus: string = '';
  @Output() actionSelected: EventEmitter<any> = new EventEmitter<any>();
  agInit(params: ICellRendererParams): void {
    this.params = params;

    this.customerStatus = params.data.status;
  }
  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  checkCustomerStatus() {
    if (this.customerStatus === 'whitelist') {
      return true;
    } else {
      return false;
    }
  }

  onSelectCustomerAction() {
    this.actionSelected.emit(this.params.data);
  }

  onView() {
    if (this.params.context && this.params.context.componentParent) {
      this.params.context.componentParent.onViewCustomer(this.params.data);
    }
  }

  onWhitelistCustomer() {
    if (this.params.context && this.params.context.componentParent) {
      this.params.context.componentParent.onWhitelistCustomer(this.params.data);
    }
  }
  onHotlistCustomer() {
    if (this.params.context && this.params.context.componentParent) {
      this.params.context.componentParent.onHotlistCustomer(this.params.data);
    }
  }
}
