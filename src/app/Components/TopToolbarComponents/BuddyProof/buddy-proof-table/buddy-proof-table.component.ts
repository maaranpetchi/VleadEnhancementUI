import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BuddyProofService } from 'src/app/Services/CoreStructure/BuddyProof/buddy-proof.service';
import { BuddyProofComponent } from '../buddy-proof/buddy-proof.component';
import { environment } from 'src/Environments/environment';
import { LoginService } from 'src/app/Services/Login/login.service';
import { SewOutService } from 'src/app/Services/CoreStructure/SewOut/sew-out.service';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { Router } from '@angular/router';
import { WorkflowService } from 'src/app/Services/CoreStructure/WorkFlow/workflow.service';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';
import { catchError } from 'rxjs';
import { error } from 'jquery';
import Swal from 'sweetalert2/src/sweetalert2.js'

@Component({
  selector: 'app-buddy-proof-table',
  templateUrl: './buddy-proof-table.component.html',
  styleUrls: ['./buddy-proof-table.component.scss']
})
export class BuddyProofTableComponent implements OnInit {

  scopes: any[] = [];
  selectedScope: any = 0;

  displayedColumns: string[] = [
    'selected',
    'jobId',
    'estjob',
    'actions',
    'client',
    'customerSatisfaction',
    'fileName',
    'fileInwardMode',
    'scope',
    'jobstatus',
    'projectcode',
    'allocatedby',
    'artistname',
    'processstatus',
    'esttime',
    'jobcategory',
    'deliverydate'
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, private buddyService: BuddyProofService, private buddyproofcomponent: BuddyProofComponent, private loginservice: LoginService, private sewOutService: SewOutService, private _coreService: CoreService, private router: Router, private workflowservice: WorkflowService, private spinnerservice: SpinnerService) { }

  ngOnInit(): void {
    //maintable
    this.freshJobs();
  }



  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




  //to save the checkbox value
  selectedQuery: any[] = [];

