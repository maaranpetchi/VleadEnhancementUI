import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SewOutService } from 'src/app/Services/CoreStructure/SewOut/sew-out.service';
import { MatDialog } from '@angular/material/dialog';
import { JobDetailsSewPopComponent } from '../SewOut-JobDetailsPopup/job-details-sew-pop/job-details-sew-pop.component';
import { LoginService } from 'src/app/Services/Login/login.service';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { SewOutComponent } from '../sew-out/sew-out.component';
import { SewoutworkflowComponent } from '../SewOut-JobDetailsPopup/sewoutworkflow/sewoutworkflow.component';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { environment } from 'src/Environments/environment';

@Component({
  selector: 'app-sew-out-table',
  templateUrl: './sew-out-table.component.html',
  styleUrls: ['./sew-out-table.component.scss']
})
export class SewOutTableComponent implements OnInit {

  scopes: any[];
  selectedScope: any = 0;
  // Variable to store the selected tab value

  displayedColumns: string[] = [
    'selected',
    'jobId',
    'estjob',
    'fileName',
    'action',
    'fileInwardMode',
    'client',
    'customerSatisfaction',
    'scope',
    'jobstatus',
    'projectcode',
    'allocatedby',
    'processstatus',
    'esttime',
    'jobcategeory',
    'deliverydate'
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sewout') SewOutComponent: SewOutComponent;
  constructor(private http: HttpClient, private sewOutService: SewOutService, private router: Router, private dialog: MatDialog, private loginservice: LoginService, private _coreService: CoreService, private SewOutComponent1: SewOutComponent) {
    this.SewOutComponent = SewOutComponent1
  }

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
    // Store the selected tab value
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
    else if (action == '7') {
      this.bulkUploadJobs();
    }
  }

  jids: string[] = []; //to get the jid to pass into edit restapi

  openModalWithData(data) {
    const dialogRef = this.dialog.open(JobDetailsSewPopComponent, {
      // width: '80vw',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any logic after the modal is closed (if needed)
      console.log('The dialog was closed');
    });
  }

  getWorkflowJobList(job) {
    const jid = job.jid; // Extract the jid from the clicked job
    // Create the payload for the POST API request
    const payload = { jid: jid };
    this.sewOutService.navJobDetails(jid).subscribe(data => {
      this.openModalWithData(data);
    });
  }

