import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PricingcalculationService } from 'src/app/Services/AccountController/PricingCalculation/pricingcalculation.service';
import { InformationpopupComponent } from '../Dialogpop/informationpopup/informationpopup.component';
import { log } from 'console';
import { environment } from 'src/Environments/environment';
import { LoginService } from 'src/app/Services/Login/login.service';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Component({
  selector: 'app-pricingcalculation',
  templateUrl: './pricingcalculation.component.html',
  styleUrls: ['./pricingcalculation.component.scss']
})
export class PricingcalculationComponent implements OnInit {
  getClientId: any[] = [];


  constructor(private http: HttpClient, private _empService: PricingcalculationService, private dialog: MatDialog, private loginservice: LoginService, private spinnerService: SpinnerService) { }

  displayedColumns: string[] = [
    'selected',
    'ClientName',
    'Jobid',
    'FileName',
    'Department',
    'ProjectCode',
    'SpecialPrice',
    'scope',
    'JobStatus',
    'StitchCount',
    'ESTFileReceivedDate',
    'ESTDateofUpload'
  ];

  selectedInvoices: any[] = [];



  employeeFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
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



  ngOnInit(): void {
    this.getClient();

  }


  getClient() {
    //client name dropdown
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + 'Invoice/GetClient').subscribe(data => {
      this.spinnerService.requestEnded();
      this.data = data;
    }, error => {
      this.spinnerService.resetSpinner();
    });
  }

  data: any = {
    clientList: [],
  };

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  myForm = new FormGroup({

    fromDate: new FormControl("", Validators.required),
    toDate: new FormControl("", Validators.required),
    ClientId: new FormControl("", Validators.required)
  });




  openDialog() {
    let clientid = 0;
    if (this.selectedInvoices.length == 0) {
      Swal.fire(
        'Alert!',
        'Please Select the Items!',
        'warning'
      )

    }
    else {
      let temporaryarray: any[] = [];
      clientid = parseInt(this.myForm?.value.ClientId ? this.myForm?.value.ClientId : "0")
      temporaryarray = this.selectedInvoices.map(x => {
        return {
          "jobId": x.jobId,
          "shortName": x.shortName,
          "scopeId": x.scopeId,
          "scopeDesc": "string",
          "clientId": x.clientId,
          "billingCycleType": x.billingCycleType,
          "dateofUpload": x.dateofUpload,
          "createdBy": this.loginservice.getUsername(),
          "departmentId": x.departmentId,
          "tranId": 0,
          "id": x.id,
          "jId": x.jId,
          "pricingTypeId": 0,
          "getInvoice": [],

          "fileReceivedDate": x.fileReceivedDate,
          "isBillable": x.isBillable,
          "specialPrice": x.specialPrice,
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
        "createdBy": this.loginservice.getUsername(),
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

  getEmployeeList() {
    this._empService.getEmployeeList().subscribe({

      next: (res) => {

        this.dataSource = new MatTableDataSource(res);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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
    }).subscribe((results: any) => {
      this.spinnerService.requestEnded();
      this.dataSource.data = results.getInvoice;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    )
  }

  onInvoiceCalculation(item: any) {
    // Call the API to get the search results
    this.spinnerService.requestStarted();
    this.http.post<any>(environment.apiURL + 'Invoice/GetCalculatedInvoice', item).subscribe((results: any) => {
      this.spinnerService.requestEnded();
      Swal.fire(
        'Done!',
        results.stringList,
        'success'
      ).then((result) => {
        if (result.isConfirmed) {
          this.getEmployeeList();
        }
      })
    }, error => {
      this.spinnerService.resetSpinner();
    }
    )
  }
}