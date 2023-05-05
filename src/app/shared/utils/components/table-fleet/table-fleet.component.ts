import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { ColumnSort, FleetManager } from 'src/app/components/domain/bus-firenze-domain';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';

@Component({
  selector: 'app-table-fleet',
  templateUrl: './table-fleet.component.html',
  styles: [`
  table { width: 100%;}
  @media(min-width: 1180px) {
    .mat-column-id { max-width: 20%}
    .mat-column-name { max-width: 20%;}
    .mat-column-surname { max-width: 20%;}
    .mat-column-e-mail { max-width: 20%}
    .mat-column-actions { max-width: 20%; display: table-column;}
  }
  `
  ]
})
export class TableFleetComponent implements OnInit {
  @Output() public callManageTicket = new EventEmitter<number>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource = new MatTableDataSource<FleetManager>();
  public fleetManagerList: FleetManager[] = [];
  public fleetanagersConnect: Observable<FleetManager[]>;
  public complete = true;
  public search: FormGroup;

  private endTable = false;

  private columnOrder: ColumnSort = { active: 'id', direction: 1 };
  private offset = 0;
  private limit = 10;
  private subscription: Subscription[] = [];

  constructor(
    private fleetManagerService: FleetManagerService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
    });
    this.callGetFleetManager();
  }

  public manageTicket(fleetManagerId: number): void {
    this.callManageTicket.emit(fleetManagerId);
  }

  public callGetFleetManager(): void {
    const search = this.search.get('ctrlSearch').value;
    this.complete = false;
    const currentSize = this.offset * this.limit;
    this.subscription.push(
      this.fleetManagerService.searchFleetManager(
        search,
        true,
        this.offset,
        this.limit,
        this.columnOrder)
        .subscribe({
          next: (data) => {
            this.fleetManagerList.length = currentSize;
            this.fleetManagerList = this.fleetManagerList.concat(data);
            if (data.length < this.limit) {
              this.paginator.length = this.fleetManagerList.length;
              this.endTable = true;
            } else {
              this.paginator.length = ((this.offset + 1) * this.limit) + 1;
            }
            this.dataSource.data = data;
            this.fleetanagersConnect = this.dataSource.connect();
          },
          error: () => this.complete = true,
          complete: () => { this.complete = true; this.unSubscribe(); }
        })
    );
  }

  public pageChanged(event: PageEvent): void {
    this.offset = event.pageIndex;
    this.limit = event.pageSize;
    const currentSize = this.offset * this.limit;
    const nextSize = (this.offset + 1) * this.limit; // dimensione pagina successiva
    // se fleetManagerList ha già i dati o l'utente è arrivato alla fine della tabella non chiama l'API
    if (nextSize <= this.fleetManagerList.length || this.endTable) {
      this.dataSource.data = this.fleetManagerList.slice(currentSize, nextSize);
      if (this.endTable) {
        // se è arrivato alla fine lascia la length della tabella completa
        this.paginator.length = this.fleetManagerList.length;
      } else {
        this.paginator.length = this.fleetManagerList.length + 1;
      }
    } else {
      this.callGetFleetManager();
    }
  }

  public sortData(event: { active: string; direction: string }): void {
    this.columnOrder.active = event.active;
    this.columnOrder.direction = event.direction === 'asc' ? 1 : -1;
    this.refreshTable();
  }

  public refreshTable(): void {
    this.reset();
    this.callGetFleetManager();
  }

  private reset(): void {
    this.paginator.pageIndex = 0;
    this.paginator.length = 0;
    this.fleetManagerList = [];
    this.dataSource.data = [];
    this.endTable = false;
    this.offset = 0;
    this.limit = this.paginator.pageSize;
  }

  private unSubscribe(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
