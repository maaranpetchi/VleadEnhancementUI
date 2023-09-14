import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { environment } from 'src/Environments/environment';
import { LoginService } from 'src/app/Services/Login/login.service';
import { ProofReadingService } from 'src/app/Services/proof-reading.service';
import { JobhistorypopuptableComponent } from '../jobhistorypopuptable/jobhistorypopuptable.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { writeFile } from 'xlsx';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { WorkflowService } from 'src/app/Services/CoreStructure/WorkFlow/workflow.service';
import { Location } from '@angular/common';
import saveAs from 'file-saver';

@Component({
  selector: 'app-quality-workflow',
  templateUrl: './quality-workflow.component.html',
  styleUrls: ['./quality-workflow.component.scss']
})
export class QualityWorkflowComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['startDate', 'endDate', 'totalTimeTaken', 'status'];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ProcessTransaction: any;
  isHold: boolean;
  revisionCheck: any;
  SameEmp: any;
  Checkbench: any;
  disableWorkType: boolean;
  BenchJobPopupMessage: string;
  showFiles: boolean;
  SummaryHistory: any;

  ///TO SMALL TABLE///
  TotalTimeWorked: any;
  Break: any;
  Training: any;
  Hold: any;
  Others: any;
  TotalTimeTaken: any;
  Estimatedtime: any;
  Deviation: any;
  checklist: any;
  alertMessage: string;
  confirmationMessage: any;
  RbnError: string;
  errorId: any;
  IsSelfQC: any;


  /////Footer declaration to store the value
  Status: string = '';
  errorCategory: any;
  Remarks: string = '';
  hiddenscope: boolean;
  CopyPreviousFiles: boolean = false;
  checked: boolean = false;
  disable: boolean = false;
  ShowErrorCategory: boolean = false;
  commentsToClient: string = '';
  txtbpsoStitchCount: number = 0;
  footerDropdown: boolean = false;
  data: any;
  jobCommonDetails: any;
  ngOnInit(): void {
    this.getIsvalue();

    this.getIsholdSampValue();
    //this.BindWorkDetails();
    this.getScope();
    this.rbnError();



  }

  constructor(private location:Location,private http: HttpClient, private dialog: MatDialog, private loginService: LoginService, private workflowservice: WorkflowService, private spinnerService: SpinnerService,
  ) {
    this.data = this.workflowservice.getData();
    console.log(this.data,"Injected Data");
    
    
  }

  zipFiles(): void {
    let path = this.jobCommonDetails.jobCommonDetails.tranFileUploadPath;
    path = path.replace(/\\/g, '_');

    const fileUrl =
      environment.apiURL + 'Allocation/DownloadZipFile?path=' + `${path}`; // Replace with the actual URL of your zip file

    // Use HttpClient to make a GET request to fetch the zip file
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((response) => {
      this.saveFile(response);
    });
  }
  private saveFile(blob: Blob) {
    // Create a blob URL for the file
    const url = window.URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = this.data.fileName; // Replace with the desired file name
    document.body.appendChild(a);

    // Trigger the click event to start the download
    a.click();

    // Clean up the blob URL and the link element
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  workFiles(id: number): void {
    let path = this.jobCommonDetails.jobCommonDetails.tranFileUploadPath;
    path = path.replace(/\\/g, '_');

    this.http
      .get(environment.apiURL + `Allocation/getFileNames/${path}`)
      .subscribe((response: any) => {
        const fileUrls: string[] = response.files;
        fileUrls.forEach((url) => {
          this.http
            .get(
              environment.apiURL +
                'Allocation/downloadFilesTest/' +
                `${path}/` +
                url
            )
            .subscribe((response: any) => {
              saveAs(
                new Blob([response.data], { type: 'application/octet-stream' }),
                url
              );
            });
        });
      });
  }
  getFileNameFromPath(filePath: string): string {
    const pathParts = filePath.split('/');
    return pathParts[pathParts.length - 1];
  }
  fetchData() {
    const apiUrl = environment.apiURL + 'JobOrder/getJobHistory';

    this.http.post<any>(apiUrl, this.data.jId?this.data.jId:0).subscribe((response: any) => {
        this.jobCommonDetails = response;
      },
      (error: any) => {
        console.log('Error fetching data from REST API:', error);
      }
    );
  }

  Back(){
    this.location.back();
  }

  //upperbody
  viewDetails(data) {
    this.dialog.open(JobhistorypopuptableComponent, {
      width: '800px',
      data
    });
  }

  //to get the isvalue to show dropdodown in select  status

  getIsvalue() {
    var tranIdAndEmployeeId = {
      "tranId": localStorage.getItem('WFTId'),
      "tranMasterId": 0,
      "estimatedTime": 0,
      "statusId": 0,
      "divEmpId": 0,
      "employeeName": "string",
      "employeeCount": 0,
      "timeStamp": "",
      "departmentId": 0,
      "processId": 0,
      "isActive": true,
      "allocatedEstimatedTime": 0,
      "projectCode": "string",
      "customerClassification": "string",
      "dateofDelivery": "2023-07-11T22:38:37.633Z",
      "previousProcessId": 0,
      "artistName": "string",
      "name": "string",
      "jid": 0,
      "jobId": "string",
      "jobDate": "2023-07-11T22:38:37.633Z",
      "queryJobDate": "2023-07-11T22:38:37.633Z",
      "isDeleted": true,
      "fileName": "string",
      "customerJobType": "string",
      "commentsToClient": "string",
      "jobStatusId": 0,
      "jobStatusDescription": "string",
      "customerId": 0,
      "shortName": "string",
      "isBulk": true,
      "categoryDesc": "string",
      "employeeId": this.loginService.getUsername(),
      "workStatus": "string",
      "scopeDesc": "string",
      "jobDateQueryDate": "2023-07-11T22:38:37.633Z",
      "estjobDate": "2023-07-11T22:38:37.633Z",
      "estfileReceivedDate": "2023-07-11T22:38:37.633Z",
      "jobDateEst": "2023-07-11T22:38:37.633Z",
      "fileInwardType": "string",
      "overAllTime": 0,
      "trayTime": 0,
      "balanceTime": 0
    }
    this.http.post<any>(environment.apiURL + `Allocation/checkSelfQC`, tranIdAndEmployeeId).subscribe(result => {
      this.IsSelfQC = result.selfQC;
    });

  };


  AttachedFiles: File[] = [];
  AttachedFiles1: File[] = [];

  onFileSelected(event: any) {
    
    const file: File = event.target.files[0];
    this.AttachedFiles = [event.target.files[0], ...this.AttachedFiles];//store the selected file in selectdfile;
    this.AttachedFiles1 = [event.target.files[0].name, ...this.AttachedFiles1];//store the selected file in selectdfile;
  }





  //ishold ,sam
  getIsholdSampValue() {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `Workflow/GetProcessTransaction/${localStorage.getItem("WFTId")}/${this.loginService.getUsername()}`).subscribe(result => {
      this.spinnerService.requestEnded();
      this.ProcessTransaction = result.getWorkflowDetails;
      this.revisionCheck = result.ChkRevise;
      // $scope.workFlowForm.CopyPreviousFiles = false;
      this.isHold = result.isHold;
      this.SameEmp = result.sameEmp;
      this.Checkbench = result.checkbench;
      

      if (result.getWorkflowDetails.workStatus == 'Working') {
        this.disableWorkType = false;
      }
      else {
        this.disableWorkType = true;
      }
      if (this.Checkbench != null && (this.Checkbench.Status == "Break" || this.Checkbench.Status == "In Process" || this.Checkbench.Status == "Working")) {
        this.isHold = true;
        this.SameEmp = true;
        this.disableWorkType = false;
        this.BenchJobPopupMessage = 'Close you Bench job for further step';
        // $('#BenchJobPopup').modal('show');
        //alert(JSON.stringify("Close you Bench job for further step..!"));
      }
      this.BindWorkDetails();
      // this.now();//--------------------------------final CL------------------------------
    });
  }



  ////////////////////////////Main Method//////////////////////////////////////////

  changeWorkType(workType) {
    if (workType == 'Start') {
      this.disableWorkType = false;
      this.showFiles = true;
      
      this.footerDropdown = true;
      this.ChangeWorkflow(workType);
    }
    else if (workType == 'End') {
      if (this.AttachedFiles.length == 0) {
        Swal.fire(
          'Please choose the file!',
          'Alert',
          'info'
        )

      }
      this.http.get<any>(environment.apiURL + `Workflow/ChecklistPopup?WFMId=${this.data.wfmid}`).subscribe(result => {
        this.checklist = result.check;
      });
      if (this.checklist != "") {
        // $('#checklistPopupup').modal('show');
        if (this.data.processName == 'Production') {   //        the below code 154 to 193 STARTS     
          if (this.Status == 'Query' || this.Status == 'Query for Special Pricing') {
            if (this.AttachedFiles.length == 0 && this.CopyPreviousFiles == false) {
              this.alertMessage = 'Please Copy Previous Files (or) Upload Files!';
              //  $('#alertPopup').modal('show');
            }
            else {
              this.disableWorkType = true;
              this.ChangeWorkflow(workType);
            }
          }
          else if (this.AttachedFiles.length == 0) {
            this.alertMessage = 'Please Upload Files!';
            //  $('#alertPopup').modal('show');
          }
          else {
            this.disableWorkType = true;
            this.ChangeWorkflow(workType);
          }
        }
        else if (this.data.processName == 'Quality') {
          if (this.AttachedFiles.length == 0 && this.CopyPreviousFiles == false) {
            this.alertMessage = 'Please Copy Previous Files (or) Upload Files!';
            //   $('#alertPopup').modal('show');
          }
          else {
            this.disableWorkType = true;
            this.ChangeWorkflow(workType);
          }
        }
        else if (this.data.processName == 'Sew Out' || this.data.processName == 'Buddy Proof') {
          if (this.AttachedFiles.length == 0 && this.CopyPreviousFiles == false && this.AttachedFiles1.length == 0) {
            this.alertMessage = 'Please Copy Previous Files (or) Upload Files!';
            // $('#alertPopup').modal('show');
          }
          else {
            this.disableWorkType = true;
            this.ChangeWorkflow(workType);
          }
        }
        else if (this.data.processName == 'Proof Reading') {
          if (this.CopyPreviousFiles == false) {
            this.alertMessage = 'Please Copy Previous Files!';
            //  $('#alertPopup').modal('show');
          }
          else {
            this.disableWorkType = true;
            this.ChangeWorkflow(workType);
          }
        }
        else {
          this.disableWorkType = true;
          this.ChangeWorkflow(workType);
        }
      }
      else {
        if (this.data.processName == 'Production') {         //the below code 154 to 193 STARTS          
          if (this.Status == 'Query' || this.Status == 'Query for Special Pricing') {
            if (this.AttachedFiles.length == 0 && this.CopyPreviousFiles == false) {
              this.alertMessage = 'Please Copy Previous Files (or) Upload Files!';
              //   $('#alertPopup').modal('show');
            }
            else {
              this.disableWorkType = true;
              this.ChangeWorkflow(workType);
            }
          }
          else if (this.AttachedFiles.length == 0) {
            this.alertMessage = 'Please Upload Files!';
            //  $('#alertPopup').modal('show');
          }
          else {
            this.disableWorkType = true;
            this.ChangeWorkflow(workType);
          }
        }
        else if (this.data.processName == 'Quality') {
          if (this.AttachedFiles.length == 0 && this.CopyPreviousFiles == false) {
            this.alertMessage = 'Please Copy Previous Files (or) Upload Files!';
            //  $('#alertPopup').modal('show');
          }
          else {
            this.disableWorkType = true;
            this.ChangeWorkflow(workType);
          }
        }
        else if (this.data.processName == 'Sew Out' || this.data.processName == 'Buddy Proof') {
          if (this.AttachedFiles.length == 0 && this.CopyPreviousFiles == false && this.AttachedFiles1.length == 0) {
            this.alertMessage = 'Please Copy Previous Files (or) Upload Files!';
            //  $('#alertPopup').modal('show');
          }
          else {
            this.disableWorkType = true;
            this.ChangeWorkflow(workType);
          }
        }
        else if (this.data.processName == 'Proof Reading') {
          if (this.CopyPreviousFiles == false) {
            this.alertMessage = 'Please Copy Previous Files!';
            // $('#alertPopup').modal('show');
          }
          else {
            this.disableWorkType = true;
            this.ChangeWorkflow(workType);
          }
        }
        else {
          this.disableWorkType = true;
          this.ChangeWorkflow(workType);
        }
      }
      //-----------------------------------------------------------------final CL---------------------------------------------------------------
    }
    else {
      this.disableWorkType = true;
      this.ChangeWorkflow(workType);
    }
  }
  ChangeWorkflow(workType) {
    let ProcessCheck = localStorage.getItem('processid');

    if (ProcessCheck === '3' || ProcessCheck === '5' || ProcessCheck === '9' || ProcessCheck === '11') {
      if (this.data.stitchCountUpdate === undefined) {
        this.data.stitchCountUpdate = this.txtbpsoStitchCount;
      }
    }

    else {

      this.data.stitchCountUpdate = this.data.stitchCount;
    }

    if (this.RbnError == 'No Error') {

      this.errorId = null;
    }
    var processTransaction = {
      WFTId: this.data.wftid,
      WFMId: this.data.wfmid,
      ScopeId: this.data.scopeId,
      ProcessId: this.data.processId,
      WorkType: workType,
      Status: this.Status,
      CommentsToClient: this.commentsToClient,
      Remarks: this.Remarks,
      EmployeeId: this.loginService.getUsername(),
      CopyFiles: this.CopyPreviousFiles,
      StitchCount: this.data.stitchCount ? this.data.stitchCount : 0,
      ErrorCategoryId: this.errorId,
      Value: this.data.estimatedTime
    };

    var fd = new FormData();

    if (workType == 'End') {
      for (let i = 0; i < this.AttachedFiles.length; i++) {
        fd.append('file', this.AttachedFiles[i]);
      }

      if (this.AttachedFiles.length > 0) {
        this.CopyPreviousFiles = false;
      }
      if ((this.AttachedFiles.length > 0 && this.CopyPreviousFiles == false) || (this.AttachedFiles1.length > 0)) {

        if (this.AttachedFiles1.length > 0) {
          let processTransaction = {
            WFTId: this.data.wftid,
            WFMId: this.data.wfmid,
            ScopeId: this.data.scopeId,
            ProcessId: this.data.processId,
            WorkType: workType,
            Status: this.Status,
            CommentsToClient: this.data.commentsToClient,
            Remarks: this.Remarks,
            EmployeeId: this.loginService.getUsername(),
            CopyFiles: this.CopyPreviousFiles,
            StitchCount: this.data.stitchCount ? this.data.stitchCount : 0,
            ErrorCategoryId: this.errorId,
            Value: this.data.estimatedTime,
            files: "",
          };

          fd.append('data', JSON.stringify(processTransaction));
          this.spinnerService.requestStarted();
          this.http.post<any>(environment.apiURL + `Workflow/ChangeWorkflow/${this.data.wftid}`, fd).subscribe(ChangeWorkflowResult => {
            this.BindWorkDetails();
            this.confirmationMessage = ChangeWorkflowResult.message;
            this.spinnerService.requestEnded();
if(ChangeWorkflowResult.success == true){
            Swal.fire(
              'Done!',
              this.confirmationMessage,
              'success'
            ).then((result)=>{
              if(result.isConfirmed){
                this.location.back();  
              }
            })
          }
          else{
            Swal.fire(
              'Error!',
              this.confirmationMessage,
              'error'
            )
          }
          });


        }
        else {
          this.spinnerService.requestStarted();
          fd.append('data', JSON.stringify(processTransaction));
          this.http.post<any>(environment.apiURL + `Workflow/ChangeWorkflow/${this.data.wftid}`, fd).subscribe(ChangeWorkflowResult => {
            this.BindWorkDetails();
            this.confirmationMessage = ChangeWorkflowResult.message;
            this.spinnerService.requestEnded();
            if (ChangeWorkflowResult.success == true) {
              Swal.fire(
                'Done!',
                this.confirmationMessage,
                'success'
              ).then((result) => {
                if (result.isConfirmed) {
                  this.location.back();        
                       }
              })
            }
            else {
              Swal.fire(
                'Error!',
                this.confirmationMessage,
                'error'
              )
            }

          });
        }
      }
      else {
        this.spinnerService.requestStarted();
        fd.append('data', JSON.stringify(processTransaction));
        this.http.post<any>(environment.apiURL + `Workflow/ChangeWorkflow/${this.data.wftid}`, fd).subscribe(ChangeWorkflowResult => {
          this.BindWorkDetails();
          this.confirmationMessage = ChangeWorkflowResult.message;
          Swal.fire(
            'Done!',
            this.confirmationMessage,
            'success'
          )
          this.spinnerService.requestEnded();
        });
      }
    }

    else {
      fd.append('data', JSON.stringify(processTransaction));
      this.spinnerService.requestStarted();
      this.http.post<any>(environment.apiURL + `Workflow/ChangeWorkflow/${this.data.wftid}`, fd).subscribe(ChangeWorkflowResult => {
        this.spinnerService.requestEnded();
        if (workType == 'End') {
          this.BindWorkDetails();
          this.confirmationMessage = ChangeWorkflowResult.message;

          if(ChangeWorkflowResult.success ==true) {
          Swal.fire(
            'Done!',
            this.confirmationMessage,
            'success'
          )
          }
          else{
            Swal.fire(
              'Error!',
              this.confirmationMessage,
              'error'
            )
          }
        }
        else {
          this.BindWorkDetails();
        }
      });
    }

  };


  BindWorkDetails() {
    

    let processTransaction = {
      "wftid": localStorage.getItem("WFTId"),
      "wfmid": this.data.wfmid,
      "workType": "string",
      "status": "string",
      "remarks": "string",
      "employeeId": this.loginService.getUsername(),
      "copyFiles": true,
      "errorCategoryId": 0,
      "value": 0,
      "scopeId": 0,
      "processId": localStorage.getItem("processid"),
      "stitchCount": 0,
      "orderId": 0,
      "isClientOrder": 0,
      "statusId": 0,
      "sourcePath": "string",
      "dynamicFolderPath": "string",
      "folderPath": "string",
      "fileName": "string",
      "fileCount": 0,
      "orignalPath": "string",
      "orignalDynamicPath": "string",
      "jobId": "string",
      "isProcessWorkFlowTranInserted": 0,
      "isCopyFiles": 0,
      "pid": 0,
      "fakeProcessId": 0,
      "fakeStatusId": 0,
      "fakeDynamicFolderPath": "string",
      "jobFileName": "string",
      "files": [],
      "commentsToClient": "string",
      "tranFileUploadPath": "string",
      "selectedRows": []
    }
    this.spinnerService.requestStarted();
    this.http.post<any>(environment.apiURL + "Workflow/GetProductionWorkList", processTransaction).subscribe((result) => {
      this.spinnerService.requestEnded();
      this.dataSource = new MatTableDataSource<any>(result.jobHistory); // to display the details in table
      this.dataSource.paginator = this.paginator;
      let History = result.summary.summaryHistory;
      this.SummaryHistory = History[0];

      
      
      this.TotalTimeWorked = result.summary.summaryHistory[0].totalTime;
      this.Break = result.summary.summaryHistory[0].break;
      this.Training = result.summary.summaryHistory[0].trainingorMeeting;
      this.Hold = result.summary.summaryHistory[0].hold;
      this.Others = result.summary.summaryHistory[0].others;
      this.TotalTimeTaken = result.summary.summaryHistory[0].totalTimeTaken;
      this.Estimatedtime = result.summary.summaryHistory[0].estimatedTime;
      this.Deviation = result.summary.summaryHistory[0].deviation;



      let employeeSummaryHistory = History.splice(1, History.length);
      if (result.jobHistory.length > 0) {
        this.showFiles = true;
      }

      

    });
  }

  startTimer(startDate: string): string {
    const startTime = new Date(startDate);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - startTime.getTime();
    const seconds = Math.floor(timeDifference / 1000) % 60;
    const minutes = Math.floor(timeDifference / 1000 / 60) % 60;
    const hours = Math.floor(timeDifference / 1000 / 60 / 60) % 24;

    // Format the date as "dd-mm-yyyy"
    const formattedDate = `${startTime.getMonth() + 1}-${startTime.getDate()}-${startTime.getFullYear()}`;

    // Format the time as "hour:minutes:seconds"
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Return the formatted timer value
    return `${formattedDate} ${formattedTime}`;
  }




  ///to get the error dropdown value
  rbnError() {
    
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `Workflow/GetErrorCategories/${localStorage.getItem('WFTId')}/${this.loginService.getUsername()}`).subscribe(result => {
      this.spinnerService.requestEnded();
      this.errorCategory = result.errorCategories;
    });
  };
  //to get scope dropdown value
  Scope: any = [];
  getScope() {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `Allocation/getCustomerScopeValues/${this.data.departmentId}/${this.data.clientId}`).subscribe(data => {
      this.spinnerService.requestEnded();
      if (data.scopeDetails.length > 0) {
        this.Scope = data.scopeDetails;
      }
    });
  }
  ///Dropdownchaneg to show some fields
  selectIsError() {
    if (this.data.processName == 'Quality' || this.data.processName == 'Sew Out' || this.data.processName == 'Buddy Proof') {
      this.RbnError = 'No Error';
      if (this.Status == 'Error' || this.Status == 'Completed With Error') {
        this.RbnError = 'Error';
        this.rbnError();
      }
    }
    if (this.data.processName == 'Proof Reading') {
      this.hiddenscope = true;
    }

    if (this.data.processName == 'Production' && (this.Status == 'Query' || this.Status == 'Query for Special Pricing')) {
      this.checked = true;
      this.disable = true;
      this.CopyPreviousFiles = true;
    }
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `Allocation/getCustomerScopeValues/1/${this.data.clientId}`).subscribe(result => {
      this.spinnerService.requestEnded();

      if (result.scopeDetails.length > 0) {
        this.Scope = result.scopeDetails;
      }
      else {
        this.alertMessage = 'No Scope Available for the customer!';
        // $('#alertPopup').modal('show');
      }

    });
  };




}