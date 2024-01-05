import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { SpinnerService } from '../../Spinner/spinner.service';
import Swal from 'sweetalert2/src/sweetalert2.js'
import { EmployeevsskillsetService } from 'src/app/Services/EmployeeVsSkillset/employeevsskillset.service';
import { catchError } from 'rxjs';
@Component({
  selector: 'app-index-skillset',
  templateUrl: './index-skillset.component.html',
  styleUrls: ['./index-skillset.component.scss']
})
export class IndexSkillsetComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['EmployeeCode', 'EmployeeName', 'Skill', 'ProficiencyLevel', 'Action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  private isResizing = false;
  private startX: number;
  private startWidth: number;
  
  constructor(private http: HttpClient, private router: Router, private spinnerService: SpinnerService, private _empService: EmployeevsskillsetService,private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.getFetchTables();
  }
  getFetchTables() {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `EmployeeVsSkillset/ShowEmployeeVsSkillset`).subscribe({
      next: (employees) => {
        this.spinnerService.requestEnded();
        this.dataSource = new MatTableDataSource(employees.gEvSlist);
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


  onResizeStart(event: MouseEvent, column: string): void {
    this.isResizing = true;
    this.startX = event.pageX;
    const columnElement = this.el.nativeElement.querySelector(`th[mat-sort-header][matColumnDef="${column}"]`);
    this.startWidth = columnElement.clientWidth;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent): void => {
    if (this.isResizing) {
      const offset = event.pageX - this.startX;
      const newWidth = Math.max(this.startWidth + offset, 50); // Set a minimum width if needed

      // Update the width of the column
      const columnElement = this.el.nativeElement.querySelector(`th[mat-sort-header]`);
      this.renderer.setStyle(columnElement, 'width', `${newWidth}px`);
    }
  }

  onMouseUp = (): void => {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
  
  employeeFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //aCTIONS
  openEditForm(id: number) {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `EmployeeVsSkillset/GetEmployeeVsSkillsetbyId?id=${id}`).pipe(catchError((error) => {
      this.spinnerService.requestEnded();
      return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
    })).subscribe({
      next: (results) => {
        this.spinnerService.requestEnded();
        this._empService.setData({ type: 'EDIT', data: results });
        this._empService.shouldFetchData = true;
        this.router.navigate(['/topnavbar/updateskillset']);
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
  viewEmployee(id: number) {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `EmployeeVsSkillset/GetEmployeeVsSkillsetbyId?id=${id}`).pipe(catchError((error) => {
      this.spinnerService.requestEnded();
      return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
    })).subscribe({
      next: (results) => {
        this.spinnerService.requestEnded();

        this._empService.setData({ type: 'EDIT', data: results });
        this._empService.shouldFetchData = true;
        this.router.navigate(['/topnavbar/viewskillset']);
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
  deleteEmployee(id: number) {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `EmployeeVsSkillset/Delete-Skill?id=${id}`).pipe(catchError((error) => {
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
    this.router.navigate(['/topnavbar/addeditskillset']);
  }
}