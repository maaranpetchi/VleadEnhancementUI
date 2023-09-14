import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { environment } from 'src/Environments/environment';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { LoginService } from 'src/app/Services/Login/login.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
@Component({
  selector: 'app-job-assigned-details-popup',
  templateUrl: './job-assigned-details-popup.component.html',
  styleUrls: ['./job-assigned-details-popup.component.scss'],
})
export class JobAssignedDetailsPopupComponent implements OnInit {
  jobCommonDetails: any;
  confirmationMessage: any;
  QueryDetailsList: any;
  selectedJobs: {
    DepartmentId: any;
    TranMasterId: any;
    JId: any;
    CustomerId: any;
    JobId: string;
    Comments: string;
    TimeStamp: string;
    CategoryDesc: string;
    SelectedRows: never[];
    FileInwardType: string;
    CommentsToClient: string;
    SelectedEmployees: never[];
  }[];
  estimationTime: any;
  stitchCount: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private loginservice: LoginService,
    private _coreService: CoreService,
    private router: Router,
    public dialogRef: MatDialogRef<JobAssignedDetailsPopupComponent>
  ) {
    console.log(data, 'InjectedData');
  }

  displayedJobColumns: string[] = [
    'movedFrom',
    'movedTo',
    'movedDate',
    'movedBy',
    'MovedTo',
    'remarks',
  ];
  dataJobSource: MatTableDataSource<any>;
  displayedQueryColumns: string[] = [
    'movedFrom',
    'movedTo',
    'jobStatus',
    'movedDate',
    'movedBy',
    'MovedTo',
    'remarks',
  ];
  dataQuerySource: MatTableDataSource<any>;

  remarks: string; // to store the remark value
  selectedQureryStatus: number; // to store the selected query status
  estimatedTime: string;

  EstimatedTime: boolean = false;
  remarksdata: boolean = false;
  EmployeData: boolean = false;

  Scopes: any[] = [];
  selectedScope: any = 0;
  estTime: number;
  restApiData: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.fetchData();
    this.QueryDetailspost();
    this.fetchScopes();
    this.getAssignedEmployeesToChangeEstTime();
  }

  close() {
    this.dialogRef.close();
  }
  StatusChange() {
    if (this.selectedQureryStatus == 6) {
      this.remarksdata = true;
      this.EstimatedTime = false;
      this.EmployeData = false;
    } else if (this.selectedQureryStatus == 8) {
      this.EstimatedTime = true;
      this.remarksdata = true;
      this.EmployeData = true;
      this.http
        .get<any>(
          environment.apiURL +
            `Allocation/getAssignedEmployeesToChangeEstTime/${this.data.jId}`
        )
        .subscribe((response) => {
          this.restApiData = response.assignedEmployees;
        });
    }
  }
  fetchScopes() {
    this.http
      .get<any>(
        environment.apiURL +
          `Allocation/getScopeValues/${this.loginservice.getUsername()}`
      )
      .subscribe((scopedata) => {
        this.Scopes = scopedata.scopeDetails; // Sort the scopes based on the 'name' property
      });
  }
  fetchData() {
    const apiUrl = environment.apiURL + 'JobOrder/getJobHistory';

    this.http.post<any>(apiUrl, this.data.jId ? this.data.jId : 0).subscribe(
      (response: any) => {
        this.jobCommonDetails = response;
        console.log(this.jobCommonDetails);
        this.dataJobSource = response;
        this.dataJobSource = new MatTableDataSource(response.jobHistory);
        this.dataJobSource.paginator = this.paginator;
        this.dataJobSource.sort = this.sort; // Assuming the REST API response is an array of objects
        this.dataQuerySource = response;
        this.dataQuerySource = new MatTableDataSource(response.jobQueryHistory);
        this.dataQuerySource.paginator = this.paginator1;
        this.dataQuerySource.sort = this.sort;
      },
      (error: any) => {
        console.log('Error fetching data from REST API:', error);
      }
    );
  }

  QueryDetailspost() {
    const apiUrl = environment.apiURL + `ClientOrderService/QueryDetailspost`;
    var datas = {
      wftid: 0,
      jid: this.data.jId,
    };
    return this.http.post(apiUrl, datas).subscribe(
      (response: any) => {
        this.restApiData = response; // Assuming the REST API response is an array of objects
      },
      (error: any) => {
        console.log('Error fetching data from REST API:', error);
      }
    );
  }

  getAssignedEmployeesToChangeEstTime() {
    const apiUrl =
      environment.apiURL +
      `Allocation/getAssignedEmployeesToChangeEstTime/${this.data.jId}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.restApiData = response.scopeDetails; // Assuming the REST API response is an array of objects
      },
      (error: any) => {
        console.log('Error fetching data from REST API:', error);
      }
    );
  }

  zipFiles(): void {
    let path = this.jobCommonDetails.jobCommonDetails.tranFileUploadPath;
    path = path.replace(/\\/g, '_');
    const fileUrl =
      environment.apiURL + 'Allocation/DownloadZipFile?path=' + `${path}`; 
      // Replace with the actual URL of your zip file
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
  onSubmit() {
    console.log(this.selectedQureryStatus, 'status');
    if (this.selectedQureryStatus == 6) {
      this.processMovement();
    } else if (this.selectedQureryStatus == 8) {
      this.changeEstTime();
    } else {
      // Handle the case when no option is selected or handle any other condition
    }
  }

  processMovement() {
    const apiUrl = environment.apiURL + `Allocation/processMovement`;

    let saveData = {
      id: 0,
      processId: this.loginservice.getProcessId(),
      statusId: this.selectedQureryStatus,
      selectedScopeId: 0,
      autoUploadJobs: true,
      employeeId: this.loginservice.getUsername(),
      remarks: this.remarks,
      isBench: true,
      jobId: this.data.jobId,
      value: 0,
      amount: 0,
      stitchCount: 0,
      estimationTime: this.estTime !== 0 ? this.estTime : 0,
      dateofDelivery: '2023-07-01T10:02:55.095Z',
      comments: 'string',
      validity: 0,
      copyFiles: true,
      updatedBy: 0,
      jId: this.data.jId,
      estimatedTime: 0,
      tranMasterId: 0,
      selectedRows: [
        {
          customerId: this.data.customerId,
          departmentId: this.data.departmentId,
          estimatedTime: this.estimatedTime,
          jId: this.data.jId,
          tranMasterId: this.data.tranMasterId,
          Comments: '',
          TimeStamp: '',
          SelectedEmployees: '',
          JobId: '',
          FileInwardType: '',
          CommentsToClient: '',
          CategoryDesc: '',
          selectedEmployees: [],
          selectedRows: [],
        },
      ],
      selectedEmployees: [],
      departmentId: this.data.departmentId,
      updatedUTC: '2023-07-01T10:02:55.095Z',
      categoryDesc: 'string',
      allocatedEstimatedTime: 0,
      tranId: 0,
      fileInwardType: 'string',
      timeStamp: '',
      scopeId: 0,
      quotationRaisedby: 0,
      quotationraisedOn: '2023-07-01T10:02:55.095Z',
      clientId: 0,
      customerId: 0,
      fileReceivedDate: '2023-07-01T10:02:55.095Z',
      commentsToClient: 'string',
      isJobFilesNotTransfer: true,
    };
    console.log(saveData, 'savedata');
    this.http.post<any>(apiUrl, saveData).subscribe((response) => {
      if (response.success === true) {
        Swal.fire('Done!', response.message, 'success');
      } else if (response.success === false) {
        Swal.fire('Error!', response.message, 'error');
      }
    });
  }

  changeEstTime() {
    let estTimeData = {
      id: 0,
      processId: this.data.processId,
      statusId: this.selectedQureryStatus,
      selectedScopeId: 0,
      autoUploadJobs: true,
      employeeId: this.loginservice.getUsername(),
      remarks: this.remarks,
      isBench: true,
      jobId: this.data.jobId,
      value: 0,
      amount: 0,
      stitchCount: 0,
      dateofDelivery: '2023-07-01T11:15:03.552Z',
      comments: 'string',
      validity: 0,
      copyFiles: true,
      updatedBy: this.loginservice.getUsername(),
      jId: this.data.jId,
      estimatedTime: this.estimatedTime,
      tranMasterId: this.data.tranMasterId,
      selectedRows: [
        {
          customerId: this.data.customerId,
          departmentId: this.data.departmentId,
          estimatedTime: this.estimatedTime,
          jId: this.data.jId,
          tranMasterId: this.data.tranMasterId,
          Comments: '',
          TimeStamp: '',
          SelectedEmployees: '',
          JobId: '',
          FileInwardType: '',
          CommentsToClient: '',
          CategoryDesc: '',
          selectedEmployees: [],
          selectedRows: [],
        },
      ],
      selectedEmployees: [],
      departmentId: this.data.departmentId,
      updatedUTC: '2023-07-01T11:15:03.552Z',
      categoryDesc: 'string',
      allocatedEstimatedTime: 0,
      tranId: 0,
      fileInwardType: 'string',
      timeStamp: '',
      scopeId: 0,
      quotationRaisedby: 0,
      quotationraisedOn: '2023-07-01T11:15:03.552Z',
      clientId: 0,
      customerId: 0,
      fileReceivedDate: '2023-07-01T11:15:03.553Z',
      commentsToClient: 'string',
      isJobFilesNotTransfer: true,
    };
    this.http
      .post<any>(environment.apiURL + 'Allocation/processMovement', estTimeData)
      .subscribe(
        (response) => {
          if (response.success === true) {
            Swal.fire(
              'Done!',
              'Job Sent As Query Successfully!',
              'success'
            ).then((result) => {
              if (result.isConfirmed) {
                this.dialogRef.close();
              }
            });
          } else if (response.success === false) {
            Swal.fire('Done!', 'Job Sent As Query', 'error');
          }
          console.log(response);

          // Handle the API response
        },
        (error) => {
          Swal.fire('info', error, 'info');

          // Handle the API error
        }
      );
  }

  //////////////////Popupsubmit///////////////////
  getQueryDetailList() {
    console.log(this.jobCommonDetails.jobCommonDetails.jid, 'jobcommondetails');

    this.http
      .get<any>(
        environment.apiURL +
          `Allocation/GetQuerySPDetailsForQA/${this.jobCommonDetails.jobCommonDetails.jid}`
      )
      .subscribe((result) => {
        this.QueryDetailsList = result;
      });
  }

  postQueryData() {
    console.log(this.jobCommonDetails, 'JobCommonDetails');

    if (this.selectedQureryStatus == 100) {
      var changeEstimatedTime = {
        EmployeeId: '',
        TranMasterId: this.jobCommonDetails.tranMasterId,
        JId: this.jobCommonDetails.jobCommonDetails.jid,
        EstimatedTime: this.estimatedTime,
        ProcessId: 3,
        UpdatedBy: this.loginservice.getUsername(),
      };
      this.http
        .post<any>(
          environment.apiURL + 'Allocation/changeEstimatedTime',
          changeEstimatedTime
        )
        .subscribe((result) => {
          if (result.Success) {
            Swal.fire('info!', 'Estimated Time Updated!', 'info');
          } else {
            Swal.fire('info!', 'Estimated Time Not Updated!', 'info');
          }
        });
    } else {
      this.selectedJobs = [
        {
          DepartmentId: this.data.deptartmentId,
          TranMasterId: this.jobCommonDetails?.tranMasterId,
          JId: this.jobCommonDetails.jobCommonDetails.jid,
          CustomerId: this.jobCommonDetails.jobCommonDetails.customerId,
          JobId: '',
          Comments: '',
          TimeStamp: '',
          CategoryDesc: '',
          SelectedRows: [],
          FileInwardType: '',
          CommentsToClient: '',
          SelectedEmployees: [],
        },
      ];
      var estime;
      var scopeid;
      var stitchCount;
      // this.getQueryDetailList();
      if (this.QueryDetailsList == undefined || this.QueryDetailsList == null) {
        estime = this.estimationTime;
        scopeid = this.selectedScope;
        if (
          this.data.deptartmentId == 2 &&
          this.jobCommonDetails.scopeId == null &&
          scopeid == undefined
        ) {
          // scopeid = 21; //
          stitchCount = this.stitchCount;
        } else if (
          this.data.deptartmentId == 2 &&
          this.jobCommonDetails.scopeId != null &&
          scopeid == undefined
        ) {
          scopeid = this.jobCommonDetails.scopeId;
          stitchCount = $('#stitchCountForSP').val();
        }
      } else {
        estime = this.estimatedTime;
        stitchCount = $('#stitchCountForSP').val();
        //if ($scope.QueryDetailsList.Scope == undefined) {
        //    scopeid = $scope.QueryDetailsList.ScopeId
        //}
        //else {
        //     scopeid = $scope.QueryDetailsList.Scope.Id;
        //}
        scopeid = this.QueryDetailsList.scopeId;
      }
      //alert(JSON.stringify(scopeid));
      var processMovement = {
        selectedRows: this.selectedJobs,
        JobId: this.data.jobId,
        EmployeeId: this.loginservice.getUsername(),
        StatusId: this.selectedQureryStatus,
        Remarks: this.remarks,
        ProcessId: this.data.processId,
        Value: estime,
        SelectedScopeId: scopeid,
        StitchCount: stitchCount,
        FileReceivedDate: this.jobCommonDetails.fileReceivedDate,

        //////alreadypayload//
        autoUploadJobs: true,
        employeeId: this.loginservice.getUsername(),

        isBench: true,
        value: 0,
        amount: 0,
        stitchCount: 0,
        estimationTime: this.estTime !== 0 ? this.estTime : 0,
        dateofDelivery: '2023-07-01T10:02:55.095Z',
        comments: '',
        validity: 0,
        copyFiles: true,
        updatedBy: 0,
        jId: this.data.jId,
        estimatedTime: 0,
        tranMasterId: 0,
        // customerId:'',
        // DepartmentId:0

        selectedEmployees: [],
        departmentId: 0,
        updatedUTC: new Date().toISOString,
        categoryDesc: '',
        allocatedEstimatedTime: 0,
        tranId: 0,
        fileInwardType: 'string',
        timeStamp: '',
        scopeId: 0,
        quotationRaisedby: 0,
        quotationraisedOn: '2023-07-01T10:02:55.095Z',
        clientId: 0,
        customerId: 0,
        commentsToClient: '',
        isJobFilesNotTransfer: true,
      };
      this.http
        .post<any>(
          environment.apiURL + `Allocation/processMovement`,
          processMovement
        )
        .subscribe(
          (result) => {
            this.confirmationMessage = result.message;
            Swal.fire(result.message);
          },
          (error) => {
            Swal.fire('Error!', 'Error occured', 'error');
          }
        );
    }
  }

  ////////////Statuschange//////////
  // StatusChange() {
  //   if (this.selectedQureryStatus == 8) {
  //     if (this.jobCommonDetails.processId == 4) {
  //       this.EstimatedTime = true;
  //       this.remarksdata = true;
  //       this.EmployeData = true;
  //       this.http.get<any>(environment.apiURL + `Allocation/GetQuerySPDetailsForQA/${this.jobCommonDetails.jobCommonDetails.jid}`).subscribe(result => {
  //         this.QueryDetailsList = result;
  //       })
  //     }
  //     else if (this.jobCommonDetails.processId == 6) {
  //       this.EstimatedTime = true;
  //       this.remarksdata = true;
  //       this.EmployeData = true;
  //       this.http.get<any>(environment.apiURL + `Allocation/GetQuerySPDetailsForQA/${this.jobCommonDetails.jobCommonDetails.jid}`).subscribe(result => {
  //         this.QueryDetailsList = result;
  //       })
  //     }
  //     else {
  //       var datas = {
  //         WFTId: this.jobCommonDetails.tranId,
  //         WFMId: this.jobCommonDetails.tranMasterId,
  //         JId: this.jobCommonDetails.jId
  //       }
  //       this.http.post<any>(environment.apiURL + `ClientOrderService/QueryDetailspost`, datas).subscribe(result => {
  //         this.QueryDetailsList = result.querylist;
  //         if (this.QueryDetailsList == null) {
  //           this.EstimatedTime = true;
  //           this.remarksdata = true;
  //           this.EmployeData = true;
  //         }
  //         else {
  //           this.remarksdata = true;
  //           this.EstimatedTime = false;
  //           this.EmployeData = false;
  //         }
  //       });
  //     }
  //   }
  // }
}