  freshJobs() {
    this.sewOutService.getTabValue1().subscribe(freshJobs => {
      
      this.dataSource = new MatTableDataSource(freshJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  revisionJobs() {
    this.sewOutService.getTabValue2().subscribe(revisionJobs => {
      this.dataSource = new MatTableDataSource(revisionJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  reworkJobs() {
    this.sewOutService.getTabValue3().subscribe(reworkJobs => {
      this.dataSource = new MatTableDataSource(reworkJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  quoteJobs() {
    this.sewOutService.getTabValue4().subscribe(quoteJobs => {
      this.dataSource = new MatTableDataSource(quoteJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  sewOut() {
    this.sewOutService.getTabValue5().subscribe(sewOut => {
      this.dataSource = new MatTableDataSource(sewOut.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  displayScopeDropdown: boolean = false; // hide a scope dropdown
  bulkJobs() {
    this.sewOutService.getTabValue6().subscribe(bulkJobs => {
      this.dataSource = new MatTableDataSource(bulkJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = true;
    });
  }

  bulkUploadJobs() {
    this.sewOutService.getTabValue7().subscribe(bulkUploadJobs => {
      this.dataSource = new MatTableDataSource(bulkUploadJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  scopeDropdown() {
    this.sewOutService.getScopeDropdown().subscribe(scopedata => {
      this.scopes = scopedata.ScopeDetails;
    });
  }

  getTabValue() {
    return this.SewOutComponent1.getCurrentTab();
  }
  workFlowConversion() {
    if (this.getTabValue() !== 5) {
      const apiUrl = environment.apiURL + `Allocation/getWorkflowJobList/${this.loginservice.getUsername()}/${this.loginservice.getProcessId()}/${this.getTabValue()}/0`;
      this.http.get(apiUrl).subscribe(
        (response: any) => {

          // Handle success response here
          let timeStamp = response.getWorkflowDetails[0].timeStamp;
          let customerId = response.getWorkflowDetails[0].customerId
 
          let existingSelectedRows = {
            // Existing selectedRows array
            // Add your existing selectedRows elements here
            "id": 0,
            "processId": response.getWorkflowDetails.processId,
            "statusId": 1,
            "selectedScopeId": 0,
            "autoUploadJobs": true,
            "employeeId": this.loginservice.getUsername(),
            "remarks": "string",
            "isBench": true,
            "jobId": "string",
            "value": 0,
            "amount": 0,
            "stitchCount": 0,
            "estimationTime": 0,
            "dateofDelivery": new Date().toDateString(),
            "comments": "string",
            "validity": 0,
            "copyFiles": true,
            "updatedBy": 0,
            "jId": response.getWorkflowDetails.jid,
            "estimatedTime": 0,
            "tranMasterId": 0,
            "selectedRows": [],
            "selectedEmployees": [],
            "departmentId": 0,
            "updatedUTC": new Date().toDateString(),
            "categoryDesc": "string",
            "allocatedEstimatedTime": 0,
            "tranId": 0,
            "fileInwardType": "string",
            "timeStamp": response.getWorkflowDetails[0].timeStamp,
            "scopeId": 0,
            "quotationRaisedby": 0,
            "quotationraisedOn": new Date().toDateString(),
            "clientId": 0,
            "customerId": response.getWorkflowDetails[0].customerId,
            "fileReceivedDate": new Date().toDateString(),
            "commentsToClient": "string",
            "isJobFilesNotTransfer": true
          };
          // Update the payload with the retrieved data
          let payload = {
            "id": 0,
            "processId": response.getWorkflowDetails.processId,
            "statusId": 1,
            "selectedScopeId": 0,
            "autoUploadJobs": true,
            "employeeId": this.loginservice.getUsername(),
            "remarks": "string",
            "isBench": true,
            "jobId": "string",
            "value": 0,
            "amount": 0,
            "stitchCount": 0,
            "estimationTime": 0,
            "dateofDelivery": new Date().toDateString(),
            "comments": "string",
            "validity": 0,
            "copyFiles": true,
            "updatedBy": 0,
            "jId": response.getWorkflowDetails.jid,
            "estimatedTime": 0,
            "tranMasterId": 0,
            "selectedRows": [existingSelectedRows], // Change to an array
            "selectedEmployees": [existingSelectedRows], // Change to an array
            "departmentId": 0,
            "updatedUTC": new Date().toDateString(),
            "categoryDesc": "string",
            "allocatedEstimatedTime": 0,
            "tranId": 0,
            "fileInwardType": "string",
            "timeStamp": response.getWorkflowDetails[0].timeStamp,
            "scopeId": 0,
            "quotationRaisedby": 0,
            "quotationraisedOn": new Date().toDateString(),
            "clientId": 0,
            "customerId": response.getWorkflowDetails[0].customerId,
            "fileReceivedDate": new Date().toDateString(),
            "commentsToClient": "string",
            "isJobFilesNotTransfer": true
          };

          // Make the POST request with the updated payload
          this.sewOutService.getprocessmovement(payload).subscribe(
            (response: any) => {
             
              localStorage.setItem('WFTID', response.wftId);
              localStorage.setItem('WFMID', response.wfmid);
              localStorage.setItem('JID', response.jid);
              if (response.success == true) {
                this._coreService.openSnackBar("Workflow converted successfully");
              }

              else{
                if (response.processId == 9 || response.processId == 11) {
                  localStorage.setItem("WFTId", response.tranId);
                  localStorage.setItem("WFMId", response.tranMasterId);
                  localStorage.setItem("JId", response.jid);
                  localStorage.setItem("processid", response.processId);
                  // $location.path('/ProcessTransaction');
              }
              else {
                  localStorage.setItem("WFTId", response.wftId);
                  localStorage.setItem("WFMId", response.wfmid);
                  localStorage.setItem("JId", response.jid);
                  localStorage.setItem("processid", response.processId);
                  // $location.path('/ProcessTransaction');
              }

              }

            }
          );
        },
        (error: any) => {
          // Handle error response here
          console.log("An error occurred while retrieving the data", error);
        }
      );
    }
    else {
      this.http.get<any>(``).subscribe(getWorkflowJobList => {


      });

      this.router.navigate(['/topnavbar/sewoutworkflow'])
    }
  }



}