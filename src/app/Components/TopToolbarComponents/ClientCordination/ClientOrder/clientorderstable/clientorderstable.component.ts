import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FileconvertComponent } from './fileconvert/fileconvert.component';
import { ClientdetailspopupComponent } from '../clientdetailspopup/clientdetailspopup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientorderviewComponent } from '../clientorderview/clientorderview.component';
import { environment } from 'src/Environments/environment';
@Component({
  selector: 'app-clientorderstable',
  templateUrl: './clientorderstable.component.html',
  styleUrls: ['./clientorderstable.component.scss']
})
export class ClientorderstableComponent {


  @ViewChild('popupComponent') popupComponent: ElementRef;
  @Output() showAlertEvent: EventEmitter<any> = new EventEmitter();

  DivisionApiData: any[];
  selectdivision: number = 0;

  displayedColumns: string[] = [
    'selected',
    'client',
    'customerSatisfaction',
    'fileName',
    'fileReceivedEstDate',
    'department',
    'quoteparentid',
    'instruction',
    'salespersonname',
    'transactiontype',
    'action',
    'filecount'
  ];

  visibility() {
    let result: string[] = [];
    if (this.displayedColumnsvisibility.selected) {
      result.push('selected');
    }

    if (this.displayedColumnsvisibility.jobid) {
      result.push('jobid');
    }
    if (this.displayedColumnsvisibility.client) {
      result.push('client');
    }
    if (this.displayedColumnsvisibility.customerSatisfaction) {
      result.push('customerSatisfaction');
    }
    if (this.displayedColumnsvisibility.fileName) {
      result.push('fileName');
    }
    if (this.displayedColumnsvisibility.fileReceivedEstDate) {
      result.push('fileReceivedEstDate');
    }
    if (this.displayedColumnsvisibility.department) {
      result.push('department');
    }
    if (this.displayedColumnsvisibility.quoteparentid) {
      result.push('quoteparentid');
    }
    if (this.displayedColumnsvisibility.instruction) {
      result.push('instruction');
    }
    if (this.displayedColumnsvisibility.salespersonname) {
      result.push('salespersonname');
    }
    if (this.displayedColumnsvisibility.transactiontype) {
      result.push('transactiontype');
    }
    if (this.displayedColumnsvisibility.action) {
      result.push('action');
    }
    if (this.displayedColumnsvisibility.fileInwardMode) {
      result.push('fileInwardMode');
    }
    if (this.displayedColumnsvisibility.filecount) {
      result.push('filecount');
    }
    return result;
  }


  displayedColumnsvisibility: any = {
    'selected': true,
    'jobid': false,
    'client': true,
    'customerSatisfaction': true,
    'fileName': true,
    'fileReceivedEstDate': true,
    'department': true,
    'quoteparentid': true,
    'instruction': true,
    'salespersonname': true,
    'transactiontype': true,
    'action': true,
    'actionicon': true,
    'fileInwardMode': false,
    'filecount': true,
  };
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // //DivisionApiDatadropdown
    this.fetchdivision();

