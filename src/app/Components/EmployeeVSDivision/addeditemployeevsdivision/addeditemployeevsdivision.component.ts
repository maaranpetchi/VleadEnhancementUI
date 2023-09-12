import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { log } from 'console';
import { environment } from 'src/Environments/environment';
import { SpinnerService } from '../../Spinner/spinner.service';
import Swal from 'sweetalert2/src/sweetalert2.js'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-addeditemployeevsdivision',

  templateUrl: './addeditemployeevsdivision.component.html',
  styleUrls: ['./addeditemployeevsdivision.component.scss']
})
export class AddeditemployeevsdivisionComponent implements OnInit {
  displayedColumns = ['employeeCode', 'employeeCodeName', 'selected'];
  table1Data: MatTableDataSource<any>;

  table2Data: MatTableDataSource<any>;

  dialogRef: MatDialogRef<AddeditemployeevsdivisionComponent>;
  myForm: FormGroup;
  // table1Data: any;
  // table2Data: any;

  table1selectedarray: any[] = [];
  table2selectedarray: any[] = [];


  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  constructor(private spinnerService: SpinnerService, private fb: FormBuilder, private http: HttpClient, private dialog: MatDialog) {

  }


  ngOnInit(): void {
    // this.myForm = this.fb.group({
    //   selectedValues: this.fb.array([])
    // });
    this.myForm = new FormGroup({ selectedValues: this.fb.array([]) });


    this.getTable1();
    this.getTable2();

  }


  getTable1() {
    this.spinnerService.requestStarted();

    this.http.get<any>(environment.apiURL + 'EmployeeVsDivision/GetEmployee').subscribe(data => {
      this.spinnerService.requestEnded();
      // this.table1Data =data.eEvDList ;
      this.table1Data = new MatTableDataSource(data.eEvDList);
      this.table1Data.data.forEach(row => {
        this.myForm.addControl(row.employeeId.toString(), new FormControl());
      });
      this.table1Data.paginator = this.paginator1;

    });
  }

  getTable2() {
    this.http.get<any>(environment.apiURL + 'EmployeeVsDivision/GetDivision').subscribe(data => {
      // this.table2Data = data.dEvDList;
      this.table2Data = new MatTableDataSource(data.dEvDList);
      this.table2Data.data.forEach(row => {
        this.myForm.addControl(row.id.toString() + "hi", new FormControl());
      });
      this.table2Data.paginator = this.paginator2;
    });
  }
  onSubmit() {
    console.log("setall",this.selection);
    this.selection.selected.forEach(x=>this.setAll2(x));
    this.spinnerService.requestStarted();
    if (this.table1selectedarray.length > 0 && this.table2selectedarray.length > 0) {
      const selectedValues = this.myForm.get('selectedValues')?.value
      const data = { selectedValues };
      console.log(this.myForm)
      console.log(this.table1selectedarray)
      console.log(this.table2selectedarray)


      // Submit the selected values to the REST API using HttpClient

      this.http.post<any>(environment.apiURL + 'EmployeeVsDivision/SetEmployeeVsDivision', {
        "selectedEmployee": this.table1selectedarray,
        "selectedDivision": this.table2selectedarray,
        "createdBy": 152,
      }).subscribe(response => {
        this.spinnerService.requestEnded();

        // Handle the response from the API
        this.table1selectedarray = [];
        this.table2selectedarray = [];


        if (response.sEvDList =="Inserted Sucessfully") {
          Swal.fire(
            'Done!',
            response.sEvDList,
            'success'
          )
          this.dialogRef.close();
        }

        else {
          Swal.fire(
            'Error!',
            response.sEvDList,
            'error'
          )
        }
      });
    }
    else {
      this.spinnerService.requestEnded();
    }
  }


  employeeFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.table1Data.filter = filterValue.trim().toLowerCase();
    if (this.table1Data.paginator) {
      this.table1Data.paginator.firstPage();
    }
  }


  setAll(completed: boolean, item: any) {
    if (completed == true) {
      this.table1selectedarray.push({ employeeId: item.employeeId, departmentId: item.departmentId })
    }
  }


  setAll2( item: any) {
      this.table2selectedarray.push({ id: item.id })
  }
  selection = new SelectionModel<Element>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.table2Data.data.length;
    return numSelected === numRows;
  }

  filterValue:any;
  
  masterToggle() {
    console.log("record 5",this.selection)
    if (this.isAllSelected()) {
      this.selection.clear();
    }
    else if(this.filterValue){
    this.selection.clear();
      this.table2Data.filteredData.forEach(x=>this.selection.select(x));
    } else {
      this.table2Data.data.forEach(row => this.selection.select(row));
    }
    console.log("record 6",this.selection.selected)
 
  }
}
