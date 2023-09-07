
import { state } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { CustomerVSEmployeeService } from 'src/app/Services/CustomerVSEmployee/customer-vsemployee.service';
import { AddEditCustomerVSEmployeeComponent } from '../add-edit-customer-vsemployee/add-edit-customer-vsemployee.component';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';
import Swal from 'sweetalert2/src/sweetalert2.js'
@Component({
  selector: 'app-customer-vsemployee',
  templateUrl: './customer-vsemployee.component.html',
  styleUrls: ['./customer-vsemployee.component.scss']
})
export class CustomerVSEmployeeComponent implements OnInit {

  displayedColumns: string[] = [
    'customerClassification',
    'employeeNameCode',
    'name',
    'shortName',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isDeletedInclude = false;
  isResignInclude = false;


  constructor(private _dialog: MatDialog,
    private spinnerService: SpinnerService,
    private _empService: CustomerVSEmployeeService,
    private _coreService: CoreService,
    private router: Router,
    private http: HttpClient) { }


  ngOnInit(): void {
    this.getEmployeeList();
  }

  openAddEditEmpForm() {
    // this.state=1;
    const dialogRef = this._dialog.open(AddEditCustomerVSEmployeeComponent, {
      // height: '60vh',
      width: '50vw'
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
    // this.router.navigate(['/edit']);

  }

  getEmployeeList() {
    this.spinnerService.requestStarted();

    this._empService.getEmployeeList().subscribe({

      next: (res) => {
        this.spinnerService.requestEnded();

        this.dataSource = new MatTableDataSource(res);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      },
      error: (err) => {
        this.spinnerService.resetSpinner(); // Reset spinner on error
        console.error(err);
        Swal.fire(
          'Error!',
          'An error occurred !.',
          'error'
        );
      }
    });
  }
  // this._empService.getEmployeeList().then((res)=>{console.log(res)}).catch(err=> console.log(err));


  employeeFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    this.spinnerService.requestStarted();

    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        this.spinnerService.requestEnded();
        Swal.fire(
          'Done!',
          'Employee Deleted !',
          'success'
        ).then((result)=>{
          if(result.isConfirmed) {
            this.getEmployeeList();
          }
        }); 
   

      },
      error: (err) => {
        this.spinnerService.resetSpinner(); // Reset spinner on error
        console.error(err);
        Swal.fire(
          'Error!',
          'An error occurred !',
          'error'
        );
      }
    });
  }


  openEditForm(data: any) {
    console.log("datavalue" + data);

    const dialogRef = this._dialog.open(AddEditCustomerVSEmployeeComponent, {
      // height: '40vh',
      width: '50vw',
      data
    });

    console.log(dialogRef);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();

        }
      },
      error: (err) => {
        this.spinnerService.resetSpinner(); // Reset spinner on error
        console.error(err);
        Swal.fire(
          'Error!',
          'An error occurred !.',
          'error'
        );
      }
    });
  }

}
