import { Component, Inject, OnInit } from '@angular/core';
import { DriverVehicle } from 'src/app/components/domain/bus-firenze-domain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-association-drivers-vehicles',
  templateUrl: './association-drivers-vehicles.component.html',
  styles: []
})
export class AssociationDriversVehiclesComponent implements OnInit {
  public selectedElement: DriverVehicle[];
  public arrayForDB: DriverVehicle[];

  constructor(
    public dialogRef: MatDialogRef<AssociationDriversVehiclesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DriverVehicle[]
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  public saveAssociation(): void{
    this.arrayForDB = [];
    this.data.forEach(element => {
      if (!element.status){
        // verifica gli status false, se li trova nei selezionati allora imposta a true e aggiunge
        if (this.selectedElement.find(selectedElement => element.id === selectedElement.id)){
          element.status = true;
          this.arrayForDB.push(element);
        }
      }else{
        // verifica gli status true, se non li trova nei selezionati allora imposta a false e aggiunge
        if (!this.selectedElement.find(selectedElement => element.id === selectedElement.id)){
          element.status = false;
          this.arrayForDB.push(element);
        }
      }
    });
    console.log(this.arrayForDB);
    if (this.arrayForDB.length > 0){
      // servizio
      this.dialogRef.close();
    }else{
      this.dialogRef.close();
    }
  }

}
