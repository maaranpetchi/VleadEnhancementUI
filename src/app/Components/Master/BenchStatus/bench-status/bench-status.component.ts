import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BenchStatusService } from 'src/app/Services/Benchstatus/bench-status.service';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { LoginService } from 'src/app/Services/Login/login.service';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-bench-status',
  templateUrl: './bench-status.component.html',
  styleUrls: ['./bench-status.component.scss'],
})
export class BenchStatusComponent implements OnInit {
  editDescription: string = '';
  responseData: any;

  //  Table view heading
  displayedColumns: string[] = ['BenchStatus', 'Action'];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loginservice: LoginService,
    private _service: BenchStatusService,
    private _coreService: CoreService // private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.viewBenchStatus();
    this.responseData = history.state.data;
  }

  viewBenchStatus() {
    this._service.viewBenchStatusDescription().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
id:any;
  openEditForm(row: any) {
    this._service.editBenchStatus(row).subscribe((response: any) => {
      this.editDescription = response.description;
      this.id=response.id;
    });
  }

  deleteBenchStatus(id: any) {
    this._service.deleteBenchStatusDescription(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Error Category deleted!', 'done');
        if (res.status === 'success') {
          this.viewBenchStatus();
        }
        window.location.reload();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  upateChanges() {
     
    let updateData = {
      id:this.id,
      description: this.editDescription,
      division: 'string',
      createdBy: this.loginservice.getUsername(),
      createdUtc: new Date().toISOString(),
      updatedBy: this.loginservice.getUsername(),
      updatedUtc: null,
      isDeleted: false,
    };
    this._service.updateBenchStatus(updateData).subscribe({
      next:(response)=>{
        if(response.message === "Updated Bench Status Successfully....!"){
          this._coreService.openSnackBar('Updated Bench Status Successfully....!');
          this.viewBenchStatus();
          // window.location.reload();
        }
        else{
          return
        }
      },
      error:(err)=>{
        throw new Error('API Error', err);
        
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
