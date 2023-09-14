import { HttpClient } from '@angular/common/http';
import { ResourceLoader } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { LoginService } from 'src/app/Services/Login/login.service';
import { CustomerSalesApprovalService } from 'src/app/Services/sales/CustomerSalesApproval/customer-sales-approval.service';
import Swal from 'sweetalert2/src/sweetalert2.js'


@Component({
  selector: 'app-sales-multi-step-form',
  templateUrl: './sales-multi-step-form.component.html',
  styleUrls: ['./sales-multi-step-form.component.scss']
})
export class SalesMultiStepFormComponent implements OnInit {
  customerProfile: FormGroup;
  CustomerVsScope: FormGroup;
  customerVsTAT: FormGroup;
  apiResponseData: any;
  CountryId: any;
  timezone: any;
  AppCustomerDetails: any;


  dataSource: MatTableDataSource<any>;
  customertatdatasource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['customername', 'department', 'scope', 'status', 'Action'];
  displayedTATColumns: string[] = ['customernametat', 'customershortnametat', 'jobstatustat', 'tat', 'Actiontat'];
  customertatinput: any;
  selectedScopeID: any;
  selectedDeptDescription: any;
  selectedJobStatusID: any;
  selectedJobStatusDescription: any;
  customerTatid: any;
  employeeFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.apiResponseData = this.sharedDataService.getData();
    this.fetchUpdateData();
    this.getCustomervsscopeDepartments();
    this.getCustomerDatainForm();
  }
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private _coreService: CoreService, private sharedDataService: CustomerSalesApprovalService, private loginservice: LoginService, private spinnerService: SpinnerService, private router: Router) {
    this.getCustomerData();
    this.getDepartments();
    this.getCountry();
  }




  ///fetch update data into ngmodel when edit button clicked
  fetchUpdateData() {
    this.ShortName = this.apiResponseData.shortName;
    this.CustomerClassificationId = this.apiResponseData.customerClassificationId;
    this.selectedDepartments = this.apiResponseData.selectedDepartments;
    this.CreditDays = this.apiResponseData.creditDays;
    this.CreditLimit = this.apiResponseData.creditLimit;
    this.CustomerJobType = this.apiResponseData.customerJobType;
    this.Country = this.apiResponseData.country;
    this.State = this.apiResponseData.state;
    this.City = this.apiResponseData.city;
    this.BillingCycleType = this.apiResponseData.billingCycleType;
    this.PaymentMode = this.apiResponseData.paymentMode;
    this.PrivilegedClient = this.apiResponseData.privilegedClient;
    this.InputType = this.apiResponseData.inputType;
    this.OutputType = this.apiResponseData.outputType;
    this.isBulk = this.apiResponseData.isBulk;
    this.isRushed = this.apiResponseData.isRush;
    this.manualupload = this.apiResponseData.isManualUpload;
    this.ScheduledMail = this.apiResponseData.bunchMail;
    this.Checklist = this.apiResponseData.checklist;
    this.ModeofSales = this.apiResponseData.modeofSales;
    this.CurrencyMode = this.apiResponseData.currencyMode;
  }


  getCustomervsscopeDepartments(): void {
    // Replace 'YOUR_REST_API_URL' with the actual endpoint that fetches department data.
    this.http.get<any>(environment.apiURL + `CustomerMapping/GetAllddlList`)
      .subscribe(
        data => {
          this.CustomerVsSCopedepartments = data.departmentList;
        },
        error => {
          console.error('Error fetching departments:', error);
        }
      );
  }
  //customerclassification-dropdown
  getCustomerData(): void {
    this.http.get<any>(environment.apiURL + `Customer/GetClassification`).subscribe(
      (data) => {
        this.ClassificationList = data;
      },
      (error) => {
        console.error('Error fetching data from API:', error);
      }
    );
  }


  //department dropdown
  getDepartments(): void {
    this.http.get<any>(environment.apiURL + `Customer/getClientDepartment`).subscribe(
      (data) => {
        this.departments = data;
      },
      (error) => {
        console.error('Error fetching data from API:', error);
      }
    );
  }


  //Countrydropdown
  getCountry() {
    this.http.get<any>(environment.apiURL + `Customer/GetAllCountryList`).subscribe(results => {
      this.CountriesList = results.countryDetails
      this.CountryId = results.countryDetails.id
    })
  }


  CustomerVsSCopedepartments: any[] = [];
  citiesList: any[] = [];
  placeList: any[] = [];
  departments: any[] = [];
  CountriesList: any[] = [];
  ClassificationList: any[] = [];
  jobstatus: any[] = [];
  //String intertpolation

  editCustomerName = localStorage.getItem("CustomerName");
  //ngmodels to save the current value
  ShortName: '';
  CustomerClassificationId: '';
  selectedDepartments: any[] = [];
  CreditDays: '';
  CreditLimit: '';
  CustomerJobType: '';
  Country: any;
  State = '';
  City = '';
  BillingCycleType = '';
  PaymentMode = '';
  PrivilegedClient = '';
  InputType = '';
  OutputType = '';
  isBulk: boolean = false;
  isRushed: boolean = false;
  manualupload: boolean = false;
  ScheduledMail: boolean = false;
  Checklist: boolean = false;
  ModeofSales: any;
  CurrencyMode: any;
  SelectedScope: any[] = [];
  SelectedCustType: string = '';
  selectedDept: any;
  SelectedJobStatus: any;
  tatValue: any;


  //change method to display state and places realted to country dropdown
  GetStatesList() {
    this.http.get<any>(environment.apiURL + `Customer/GetAllStateListbyCountryId?CountryId=${this.Country}`).subscribe(results => {
      this.placeList = results;
    });
  }


  getCustomerDatainForm() {
    this.http.get<any>(environment.apiURL + `Customer/getAppCustomerSalesId?CustomerId=${this.apiResponseData.id}`).subscribe(response => {
      this.AppCustomerDetails = response
    });
  }


  GetCitiesList() {
    this.http.get<any>(environment.apiURL + `Customer/GetAllCityListbyStateId?StateId=${this.State}`).subscribe(results => {
      this.citiesList = results;
    });
  }

  GetTimeZoneList() {
    this.http.get<any>(environment.apiURL + `Customer/GetAllTimeZoneListbyCityId?CityId=${this.City}`).subscribe(results => {
      this.timezone = results[0].timeZone;
    });
  }

  AppCustomerupdate() {
    let payload = {
      "id": this.apiResponseData.id,
      "companyId": 0,
      "name": "string",
      "shortName": this.ShortName,
      "customerClassificationId": this.CustomerClassificationId,
      "creditDays": this.CreditDays,
      "isBlacklisted": true,
      "isApproved": true,
      "blacklistedReasons": "string",
      "department": [],
      "creditLimit": this.CreditLimit,
      "creditLimitAvailed": 0,
      "timeZone": this.timezone ? this.timezone : '',
      "reportTimeZone": "string",
      "dropdownTimeZone": "string",
      "departmentId": 0,
      "establishmentType": "string",
      "billingCycleType": "string",
      "employeeId": 0,
      "address1": "string",
      "address2": "string",
      "address3": "string",
      "locationId": 0,
      "emailAddress": "string",
      "phone1": "string",
      "phone2": "string",
      "webAddress": "string",
      "contactName": "string",
      "contactPhone": "string",
      "contactEmail": "string",
      "customerDepartmentName": "string",
      "createdUTC": "2023-07-24T12:37:19.961Z",
      "createdBy": 0,
      "updatedUTC": "2023-07-24T12:37:19.961Z",
      "updatedBy": 0,
      "selectedDepartments": this.getDepartmentObjects(),
      "userName": "string",
      "emailID": "string",
      "phoneNo": "string",
      "active": true,
      "verifyCode": "string",
      "country": this.Country,
      "state": this.State,
      "city": this.City,
      "customerJobType": this.CustomerJobType,
      "inputType": this.InputType ? this.InputType : '',
      "outputType": this.OutputType ? this.OutputType : '',
      "privilegedClient": this.PrivilegedClient ? this.PrivilegedClient : '',
      "paymentMode": "string",
      "isBulk": this.isBulk,
      "checklist": this.Checklist,
      "isRush": this.isRushed,
      "bunchMail": this.ScheduledMail,
      "isManualUpload": this.manualupload,
      "rptTimeZoneDifference": 0,
      "trialStartDate": new Date().toISOString,
      "liveStartDate": new Date().toISOString,
      "modeofSales": this.ModeofSales ? this.ModeofSales : '',
      "currencyMode": this.CurrencyMode
    }
    this.http.post<any>(environment.apiURL + `Customer/EditCustomerDetails`, payload).subscribe(results => {
      localStorage.setItem("CustomerId123", results.id);
      localStorage.setItem("ShortName", results.shortName);
      localStorage.setItem("CustomerName", results.name);
      localStorage.setItem("CusRegId123", this.apiResponseData.id);
    })
    this.getTableData();
    this.getCustomervsscopeDepartments();
  }



  displayscope: boolean = false;
  ScopeBillings: any[] = [];

  onDepartmentChange() {
    if (this.selectedDept) {
      // Access the ID and Description of the selected department
      const selectedDeptId = this.selectedDept.id;
      const selectedDeptDescription = this.selectedDept.description;
      this.displayscope = true;
      this.http.get<any>(environment.apiURL + `CustomerMapping/ScopeByDeptIdCusId?departmentId=${selectedDeptId}&custId=${this.apiResponseData.id}`).subscribe(results => {
        this.ScopeBillings = results
      });
    }
  }



  getDepartmentObjects(): any[] {
    let department: any[] = []
    this.selectedDepartments.map(x => {
      department.push({
        "id": x,
        "description": "string",
        "isDeleted": true,
        "createdUtc": "2023-07-25T09:22:18.009Z",
        "updatedUtc": "2023-07-25T09:22:18.009Z",
        "createdBy": 0,
        "updatedBy": 0
      })
    })
    return department;
  }

  deleteEmployee(id: number) {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `CustomerMapping/RemoveCustomerScope?custScopeId=${id}`).subscribe({
      next: (res) => {
        this.spinnerService.requestEnded();

        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.getTableData();
      }
    });
  }


  ///Customer vs scope



  getTableData() {
    this.http.get<any>(environment.apiURL + `CustomerMapping/CustomerScopeByCusId?cusId=${this.apiResponseData.id}`).subscribe(results => {
      this.dataSource = results;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  addDataToTable() {
    let payload = [{
      "id": 0,
      "shortName": localStorage.getItem("ShortName"),
      "name": localStorage.getItem("CustomerName"),
      "custId": this.apiResponseData.id,
      "scopeId": this.selectedScopeID,
      "deptId": this.selectedDept.id,
      "custName": "string",
      "description": "string",
      "scopeName": this.selectedDeptDescription,
      "scopeGroupDescription": "string",
      "scopeGroupId": 0,
      "deptName": this.selectedDept.description,
      "custJobType": this.SelectedCustType,
      "isDeleted": 0,
      "isActive": 1,
      "createdBy": this.loginservice.getUsername(),
      "createdUTC": new Date().toISOString,
      "updatedBy": 0,
      "updatedUTC": new Date().toISOString,
    }]

    this.http.post<any>(environment.apiURL + `CustomerMapping/AddCustomerVsScope`, payload).subscribe(results => {
      this.dataSource = results
      this._coreService.openSnackBar("Data Added successfully!");
      this.getTableData();
    });
  }
  onScopeChange() {
    // Access the ID and Description of the selected department
    if (this.SelectedScope.length > 0) { // Check if there are any selected options
      for (const selectedScope of this.SelectedScope) {
        const selectedDeptId = selectedScope.id;
        const selectedDeptDescription = selectedScope.description;


        this.selectedScopeID = selectedDeptId;
        this.selectedDeptDescription = selectedDeptDescription;
       
        // Do whatever you need with the selectedDeptId and selectedDeptDescription here
      }
    }
  }


  ///customerTAT
  jobStatusdisplay = false

  nextbutton() {
    this.getjobstatus();
    this.getCustomerTatTable();
  }
  getjobstatus() {
    this.http.get<any>(environment.apiURL + `CustomerMapping/JobStatusByCusId?custId=${this.apiResponseData.id}`).subscribe(results => {
      this.jobstatus = results;
    });
  }

  getCustomerTatTable() {
    this.http.get<any>(environment.apiURL + `CustomerMapping/GetAllCustomerTATbyCusId?custId=${this.apiResponseData.id}`).subscribe(results => {
      this.customertatdatasource = results;
      this.customerTatid = results[0].id;
      this.jobStatusDescription = results[0].jobStatusDescription;
    });
  }

  addcustattable() {
    let payload = [
      {
        "jobStatusId": this.selectedJobStatusID,
        "customerId": this.apiResponseData.id,
        "tat": this.tatValue,
        "customerShortName": this.apiResponseData.shortName,
        "jobStatusDescription": this.selectedJobStatusDescription,
        "createdBy": this.loginservice.getUsername(),
        "createdUTC": new Date().toISOString,
        "updatedBy": this.loginservice.getUsername(),
        "updatedUTC": new Date().toISOString,
        "isActive": true
      }
    ]
    this.http.post<any>(environment.apiURL + `CustomerMapping/AddCustomerTAT`, payload).subscribe(results => {
      this._coreService.openSnackBar("Data Added successfully!")
      this.customertatdatasource = results;
      this.getCustomerTatTable();
    });
  }

  deleteTatEmployee(id: number) {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `CustomerMapping/RemoveCustomerTAT?custTATId=${id}`).subscribe({
      next: (res) => {
        this.spinnerService.requestEnded();

        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.getCustomerTatTable();
      }
    });
  }
  jobStatusDescription: '';



  jobstatusdropdown: boolean = true;
  uptcustat: boolean = false;
  addcustat: boolean = true;
  openEditForm() {
    this.http.get<any>(environment.apiURL + `CustomerMapping/GetAllCustomerTATbyCusId?custId=${this.apiResponseData.id}`).subscribe(results => {
      this.jobStatusdisplay = true;
      this.jobstatusdropdown = false;
      this.addcustat = false;
      this.uptcustat = true;
      this.tatValue = results[0].tat;

    });

  }
  returnForm() {
    this.jobStatusdisplay = false;
    this.jobstatusdropdown = true;
    this.addcustat = true;
    this.uptcustat = false;
  }

  updatecustattable() {
    let payload = {
      "id": this.customerTatid,
      "customerId": this.apiResponseData.id,
      "jobStatusId": 0,
      "customerShortName": "string",
      "jobStatusDescription": "string",
      "tat": this.tatValue,
      "createdBy": this.loginservice.getUsername(),
      "createdUtc": new Date().toISOString,
      "updatedBy": this.loginservice.getUsername(),
      "updatedUtc": new Date().toISOString,
      "isActive": true
    }
    this.http.post<any>(environment.apiURL + `CustomerMapping/UpdateCustomerTATData`, payload).subscribe(results => {
      this.customertatdatasource = results;
      this._coreService.openSnackBar("Data Updated Succesfully!");
      this.getCustomerTatTable();
      this.tatValue="";
      this.returnForm();
    });
  }


  onJobChange() {
    if (this.SelectedJobStatus.length > 0) { 
      for (const selectedJobStatus of this.SelectedJobStatus) {
        const selectedJobId = selectedJobStatus.id;
        const selectedJobDescription = selectedJobStatus.jobStatusDescription;
        this.selectedJobStatusID = selectedJobId;
        this.selectedJobStatusDescription = selectedJobDescription;
      }
    }
  }

  OnSubmit(){
    Swal.fire(
      'Good job!',
      'You clicked the button!',
      'success'
    )
  }
}