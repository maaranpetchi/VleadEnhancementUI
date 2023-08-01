
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/Services/EmployeeController/Core/core.service';
import { EmployeeService } from 'src/app/Services/EmployeeController/employee.service';
import { json } from 'stream/consumers';
import { AddEditEmployeecontrollerComponent } from '../add-edit-employeecontroller/add-edit-employeecontroller.component';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Output } from '@angular/core';
import { EditService } from 'src/app/Services/Displayorhideform/edit-service.service';
import { environment } from 'src/Environments/environment';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';
import { LoginService } from 'src/app/Services/Login/login.service';
import { EditaddemployeecontrollerComponent } from '../../editaddemployeecontroller/editaddemployeecontroller.component';
@Component({
  selector: 'app-employeecontroller',
  templateUrl: './employeecontroller.component.html',
  styleUrls: ['./employeecontroller.component.scss']
})
export class EmployeecontrollerComponent implements OnInit {
  

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isDeletedInclude = false;
  isResignInclude = false;

  constructor(private _dialog: MatDialog,
    private router: Router,
    private editService: EditService,
    private _empService: EmployeeService,
    private loginservice:LoginService,
    private _coreService: CoreService,
    private http: HttpClient,
    private spinnerService:SpinnerService) { }


  ngOnInit(): void {
    this.fetchtableData();
  }





  openEditForm(id: number) {

    this.http.get<any[]>(environment.apiURL + `Employee/GetEmployeeDetailsByID?employeeID=${id}`).subscribe(results => {
      this._empService.setData(results);
      this.router.navigate(['/topnavbar/Emp-editaddEmpcontroller']);
    });
    
  }

  deleteEmployee(id: number) {
    this.spinnerService.requestStarted();

    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        this.spinnerService.requestEnded();

        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.fetchtableData();
      },
      error: console.log,
    });
  }




  ///////////////////
  apiResponseData: any;

  
  displayedColumns: string[] = [
    'employeeCode',
    'employeeName',
    'departmentId',
    'designationId',
    'profiencyId',
    'reportingManager1',
    'reportLeader1',
    'action',
  ];

  fetchtableData() {
    this.spinnerService.requestStarted();
    this._empService.getEmployeeList().subscribe({

      next: (res) => {
        this.spinnerService.requestEnded();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      },
      error: console.log,
    });
  }


  employeeFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddEditEmployee() {
    this.router.navigate(['/topnavbar/Emp-editaddEmpcontroller']);
  }


  onCheckboxChange(event, id: number) {
    if (id == 1) {
      this.isDeletedInclude = event.checked;
    }
    else {
      this.isResignInclude = event.checked;
    }
    if (this.isDeletedInclude || this.isResignInclude) {
      this.http.get<any[]>(environment.apiURL+`Employee/GetEmployeeWithDelete?IsDeleted=${this.isDeletedInclude ? 1 : 0}&IsResigned=${this.isResignInclude ? 1 : 0}`).subscribe(data => {
        this.dataSource.data = data;
      });
    } else {
      this.fetchtableData();
    }
  }

  }