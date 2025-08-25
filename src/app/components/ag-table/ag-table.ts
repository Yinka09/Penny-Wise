import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  type SimpleChanges,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  DateFilterModule,
  PaginationModule,
  PaginationNumberFormatterParams,
  FirstDataRenderedEvent,
} from 'ag-grid-community';

import { environment } from '../../../environments/environment';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  PaginationModule,
  ...(!environment.production ? [ValidationModule] : []),
]);
import { ITransactionsTableData, ICustomers } from '../../models/interfaces';

@Component({
  selector: 'app-ag-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './ag-table.html',
  styleUrl: './ag-table.scss',
})
export class AgTableComponent implements OnInit, OnChanges {
  @Input() tableStyle?: string;
  @Input() rowHeight?: number;
  @Input() rowClass?: string;
  @Input() columnDefs?: ColDef[];
  @Input() defaultColDef?: ColDef;
  @Input() rowData?: ITransactionsTableData[] | ICustomers[];
  @Input() ActionMenuRendererComponent?: any;
  @Output() gridReady = new EventEmitter<GridReadyEvent>();

  @Output() actionSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() hotlistCustomer: EventEmitter<any> = new EventEmitter<any>();
  @Output() whitelistCustomer: EventEmitter<any> = new EventEmitter<any>();

  @Input() selectedCustomer: ICustomers | null = null;

  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [2, 5, 8, 10];

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.getTransactionTableDetails(this.rowData);
  }
  getTransactionTableDetails(item: any) {
    this.gridReady.emit(item);
  }

  paginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    // params.api.paginationGoToPage(4);
    params.api.paginationGoToPage(0);
  }

  onViewCustomer(rowData: any): void {
    // console.log('View customer:', rowData);
    this.actionSelected.emit(rowData);
  }

  onWhitelistCustomer(rowData: any): void {
    // console.log('Whitelist customer:', rowData);
    this.whitelistCustomer.emit(rowData);
  }
  onHotlistCustomer(rowData: any): void {
    // console.log('Hotlist customer:', rowData);
    this.hotlistCustomer.emit(rowData);
  }
}
