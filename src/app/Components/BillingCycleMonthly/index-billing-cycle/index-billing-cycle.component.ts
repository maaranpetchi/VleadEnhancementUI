import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { SpinnerService } from '../../Spinner/spinner.service';
import Swal from 'sweetalert2/src/sweetalert2.js'
import { EmployeevsskillsetService } from 'src/app/Services/EmployeeVsSkillset/employeevsskillset.service';
import { catchError } from 'rxjs';
import { UpdateBillingComponent } from '../update-billing/update-billing.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-index-billing-cycle',
  templateUrl: './index-billing-cycle.component.html',
  styleUrls: ['./index-billing-cycle.component.scss']
})
export class IndexBillingCycleComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['customer', 'department', 'billingdate','Action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, private router: Router, private spinnerService: SpinnerService, private _dialog: MatDialog,private _empService: EmployeevsskillsetService) { }

  ngOnInit(): void {
    this.getFetchTables();
  }
  getFetchTables() {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `BillingCycleMonthly/getdata`).subscribe({
      next: (employees) => {
        this.spinnerService.requestEnded();
        this.dataSource = new MatTableDataSource(employees);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  employeeFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(UpdateBillingComponent, {
      height: '50vh',
      width: '50vw',
      data: {
        type: "edit",
        data: data,
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        console.log(val,"AfterClose");
        
        if (val == undefined) {
          this.getFetchTables();
        }
      },
    });
  }

  // openEditForm(id: number) {
  //   this.spinnerService.requestStarted();
  //   this.http.get<any>(environment.apiURL + `BillingCycleMonthly/getdata?clientId=${id}`).pipe(catchError((error) => {
  //     this.spinnerService.requestEnded();
  //     return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
  //   })).subscribe({
  //     next: (results) => {
  //       this.spinnerService.requestEnded();
  //       this._empService.setData({ type: 'EDIT', data: results });
  //       this._empService.shouldFetchData = true;
  //       this.router.navigate(['/topnavbar/updateskillset']);
  //     },
  //     error: (err) => {
  //       this.spinnerService.resetSpinner(); // Reset spinner on error
  //       console.error(err);
  //       Swal.fire(
  //         'Error!',
  //         'An error occurred !.',
  //         'error'
  //       );
  //     }
  //   });

  // }



  deleteEmployee(id: number) {
    this.spinnerService.requestStarted();
    let payload={
      "customerId": 0,
      "departmentId": 0,
      "billingDate": "2023-12-26T09:08:42.047Z",
      "createdBy": 0,
      "updateBy": 0
    }
    this.http.put(environment.apiURL + `BillingCycleMonthly/Delete?id=${id}`,payload).pipe(catchError((error) => {
      this.spinnerService.requestEnded();
      return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
    })).subscribe({
      next: (res) => {
        this.spinnerService.requestEnded();
        Swal.fire(
          'Deleted!',
          'Data deleted successfully!',
          'success'
        ).then((response) => {
          if (response.isConfirmed) {
            this.getFetchTables();
          }
        })
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

  OpenNewForm() {
    this.router.navigate(['/topnavbar/addeditBilling']);
  }
}