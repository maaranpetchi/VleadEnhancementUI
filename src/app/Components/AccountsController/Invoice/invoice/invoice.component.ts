import { Component, OnInit, ViewChild } from '@angular/core';
import { PopupinvoiceComponent } from '../popupinvoice/popupinvoice.component';
import { environment } from 'src/Environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { PricingcalculationService } from 'src/app/Services/AccountController/PricingCalculation/pricingcalculation.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';
import { DetailsComponent } from '../details/details.component';
import { LoginService } from 'src/app/Services/Login/login.service';
import Swal from 'sweetalert2/src/sweetalert2.js'
import { catchError } from 'rxjs';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  clientId: any;

  // Paginator for Table 1
  @ViewChild('table1Paginator') table1Paginator: MatPaginator;

  // Paginator for Table 2
  @ViewChild('table2Paginator') table2Paginator: MatPaginator;


  constructor(private http: HttpClient, private loginservice: LoginService, private _empService: PricingcalculationService, private dialog: MatDialog, private spinnerService: SpinnerService) { }

  displayedColumns: string[] = [
    'selected',
    'Client',
    'Jobid',
    'Jobdate',
    'FileName',
    'ProjectCode',
    'Department',
    'JobStatus',
    'scope',
    'StitchCount',
    'estimatedtime',
    'rate',
    'ESTFileReceivedDate',
    'ESTDateofUpload',
    'nonbillableupload'
  ];





  employeeFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  selectedInvoices: any[] = [];
  setAll(completed: boolean, item: any) {

    if (completed == true) {
      this.selectedInvoices.push(item)
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

  }



  selectedGeneratedInvoices: any[] = [];
  setGeneratedAll(completed: boolean, item: any) {

    if (completed == true) {
      this.selectedGeneratedInvoices.push({ ...item, BillingCycleType: item.BillingCycleType ? item.BillingCycleType : 0, specialPrice: item.specialPrice ? item.specialPrice : 0 })
    }
    else {

      if (this.selectedGeneratedInvoices.find(x => x.id == item.id)) {
        this.selectedGeneratedInvoices = this.selectedGeneratedInvoices.filter(x => {
          if (x.id != item.id) {
            return item
          }
        })
      }
    }

  }



  openDialog() {
    let clientid = 0;
    if (this.selectedInvoices.length == 0) {
      Swal.fire(
        'Alert!',
        'Please select the list item!',
        'info'
      )
    }
    else {
      let temporaryarray: any[] = [];
      clientid = parseInt(this.myForm?.value.ClientId ? this.myForm?.value.ClientId : "0")
      let createdby = 152;
      temporaryarray = this.selectedInvoices.map(x => {
        return {
          "jobId": x.jobId,
          "shortName": x.shortName,
          "scopeId": x.scopeId,
          "scopeDesc": "string",
          "clientId": x.clientId,
          "billingCycleType": x.billingCycleType,
          "dateofUpload": x.dateofUpload,
          "createdBy": 152,
          "departmentId": x.departmentId,
          "tranId": 0,
          "id": x.id,
          "jId": x.jId,
          "pricingTypeId": 0,
          "getInvoice": [],

          "fileReceivedDate": x.fileReceivedDate,
          "isBillable": x.isBillable,
          "specialPrice": x.specialPrice ? x.specialPrice : 0,
          "estimatedTime": x.estimatedTime,
          "isWaiver": true,
          "jobStatusId": 0
        }
      })

      let result: any = {
        "jobId": "string",
        "shortName": "string",
        "scopeId": 0,
        "scopeDesc": "string",
        "clientId": this.myForm.value?.ClientId,
        "billingCycleType": "string",
        "dateofUpload": "2023-04-06T08:51:10.069Z",
        "createdBy": 152,
        "departmentId": 0,
        "tranId": 0,
        "id": 0,
        "jId": 0,
        "pricingTypeId": 0,
        "getInvoice": temporaryarray,
        "fileReceivedDate": "2023-04-06T08:51:10.069Z",
        "isBillable": true,
        "specialPrice": 0,
        "estimatedTime": 0,
        "isWaiver": true,
        "jobStatusId": 0
      }
      this.onInvoiceCalculation(result)
    }

  }



  ngOnInit(): void {
    this.getClient();
    this.getConfirmInvoiceTable();
  }
  getClient() {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + 'Invoice/GetClient').subscribe(data => {
      this.spinnerService.requestEnded();
      this.data = data;
      this.ClientGeneratedata = data;
    }, error => {
      this.spinnerService.resetSpinner();
    });
  }
  data: any = {
    clientList: [],
  };
  ClientGeneratedata: any = {
    clientList: [],
  };

  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;

  myForm = new FormGroup({

    fromDate: new FormControl("", Validators.required),
    toDate: new FormControl("", Validators.required),
    ClientId: new FormControl("", Validators.required)
  });





  getEmployeeList() {
    this.spinnerService.requestStarted();
    this._empService.getEmployeeList().subscribe({

      next: (res) => {
        this.spinnerService.requestEnded();
        this.dataSource = new MatTableDataSource(res);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.table1Paginator;


      }
    });
  }
  onSubmit() {
    // Call the API to get the search results
    this.spinnerService.requestStarted();
    this.http.post<any>(environment.apiURL + 'Invoice/GetClientDetails', {
      "clientId": this.myForm.value?.ClientId,
      "fromDate": this.myForm.value?.fromDate,
      "toDate": this.myForm.value?.toDate
    }).pipe(catchError((error) => {
      this.spinnerService.requestEnded();
      return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
    })).subscribe((results: any) => {
      // Set the search results in the data source
      this.spinnerService.requestEnded();
      this.dataSource.data = results.getInvoice;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.table1Paginator;

    }
    )
  }

  onInvoiceCalculation(item: any) {
    // Call the API to get the search results
    this.spinnerService.requestStarted();
    this.http.post<any>(environment.apiURL + 'Invoice/GenerateInvoice', item).pipe(catchError((error) => {
      this.spinnerService.requestEnded();
      return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
    })).subscribe((results: any) => {
      // Set the search results in the data source
      this.spinnerService.requestEnded();

      Swal.fire(
        '',
        results.stringList,
        'success'
      ).then((response)=>{
        if(response.isConfirmed){
          this.ngOnInit()
        }
      })
    }
    )
  }

  ///Genrated Invoice
  Clientid: any;
  GenratedInvoicedataSource = new MatTableDataSource();
  displayedGenaratedInvoiceColumns: string[] = [
    'selected', 'Client', 'JobId', 'JobDate', 'FileName', 'ProjectCode',
    'Department', 'JobStatus', 'Scope', 'StitchCount',
    'EstimatedTime', 'PricingType', 'ESTFileReceived', 'ESTDateofUpload',
    'Rate'
  ];

  getGeneratedInvoice() {
    let payload = {
      "clientId": this.ClientGeneratedId
    }
    this.spinnerService.requestStarted();

    this.http.post<any>(environment.apiURL + `Invoice/GetCalculatedPrice`, payload).pipe(catchError((error) => {
      this.spinnerService.requestEnded();
      return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
    })).subscribe(result => {
      this.spinnerService.requestEnded();
      this.GenratedInvoicedataSource.data = result.getInvoice;
      this.GenratedInvoicedataSource.paginator = this.table1Paginator;
    })
  }

  ///confirm invoicr////
  ConfirmInvoicedataSource = new MatTableDataSource();

  getConfirmInvoiceTable() {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `Invoice/GetAllInvoiceMasterDetails`).pipe(catchError((error) => {
      this.spinnerService.requestEnded();
      return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
    })).subscribe(results => {
      this.spinnerService.requestEnded();
      this.ConfirmInvoicedataSource = new MatTableDataSource(results.getInvoice);
      this.ConfirmInvoicedataSource.sort = this.sort;
      this.ConfirmInvoicedataSource.paginator = this.table2Paginator;
    })
  }

  displayedConfirmInvoiceColumns: string[] = [
    'Client', 'InvoiceNo', 'InvoiceDate', 'ProductValue', 'WaiverAmount',
    'RoundOff', 'ArtInvoiceAmount', 'DigiInvoiceAmount', 'Invoice',
    'Discount', 'ArtPayableAmount', 'ArtFileCount', 'DigiPayableAmount',
    'DigiFileCount', 'Payable', 'PaymentMode'
  ];

  openConfirmDialog(data) {

    const dialogRef = this.dialog.open(DetailsComponent, {
      data
    });


    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getConfirmInvoiceTable();

        }
      },
    });
  }
  ClientGeneratedId: any;
  btnSubmitRecalculate() {

    if (this.ClientGeneratedId == undefined || this.ClientGeneratedId == null) {
      Swal.fire(
        'Alert!',
        'Please Select a Client.',
        'info'
      )
    }
    else {

      if (this.selectedGeneratedInvoices.length == 0) {
        Swal.fire(
          'Alert!',
          'Please Select a Items.',
          'info'
        )
      }
      else {
        let payload = {
          "jobId": "string",
          "shortName": "string",
          "scopeId": 0,
          "scopeDesc": "string",
          "clientId": this.ClientGeneratedId,
          "billingCycleType": "string",
          "dateofUpload": "2023-08-21T11:59:16.821Z",
          "createdBy": this.loginservice.getUsername(),
          "departmentId": 0,
          "tranId": 0,
          "id": 0,
          "jId": 0,
          "pricingTypeId": 0,
          "getInvoice": this.selectedGeneratedInvoices,
          "fileReceivedDate": "2023-08-21T11:59:16.821Z",
          "isBillable": true,
          "specialPrice": 0,
          "estimatedTime": 0,
          "isWaiver": true,
          "jobStatusId": 0
        }
        this.spinnerService.requestStarted();

        this.http.post<any>(environment.apiURL + `Invoice/GenerateReCalculateInvoice`, payload).pipe(catchError((error) => {
          this.spinnerService.requestEnded();
          return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
        })).subscribe(results => {
          this.spinnerService.requestEnded();

          Swal.fire(
            'Done!',
            results.stringList,
            'success'
          )
        })
      }
    }

  }


  btnSubmitConfirm() {
    if (this.selectedGeneratedInvoices.length == 0) {
      Swal.fire(
        'Alert!',
        'Please Select the Items',
        'info'
      )
    }
    else {
      let payload = {
        "jobId": "string",
        "shortName": "string",
        "scopeId": 0,
        "scopeDesc": "string",
        "clientId": this.clientId,
        "billingCycleType": "string",
        "dateofUpload": "2023-08-21T13:54:54.873Z",
        "createdBy": this.loginservice.getUsername(),
        "departmentId": 0,
        "tranId": 0,
        "id": 0,
        "jId": 0,
        "pricingTypeId": 0,
        "getInvoice": this.selectedGeneratedInvoices,
        "fileReceivedDate": "2023-08-21T13:54:54.873Z",
        "isBillable": true,
        "specialPrice": 0,
        "estimatedTime": 0,
        "isWaiver": true,
        "jobStatusId": 0
      }
      this.spinnerService.requestStarted();
      this.http.post<any>(environment.apiURL + `Invoice/GenerateConfirmInvoice`, payload).pipe(catchError((error) => {
        this.spinnerService.requestEnded();
        return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
      })).subscribe(results => {
        this.spinnerService.requestEnded();

        if (results.stringList = "VoucherControl is Missing") {
          Swal.fire(
            'alert!',
            results.stringList,
            'info'
          )
        }
        else {
          Swal.fire(
            'Done!',
            results.stringList,
            'success'
          )
        }
      })
    }
  }

}