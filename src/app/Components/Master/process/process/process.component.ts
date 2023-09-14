import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { ProcessService } from 'src/app/Services/Process/process.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit{


  displayedColumns:string[] = [
    'Name',
    'ShortName',
    'Description', 
    'IsActive',
    'Action' 
  ]

  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private _service:ProcessService,
    private route:Router,
    private _coreService:CoreService,
    private http:HttpClient
  ){}
  
  ngOnInit(): void {
    this.getListProcess()
  }

  getListProcess(){
    this._service.getProcessList().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      }
    })  
  }


  addItem(){
    this._service.setFormData(null);
    this.route.navigate(['/topnavbar/process-addEdit'])
  }


  openViewForm(data:any){
    this.http.get(environment.apiURL+`Process/ProcessDetails?Id=${data.id}`).subscribe((response:any) =>{
    this.route.navigate(['/topnavbar/process-view'], {state:{data:response}});
  })
}
  openEditForm(id:any){
    this._service.setFormData(id);
    this.http.get(environment.apiURL+`Process/ProcessDetails?Id=${id}`).subscribe((response:any) =>{
      this.route.navigate(['/topnavbar/process-addEdit'], {state:{data:response}});
  })
  }



  deleteScopeUser(id:any){
    this._service.deleteProcess(id).subscribe({
      next: (response) => {
        if(response === true){
        this._coreService.openSnackBar('Process deleted!', 'done');
        window.location.reload()
        }
        else{
        this._coreService.openSnackBar('Failed!', 'done');
        }
        this.getListProcess();
      },
      error: console.log,
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
