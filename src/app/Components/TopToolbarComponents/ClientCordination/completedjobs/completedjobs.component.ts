import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LoginService } from 'src/app/Services/Login/login.service';
import { GetJobHistoryPopupComponent } from './completedjobpopupjobhistory/get-job-history-popup/get-job-history-popup.component';
import { environment } from 'src/Environments/environment';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';
import { error } from 'jquery';
import Swal from 'sweetalert2/src/sweetalert2.js'
@Component({
  selector: 'app-completedjobs',
  templateUrl: './completedjobs.component.html',
  styleUrls: ['./completedjobs.component.scss']
})
export class CompletedjobsComponent implements OnInit {
  displayedColumns: string[] = [
    'selected',
    'jobnumber',
    'estjob',
    'department',
    'client',
    'customerclasiification',
    'clientstatus',
    'jobstatus',
    'parentjobid',
    'filename',
    'fileInwardMode',
    'fileReceivedEstDate',
    'jobcloseddate',
    'commentstoclient'
  ];

  dataSource: MatTableDataSource<any>;

  data: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, private loginservice: LoginService, private dialog: MatDialog, private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.getCompletedJobData();
    this.getcompleteordercount();
  }
  //getting count
  CompletedJobsCount: number;
  getcompleteordercount() {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `Allocation/getCompletedJobs?EmpId=${this.loginservice.getUsername()}`).subscribe(response => {
      this.spinnerService.requestEnded();
      this.CompletedJobsCount = response.clientDetails.resultForCompletedList;
    }, error => {
      this.spinnerService.resetSpinner();
    });
  }
  getCompletedJobData(): void {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `Allocation/getCompletedJobs?EmpId=${this.loginservice.getUsername()}`).subscribe(data => {
      this.spinnerService.requestEnded();
      this.dataSource = new MatTableDataSource(data.clientDetails.resultCompletedJobsList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinnerService.resetSpinner();
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  remarkValue: string = '';
  //to save the checkbox value
  selectedQuery: any[] = [];

  setAll(completed: boolean, item: any) {
    
    if (completed == true) {
      this.selectedQuery.push({ ...item, Comments: '', CategoryDesc: '', SelectedRows: [], CommentsToClient: '', SelectedEmployees: [] })
    }
    else {

      if (this.selectedQuery.find(x => x.id == item.id)) {
        this.selectedQuery = this.selectedQuery.filter(x => {
          if (x.id != item.id) {
            return item
          }
        })
      }
    }
  }
  postdatabulk: any[] = [];
  bulkUpload() {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `Allocation/getCompletedJobs?EmpId=${this.loginservice.getUsername()}`).subscribe(data => {
      this.spinnerService.requestEnded();
      this.postdatabulk = data.clientDetails.resultCompletedJobsList;

    });
    let bulkuploaddata = {
      "id": 0,
      "processId": 1,
      "statusId": 12,
      "selectedScopeId": 0,
      "autoUploadJobs": false,
      "employeeId": this.loginservice.getUsername(),
      "remarks": this.remarkValue,
      "isBench": true,
      "jobId": "string",
      "value": 0,
      "amount": 0,
      "stitchCount": 0,
      "estimationTime": 0,
      "dateofDelivery": "2023-05-18T11:26:56.846Z",
      "comments": "string",
      "validity": 0,
      "copyFiles": true,
      "updatedBy": 0,
      "jId": 0,
      "estimatedTime": 0,
      "tranMasterId": 0,
      "SelectedRows": this.selectedQuery,
      "selectedEmployees": [],
      "departmentId": 0,
      "updatedUTC": "2023-05-18T11:26:56.846Z",
      "categoryDesc": "string",
      "allocatedEstimatedTime": 0,
      "tranId": 0,
      "fileInwardType": "string",
      "timeStamp": "AAAAAAAxLeM=",
      "scopeId": 0,
      "quotationRaisedby": 0,
      "quotationraisedOn": "2023-05-18T11:26:56.846Z",
      "clientId": 0,
      "customerId": 0,
      "fileReceivedDate": "2023-05-18T11:26:56.846Z",
      "commentsToClient": "string",
      "isJobFilesNotTransfer": true
    }
    this.spinnerService.requestStarted();

    this.http.post<any>(environment.apiURL + `Allocation/processMovement`, bulkuploaddata).subscribe(data => {
      this.spinnerService.requestEnded();

      if (data.success == true) {
        Swal.fire(
          'Done!',
          data.message,
          'success'
        ).then((result) => {
          if (result.isConfirmed) {
            this.getCompletedJobData();
          }
        })
      }
      else {
        Swal.fire(
          'Error!',
          data.message,
          'error'
        )
      }
    });
  }


  getRemarkValue(event: Event) {
    this.remarkValue = (event.target as HTMLInputElement).value;
  }
  onChange(tab) {
    tab = this.getCompletedJobData();

  }

  getjobhistory(data) {
    const dialogRef = this.dialog.open(GetJobHistoryPopupComponent, {
      width: '100vw',
      data
    });
  }


}