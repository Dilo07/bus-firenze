import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { CompleteFleetManager, FleetManager, Vehicle } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppointmentsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public appointmentList = new MatTableDataSource<CompleteFleetManager>([]);
  public displayedColumns: string[] = ['id', 'name', 'surname', 'mobile', 'companyName', 'city', 'address', 'size', 'button'];
  public hasAppointment: boolean;
  public CtrlDateSelection: Date;
  public vehicleSelected: Vehicle;
  public expandedElement: CompleteFleetManager | null;
  public complete = true;
  public minDate = moment(moment.now()).toDate();
  public onlyActive = true;
  private subscription: Subscription[] = [];

  constructor(private route: ActivatedRoute, private fleetService: FleetManagerService, private snackBar: SnackBar) {
    this.route.data.subscribe(data => {
      this.hasAppointment = data.hasAppointment;
    });
   }

  ngOnInit(): void {
    this.getAllData();
  }

  private getAllData(): void {
    this.complete = false;
    this.subscription.push(this.fleetService.getAppointmentList(this.hasAppointment, this.onlyActive).subscribe(
      (data) => {
        this.appointmentList.data = data;
        this.appointmentList.paginator = this.paginator;
      },
      () => this.complete = true,
      () => this.complete = true));
  }

  public expandedRow(element: CompleteFleetManager): void{
    // in caso di cambio veicolo resetta il form e svuota la selezione del radio button
    this.CtrlDateSelection = null;
    this.vehicleSelected = null;
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  public manageAppointment(): void {
    if (this.hasAppointment) {
      this.subscription.push(this.fleetService.removeAppointment(this.vehicleSelected.id).subscribe(
        () => {
          this.snackBar.showMessage('APPOINTMENT.REVOKE_SUCCESS', 'INFO');
          this.getAllData();
          this.expandedElement = null;
        },
        () => { this.snackBar.showMessage('APPOINTMENT.REVOKE_ERROR', 'ERROR'); }
      ));
    } else {
      const selectedDate = this.CtrlDateSelection;
      this.subscription.push(
        this.fleetService.addAppointment(this.vehicleSelected.id, moment(selectedDate).format('yyyy-MM-DDTHH:mm:ss.SSS')).subscribe(
        () => {
          this.snackBar.showMessage('APPOINTMENT.ADD_SUCCESS', 'INFO');
          this.getAllData();
          this.expandedElement = null;
        },
        () => { this.snackBar.showMessage('APPOINTMENT.ADD_ERROR', 'ERROR'); }
      ));
    }
  }

  public findContactValue(fleetManager: FleetManager, code: number): string {
    let res = '';
    fleetManager.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

  public reload(): void {
    this.expandedElement = null;
    this.vehicleSelected = null;
    this.CtrlDateSelection = null;
    this.getAllData();
  }

}
