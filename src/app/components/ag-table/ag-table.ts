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
import {
  ITransactionsTableData,
  ICustomers,
  type ISavingsTableData,
} from '../../models/interfaces';

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

  @Input() title?: string;
  @Output() gridReady = new EventEmitter<GridReadyEvent>();

  @Output() actionSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() hotlistCustomer: EventEmitter<any> = new EventEmitter<any>();
  @Output() whitelistCustomer: EventEmitter<any> = new EventEmitter<any>();
  @Input() displayTableData!: ITransactionsTableData[] | ISavingsTableData[];

  selectedCustomer: ICustomers | null = null;

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.getTransactionTableDetails();
  }
  getTransactionTableDetails() {
    this.gridReady.emit();
  }
}
