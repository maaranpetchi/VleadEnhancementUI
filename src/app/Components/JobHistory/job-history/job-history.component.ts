import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JobHistoryService } from 'src/app/Services/JobHistory/job-history.service';
import { JobhistoryDetailsComponent } from '../jobhistory-details/jobhistory-details.component';
import { SpinnerService } from '../../Spinner/spinner.service';
import { environment } from 'src/Environments/environment';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss']
})
export class JobHistoryComponent implements OnInit{
  selectedFilter: number;
  selectedClient: number;
  recordCount : number;
  selectedFileName: string;
  fromDate: string;
  toDate: string;
  clients: any[];

  selectedInvoices: any[] = [];
  

  client:boolean =false;
  customers: boolean = false;
  dateFields: boolean = false;
  inputField: boolean = false;


  constructor(
    private _service:JobHistoryService,
    private router:Router,
    private http :HttpClient,
    private dialog:MatDialog ,
    private spinnerService: SpinnerService,
  ){}

  displayedColumns: string[] = [
    'selected',
    'jobnumber',
    'jobdate',
    'department',
    'client',
    'jobstatus',
    'filename',
    'jobdate1',

  ];
  


  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.onGoButtonClick()

    const records = [];
    
  }

  myForm = new FormGroup({
    selectdropdown: new FormControl("", Validators.required),
    client: new FormControl("", Validators.required),
    ClientId: new FormControl("", Validators.required),
    filename: new FormControl(""),
    fromDate:new FormControl(""),
    toDate:new FormControl(""),
  });

  onFilterChange() {
    if (this.selectedFilter == 1 || this.selectedFilter == 2 || this.selectedFilter == 0) {
      this.customers = false;
      this.inputField = false;
      this.dateFields = false;
      this.selectedFileName = '';
      this.fromDate = '';
      this.toDate = '';

      this.selectedClient = 0;
    }
    if (this.selectedFilter == 3) {
      this.customers = true;
      this.inputField = false;
      this.dateFields = false;
      this.selectedFileName = '';
      this.fromDate = '';
      this.toDate = '';


      this.http.get<any[]>(environment.apiURL+'Customer/GetCustomers').subscribe(clientdata => {
        this.clients = clientdata;
      });

    }
    else if (this.selectedFilter == 4) {
      this.inputField = true;
      this.customers = false;
      this.dateFields = false;
      this.selectedClient = 0;
      this.fromDate = '';
      this.toDate = '';

    }

    else if (this.selectedFilter == 6) {
      this.inputField = false;
      this.customers = false;
      this.dateFields = true;
      this.selectedClient = 0;
      this.selectedFileName = '';

    }
  };
  onGoButtonClick() {
    
    if (this.selectedClient != undefined || this.selectedFileName != undefined || this.selectedFilter != undefined || this.fromDate != undefined || this.toDate != undefined) {
      if ((this.selectedClient == undefined || this.selectedClient == null)) {
        this.selectedClient = 0;
      }
      if ((this.selectedFileName == undefined || this.selectedFileName == null || this.selectedFileName == '')) {
        this.selectedFileName = '';
      }
      var departmentId = this.selectedFilter;
      if (departmentId == 3 || departmentId == 4 || departmentId == 6) {
        departmentId = 0;
      }
      var jobOrder = {
        transactionId:0 ,
        departmentId: departmentId,
        clientId: this.selectedClient,
        fileName: this.selectedFileName,
        jobClosedUTC: new Date().toISOString(),
        dateofUpload: '0001-01-01T00:00:00.000Z',
      };
      this.spinnerService.requestStarted();
      this.http.post<any>(environment.apiURL+'Allocation/getJobMovementJobsWithclientIdfileName', jobOrder).subscribe({
        next:(response) => {
          console.log(response, "data received");
       this.spinnerService.requestEnded();
      this.dataSource.data = response.jobMovement;
      this.recordCount = response.jobMovement.length;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(response);
        },
        error: (err) => {
          console.log(err);
          this.spinnerService.resetSpinner();
        }
      })
    }
  };
  setAll(completed: boolean, item: any) {
    console.log("before", this.selectedInvoices)
    if (completed == true) {
      this.selectedInvoices.push({id:item.id})
    }
    else {

      if (this.selectedInvoices.find(x => x.id == item.id)) {
        this.selectedInvoices = this.selectedInvoices.filter(x => {
          if (x.id != item.id) {
            return item
          }
        })
      }
    }
    console.log("after", this.selectedInvoices)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getJobHistory(data){
    this.dialog.open(JobhistoryDetailsComponent,{
      width:'80vw',
      data
  })
}

}