  setAll(completed: boolean, item: any) {

    if (completed == true) {
      this.selectedQuery.push(item)
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

  benchChecked: boolean = false;
  onBenchCheckboxChange(event: any) {
    this.benchChecked = event.checked;
  }
  tab(action) {
    if (action == '1') {
      this.freshJobs();
    }
    else if (action == '2') {
      this.revisionJobs();
    }
    else if (action == '3') {
      this.reworkJobs();
    }
    else if (action == '4') {
      this.quoteJobs();
    }
    else if (action == '5') {
      this.sewOut();
    }
    else if (action == '6') {
      this.bulkJobs();
    }
    else if (action == '6') {
      this.bulkUploadJobs();
    }
  }


  freshJobs() {
    this.buddyService.getTabValue1().subscribe(freshJobs => {
      this.dataSource = new MatTableDataSource(freshJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;
    });
  }
  revisionJobs() {
    this.buddyService.getTabValue2().subscribe(revisionJobs => {
      this.dataSource = new MatTableDataSource(revisionJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;
    });
  }
  reworkJobs() {
    this.buddyService.getTabValue3().subscribe(reworkJobs => {
      this.dataSource = new MatTableDataSource(reworkJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;
    });
  }
  quoteJobs() {
    this.buddyService.getTabValue4().subscribe(quoteJobs => {
      this.dataSource = new MatTableDataSource(quoteJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;
    });
  }
  sewOut() {
    this.buddyService.getTabValue5().subscribe(sewOut => {
      this.dataSource = new MatTableDataSource(sewOut.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;

    });
  }

  displayScopeDropdown: boolean = false; // hide a scope dropdown
  bulkJobs() {
    this.buddyService.getTabValue6().subscribe(bulkJobs => {
      this.dataSource = new MatTableDataSource(bulkJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = true;
    });
  }
  bulkUploadJobs() {
    this.buddyService.getTabValue7().subscribe(bulkUploadJobs => {
      this.dataSource = new MatTableDataSource(bulkUploadJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;

    });
  }


  scopeDropdown() {
    this.buddyService.getScopeDropdown().subscribe(scopedata => {
      this.scopes = scopedata.scopeDetails


    })
  }

  getTabValue() {

    return this.buddyproofcomponent.getCurrentTab();
  }

  lnkviewedit(data) {
    if (data.processId == 8 || data.processId == 10) {
      let selectedJobs = [{
        DepartmentId: data.departmentId,
        TranMasterId: data.tranMasterId,
        TimeStamp: data.timeStamp,
        TranId: data.tranId,
        JId: data.jid,
        CustomerId: data.customerId,
        JobId: data.jobId,
        Comments: data.commentsToClient ? data.commentsToClient : '',
        CategoryDesc: data.categoryDesc,
        SelectedRows: [],
        FileInwardType: data.fileInwardType,
        CommentsToClient: data.commentsToClient ? data.commentsToClient : '',
        SelectedEmployees: [],
      }];
      let selectedEmployees = [{
        EmployeeId: this.loginservice.getUsername(),
        JobId: data.jobId,
        TimeStamp: data.timeStamp,
        Comments: data.commentsToClient ? data.commentsToClient : '',
        CategoryDesc: data.categoryDesc,
        SelectedRows: [],
        FileInwardType: data.fileInwardType,
        CommentsToClient: data.commentsToClient ? data.commentsToClient : '',
        SelectedEmployees: [],
      }];
      var processMovement = {
        "id": 0,
        "processId": data.processId,
        "statusId": 1,
        "selectedScopeId": 0,
        "autoUploadJobs": true,
        "employeeId": 0,
        "remarks": "string",
        "isBench": true,
        "jobId": "string",
        "value": 0,
        "amount": 0,
        "stitchCount": 0,
        "estimationTime": 0,
        "dateofDelivery": "2023-07-11T12:10:42.205Z",
        "comments": "string",
        "validity": 0,
        "copyFiles": true,
        "updatedBy": 0,
        "jId": 0,
        "estimatedTime": 0,
        "tranMasterId": 0,
        "selectedRows": selectedJobs,
        "selectedEmployees": selectedEmployees,
        "departmentId": 0,
        "updatedUTC": "2023-07-11T12:10:42.205Z",
        "categoryDesc": "string",
        "allocatedEstimatedTime": 0,
        "tranId": 0,
        "fileInwardType": "string",
        "timeStamp": data.timeStamp,
        "scopeId": 0,
        "quotationRaisedby": 0,
        "quotationraisedOn": "2023-07-11T12:10:42.205Z",
        "clientId": 0,
        "customerId": 0,
        "fileReceivedDate": "2023-07-11T12:10:42.205Z",
        "commentsToClient": "string",
        "isJobFilesNotTransfer": true
      }
      this.spinnerservice.requestStarted()
      this.http.post<any>(environment.apiURL + `Allocation/processMovement`, processMovement).pipe(catchError((error) => {
        this.spinnerservice.requestEnded();
        return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
      })).subscribe(result => {
        this.spinnerservice.requestEnded();
        if (result.Success == true) {
          localStorage.setItem("WFTId", result.wftId);
          localStorage.setItem("WFMId", result.wfmid);
          localStorage.setItem("JId", data.JId);
          localStorage.setItem("processid", result.processId);
          this.router.navigate(['/topnavbar/qualityworkflow']);
        }
        else {
           Swal.fire('Alert!', result.message, 'error');

          this.BindPendingJobs();
        }
      });
    }
    else {
      if (data.processId == 9 || data.processId == 11) {
        localStorage.setItem("WFTId", data.tranId);
        localStorage.setItem("WFMId", data.tranMasterId);
        localStorage.setItem("JId", data.jid);
        localStorage.setItem("processid", data.processId);
        this.router.navigate(['/topnavbar/qualityworkflow']);
      }
      else {
        localStorage.setItem("WFTId", data.wftid);
        localStorage.setItem("WFMId", data.wfmid);
        localStorage.setItem("JId", data.jid);
        localStorage.setItem("processid", data.processId);
        // $location.path('/ProcessTransaction');
        this.workflowservice.setData(data);

        this.router.navigate(['/topnavbar/qualityworkflow']);
      }
    }
  };


  BindPendingJobs() {
    this.http.get<any>(environment.apiURL + `Allocation/getWorkflowJobList/${this.loginservice.getUsername()}/${this.loginservice.getProcessId()}/1/0`).subscribe(result => {

    });
  }
}