    this.bindingjobs();
  }

  fetchdivision() {
    this.http.get<any>(environment.apiURL+'ClientOrderService/nGetDivisionForJO').subscribe(data => {
      this.DivisionApiData = data;
    });
  }

  //to save the checkbox values
  selectedproduction: any[] = [];
  setAll(completed: boolean, item: any) {

    console.log("before", this.selectedproduction)
    if (completed == true) {
      this.selectedproduction.push(item)
    }
    else {

      if (this.selectedproduction.find(x => x.id == item.id)) {
        this.selectedproduction = this.selectedproduction.filter(x => {
          if (x.id != item.id) {
            return item
          }
        })
      }
    }
    console.log("after", this.selectedproduction)
  }

  bindingjobs() {
    this.http.get<any>(environment.apiURL+'ClientOrderService/ClientOrdersExts/1').subscribe(binddata => {
      this.dataSource = binddata.data;
      this.displayedColumnsvisibility.fileCount = true;
      this.displayedColumnsvisibility.actionicon = true;
      this.displayedColumnsvisibility.fileInwardMode = false;
      this.displayedColumnsvisibility.transactionType = true;
      this.displayedColumnsvisibility.quoteparentid = true;
      this.displayedColumnsvisibility.transactiontype = true;
      this.displayedColumnsvisibility.action = true;
      this.displayedColumnsvisibility.jobid = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);

    });
  }
  quotationjobs() {
    this.http.get<any>(environment.apiURL+'ClientOrderService/ClientOrdersExts/2').subscribe(quotation => {
      this.dataSource = new MatTableDataSource(quotation.data),
        this.displayedColumnsvisibility.jobid = false;
      this.displayedColumnsvisibility.transactionType = true;
      this.displayedColumnsvisibility.quoteparentid = true;
      this.displayedColumnsvisibility.action=true;
      this.displayedColumnsvisibility.actionicon=true;
      this.displayedColumnsvisibility.transactiontype = true;
      this.displayedColumnsvisibility.fileInwardMode = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);

    });
  }
  convertedjobs() {
    this.http.get<any>(environment.apiURL+'ClientOrderService/ClientOrdersExts/3').subscribe(converted => {
      this.dataSource = new MatTableDataSource(converted.data);
      this.displayedColumnsvisibility.actionicon = false;
      this.displayedColumnsvisibility.transactionType = true;
      this.displayedColumnsvisibility.jobid = false;
      this.displayedColumnsvisibility.quoteparentid = true;
      this.displayedColumnsvisibility.action=true;
      this.displayedColumnsvisibility.transactiontype = true;
      this.displayedColumnsvisibility.fileInwardMode = false;
      this.displayedColumnsvisibility.filecount = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    });
  }
  deletedjobs() {
    this.http.get<any>(environment.apiURL+'ClientOrderService/ClientOrdersExts/4').subscribe(deleted => {
      this.dataSource = new MatTableDataSource(deleted.data)
      this.displayedColumnsvisibility.filecount = false;
      this.displayedColumnsvisibility.transactionType = true;
      this.displayedColumnsvisibility.jobid = false;
      this.displayedColumnsvisibility.quoteparentid = true;
      this.displayedColumnsvisibility.action=true;
      this.displayedColumnsvisibility.actionicon=false;
      this.displayedColumnsvisibility.transactiontype = true;
      this.displayedColumnsvisibility.fileInwardMode = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    });
  }
  quotenotapprovaljobs() {
    this.http.get<any>(environment.apiURL+'ClientOrderService/ClientOrdersExts/5').subscribe(quotenotapproval => {
      this.displayedColumnsvisibility.filecount = false;
      this.displayedColumnsvisibility.transactionType = true;
      this.displayedColumnsvisibility.jobid = false;
      this.displayedColumnsvisibility.fileInwardMode = false;
      this.displayedColumnsvisibility.action=true;
      this.displayedColumnsvisibility.actionicon=false;
      this.dataSource = new MatTableDataSource(quotenotapproval.data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      console.log(quotenotapproval.data, "QUotanotapproval")
    });
  }
  queryforsp() {
    this.http.get<any>(environment.apiURL+'CustomerQuery/GetNotApprovedQueryForSPJobsToCC').subscribe(queryforsp => {
      this.displayedColumnsvisibility.filecount = false;
      this.displayedColumnsvisibility.jobid = true;
      this.displayedColumnsvisibility.quoteparentid = false;
      this.displayedColumnsvisibility.transactiontype = false;
      this.displayedColumnsvisibility.action = false;
      this.displayedColumnsvisibility.transactionType = false;
      this.displayedColumnsvisibility.fileInwardMode = true;
      this.dataSource = new MatTableDataSource(queryforsp.data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  tab(action) {
    if (action == '1') {
      this.bindingjobs();
    }
    else if (action == '2') {
      this.quotationjobs();
    }
    else if (action == '3') {
      this.convertedjobs();
    }
    else if (action == '4') {
      this.deletedjobs();
    }
    else if (action == '5') {
      this.quotenotapprovaljobs();
    }
    else if (action == '6') {
      this.queryforsp();
    }

  }

  fileCount: number;

  openPopup(fileCount, row) {
    // Create an instance of the dialog component
    const dialogRef = this.dialog.open(FileconvertComponent, {
      width: '100vw',
      data: {
        fileCount: fileCount, row: row, divisionid: this.selectdivision
      }
    });

    // Subscribe to the afterClosed event to handle dialog close actions
    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed, if needed
    });
  }

  handleKeyPress(event: KeyboardEvent, job: any) {
    const enteredNumber = (event.target as HTMLInputElement).value;
    console.log("enter value", enteredNumber)

    if (event.key === 'Enter') {
      this.openPopup(enteredNumber, job);
      console.log(event, "event");
      console.log(job, "job");
    }
  }

  getselecteddivisions() {
    return this.selectdivision;
  }
  singleconvert(data: any) {
    //added co if starts
    let GetAllvalues = data;
    let Gridwithmultiplefilesname: any[] = [];
    console.log(data, "GETTINGDATA");

    let GetAddList =
    {
      FileName: GetAllvalues.fileName,
      PoNo: GetAllvalues.poNo,
      PODate: GetAllvalues.poDate,
      Remarks: GetAllvalues.instruction,
      SalesPersonName: GetAllvalues.salesPersonName,
      JobStatusId: GetAllvalues.jobStatusId,
      TransactionId: GetAllvalues.transactionType,
      DepartmentId: GetAllvalues.workType,
      ClientId: GetAllvalues.clientId,
      EmployeeId: 152,
      FileReceivedDate: GetAllvalues.fileReceivedDate,
      ClientOrderId: GetAllvalues.orderId,
      CCId: GetAllvalues.ccId,//
      CCEmailId: GetAllvalues.ccEmailId,//
      FileInwardTypeId: GetAllvalues.fileInwardTypeId,//
      DivisionId: this.getselecteddivisions(),// //
      getAllValues: [],
      ApparelLogoLocation: 'apparel',
      poNo: "string",
      clientName: "string",
      clientJobId: "string",
      jobStatusDescription: "string",
      username: "string",
      clientSalesPerson: "string",
      customerName: "string",
      temp: "string",
      style: "string",
      projectCode: "string",
      teamCode: "string",
      schoolName: "string",
      ground: "string",
      gender: "string",
      fileInwardMode: "string",
      jobDescription: "string",
      color: "string",
      logoDimensionWidth: "string",
      logoDimensionsLength: "string",
      apparelLogoLocation: "string",
      imprintColors1: "string",
      imprintColors2: "string",
      imprintColors3: "string",
      virtualProof: "string",

      customerJobType: "string",

      viewDatas: [],

    }
    Gridwithmultiplefilesname.push(GetAddList);
    let senddata = {
      "id": 0,
      "dateofReceived": "2023-05-12T07:08:03.495Z",
      "clientName": "string",
      "clientJobId": "string",
      "fileName": "string",
      "jobStatusDescription": "string",
      "username": "string",
      "salesPersonName": "string",
      "clientSalesPerson": "string",
      customerName: "string",
      "temp": "string",
      "style": "string",
      "projectCode": "string",
      "teamCode": "string",
      "schoolName": "string",
      ground: "string",
      gender: "string",
      fileInwardMode: "string",
      "status": true,
      "fileReceivedDate": "2023-05-12T07:08:03.495Z",
      "jobDescription": "string",
      "jobStatusId": 0,
      "departmentId": 0,
      "divisionId": 0,
      "employeeId": 0,
      "clientId": 0,
      "remarks": "string",
      "poNo": "string",
      "fileInwardTypeId": 0,
      "color": "string",
      "logoDimensionWidth": "string",
      "logoDimensionsLength": "string",
      "apparelLogoLocation": "string",
      imprintColors1: "string",
      imprintColors2: "string",
      imprintColors3: "string",
      "virtualProof": "string",
      "dateofUpload": "2023-05-12T07:08:03.495Z",
      "dateofClose": "2023-05-12T07:08:03.495Z",
      "customerJobType": "string",
      "jobDate": "2023-05-12T07:08:03.495Z",
      "clientOrderId": 0,
      "viewDatas": [
        {
          "id": 0,
          "department": "string",
          "clientStatus": "string",
          "dateofReceived": "2023-05-12T07:08:03.495Z",
          "clientName": "string",
          "clientJobId": "string",
          "fileName": "string",
          "jobStatusDescription": "string",
          "username": "string",
          "salesPersonName": "string",
          "customerName": "string",
          "temp": "string",
          "style": "string",
          "projectCode": "string",
          "teamCode": "string",
          "schoolName": "string",
          "ground": "string",
          "gender": "string",
          "fileInwardMode": "string",
          "status": true,
          "dateofUpload": "string",
          "priority": "string",
          "clientSalesPerson": "string",
          "poNo": "string",
          "dateofDelivery": "string",
          "division": "string",
          "uploadedBy": 0
        }
      ],
      "createdBy": 0,
      "poDate": "2023-05-12T07:08:03.495Z",
      "ccId": 0,
      "ccEmailId": "string",
      "dateofDelivery": "2023-05-12T07:08:03.495Z",
      "getAllValues": Gridwithmultiplefilesname
    };

    let joborderconverted = {
      GetAllValues: Gridwithmultiplefilesname,
    }

    console.log(senddata, "fileconvertdata");

    this.http.post<any>(environment.apiURL+'JobOrder/DirectOrder', senddata).subscribe(convertdata => {
      console.log("succesfully converted data");

    })

  } // added co if ends

  multiconvert() {
    //added co if starts 
    let Gridwithmultiplefilesname: any[] = [];
    for (var i = 0; i < this.selectedproduction.length; i++) {
      let GetAllvalues = this.selectedproduction[i];
      let GetAddList =
      {
        FileName: GetAllvalues.fileName,
        PoNo: GetAllvalues.poNo,
        PODate: GetAllvalues.poDate,
        Remarks: GetAllvalues.instruction,
        SalesPersonName: GetAllvalues.salesPersonName,
        JobStatusId: GetAllvalues.jobStatusId,
        TransactionId: GetAllvalues.transactionType,
        DepartmentId: GetAllvalues.workType,
        ClientId: GetAllvalues.clientId,
        EmployeeId: 152,
        FileReceivedDate: GetAllvalues.fileReceivedDate,
        ClientOrderId: GetAllvalues.orderId,
        CCId: GetAllvalues.ccId,//
        CCEmailId: GetAllvalues.ccEmailId,//
        FileInwardTypeId: GetAllvalues.fileInwardTypeId,//
        DivisionId: this.getselecteddivisions(),// //
        getAllValues: [],
        ApparelLogoLocation: 'apparel',
        poNo: "string",
        clientName: "string",
        clientJobId: "string",
        jobStatusDescription: "string",
        username: "string",
        clientSalesPerson: "string",
        customerName: "string",
        temp: "string",
        style: "string",
        projectCode: "string",
        teamCode: "string",
        schoolName: "string",
        ground: "string",
        gender: "string",
        fileInwardMode: "string",
        jobDescription: "string",
        color: "string",
        logoDimensionWidth: "string",
        logoDimensionsLength: "string",
        apparelLogoLocation: "string",
        imprintColors1: "string",
        imprintColors2: "string",
        imprintColors3: "string",
        virtualProof: "string",

        customerJobType: "string",

        viewDatas: [],

      }

      Gridwithmultiplefilesname.push(GetAddList);
    }
    let senddata = {
      "id": 0,
      "dateofReceived": "2023-05-12T07:08:03.495Z",
      "clientName": "string",
      "clientJobId": "string",
      "fileName": "string",
      "jobStatusDescription": "string",
      "username": "string",
      "salesPersonName": "string",
      "clientSalesPerson": "string",
      customerName: "string",
      "temp": "string",
      "style": "string",
      "projectCode": "string",
      "teamCode": "string",
      "schoolName": "string",
      ground: "string",
      gender: "string",
      fileInwardMode: "string",
      "status": true,
      "fileReceivedDate": "2023-05-12T07:08:03.495Z",
      "jobDescription": "string",
      "jobStatusId": 0,
      "departmentId": 0,
      "divisionId": 0,
      "employeeId": 0,
      "clientId": 0,
      "remarks": "string",
      "poNo": "string",
      "fileInwardTypeId": 0,
      "color": "string",
      "logoDimensionWidth": "string",
      "logoDimensionsLength": "string",
      "apparelLogoLocation": "string",
      imprintColors1: "string",
      imprintColors2: "string",
      imprintColors3: "string",
      "virtualProof": "string",
      "dateofUpload": "2023-05-12T07:08:03.495Z",
      "dateofClose": "2023-05-12T07:08:03.495Z",
      "customerJobType": "string",
      "jobDate": "2023-05-12T07:08:03.495Z",
      "clientOrderId": 0,
      "viewDatas": [
        {
          "id": 0,
          "department": "string",
          "clientStatus": "string",
          "dateofReceived": "2023-05-12T07:08:03.495Z",
          "clientName": "string",
          "clientJobId": "string",
          "fileName": "string",
          "jobStatusDescription": "string",
          "username": "string",
          "salesPersonName": "string",
          "customerName": "string",
          "temp": "string",
          "style": "string",
          "projectCode": "string",
          "teamCode": "string",
          "schoolName": "string",
          "ground": "string",
          "gender": "string",
          "fileInwardMode": "string",
          "status": true,
          "dateofUpload": "string",
          "priority": "string",
          "clientSalesPerson": "string",
          "poNo": "string",
          "dateofDelivery": "string",
          "division": "string",
          "uploadedBy": 0
        }
      ],
      "createdBy": 0,
      "poDate": "2023-05-12T07:08:03.495Z",
      "ccId": 0,
      "ccEmailId": "string",
      "dateofDelivery": "2023-05-12T07:08:03.495Z",
      "getAllValues": Gridwithmultiplefilesname
    };
    this.http.post<any>(environment.apiURL+'JobOrder/DirectOrder', senddata).subscribe(multiorder => {
      this.showSnackBar("succesfully Bulk converted data");
 
    })
  }


  clientDetailsPop(id) {
    this.dialog.open(ClientdetailspopupComponent, {
      width: '100vw',
      data: {
        id: id
      }
    });


  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      verticalPosition: 'top' // Position of the snack bar
    });
  }


  openclientorder(job) {
    const dialogRef = this.dialog.open(ClientorderviewComponent, {
      width: '50vw',
      height: 'auto',
      data: job,

    });
    console.log(job, "jobdata");
  }


}



