import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../Spinner/spinner.service';
import { Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoginService } from 'src/app/Services/Login/login.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  // Declarations
  showTable: boolean = false;
  notshowntodigi: boolean = false;
  type2: boolean = false;
  type22: boolean = false;
  type6: boolean = false;
  showeffective: boolean = false;
  showstaffingcounttable: boolean = false;
  showstaffingcount: boolean = false;
  notshowntocount: boolean = false;
  showcounttable: boolean = false;
  showcounttabletime: boolean = false;
  ScopeBasedRateBasedFileCountTable: boolean = false;
  EstimatedTimeTable: boolean = false;
  StaffingCountTable: boolean = false;
  showtodate: boolean = false;

  Customer: any;
  customers: any;
  departments: any;
  selectedValue: any;
  Pricings: any;
  selectedPricing: any;
  selectedCustomers: any;
  selectedScope: any;
  selectedAdditionalRate: any;
  selectedEstTime: any;
  selectedMaximumPrice: any;
  selectedfromDate: any;
  selectedValueEfect: any;
  selectedEffectivefromDate: any;
  selectedEffectivetoDate: any;
  selectedPrice: any;
  selectedFrom: any;
  selectedTo: any;
  selectedCountPrice: any;
  selectedDesignation: any;
  Scopes: any;
  dropdownOptions: any;
  ViewFileCountTable: any;
  i: any;
  AddedRecord: any = [];

  pricingtype: any;
  submitted: boolean;
  jobStatusFormControl: any;
  userRegistrationForm: FormGroup;
  constructor(
    private builder: FormBuilder,
    private http: HttpClient,
    private spinner: SpinnerService,
    private loginservice:LoginService,
    private _coreService: CoreService,
  ) {}
  departmentFormControl = new FormControl('', Validators.required);
  ngOnInit(): void {
    this.loadDepartments();
    this.loadCustomer();
    this.userRegistrationForm = this.builder.group({
      departmentFormControl:this.departmentFormControl,
      pricingFormControl: ['', Validators.required],
      customersFormControl: ['', Validators.required],
      additionalRateFormControl: ['', Validators.required],
      estimatedTimeFormControl: ['', Validators.required],
      maximumPriceFormControl: ['', Validators.required],
      effectFormControl: ['', Validators.required],
      jobStatusFormControl: ['', Validators.required],
      effectToControl: ['', Validators.required],
      PriceFormControl: ['', Validators.required],
      scopeCountFormControl: ['', Validators.required],
      countFromFormControl: ['', Validators.required],
      countToFormControl: ['', Validators.required],
      countPriceFormControl: ['', Validators.required],
      designationFormControl: ['', Validators.required],
    });
  }
  onDepartmentChange(): void {
    this.http
      .get(
        environment.apiURL +
          `Pricing/PricingTypesByDeptId?departmentId=${this.selectedValue}`
      )
      .subscribe({
        next: (response: any) => {
          this.Pricings = response;
          console.log(response);
          this.showTable = true;
        },
        error: (err) => {
          console.log(err, 'Error');
        },
      });
  }
  loadDepartments(): void {
    this.http.get(environment.apiURL + 'Pricing/pricingList').subscribe(
      (response: any) => {
        this.departments = response.departments;
        console.log(response, 'departmentsValues');
      },
      (error) => {
        console.log('Error loading departments values:', error);
      }
    );
  }
  onPricingTypeChange(pricingType: any): void {
    console.log('outsid');
    if (pricingType != undefined) {
      //  this.pricingtype = pricingType.Id;
      if (pricingType == 1 || pricingType == 9) {
        this.type2 = false;
        this.type22 = false;
        this.type6 = false;
        this.showeffective = true;
        this.notshowntodigi = true;
        //$scope.showstaffing = false;
        this.showcounttable = false;
        this.showcounttabletime = false;
        this.showstaffingcounttable = false;
        this.notshowntocount = true;
        this.ScopeBasedRateBasedFileCountTable = false;
        this.EstimatedTimeTable = false;
        this.showtodate = false;
      } else if (pricingType == 2) {
        this.type2 = true;
        this.type22 = true;
        this.type6 = false;
        this.showeffective = true;
        this.notshowntodigi = true;
        //$scope.showstaffing = false;
        this.showcounttable = false;
        this.showcounttabletime = false;
        this.showstaffingcounttable = false;
        this.notshowntocount = true;
        this.ScopeBasedRateBasedFileCountTable = false;
        this.EstimatedTimeTable = false;
        this.showtodate = false;
      } else if (pricingType == 13 || pricingType == 14) {
        this.type2 = true;
        this.type22 = false;
        this.type6 = false;
        this.showeffective = true;
        this.notshowntodigi = true;
        //$scope.showstaffing = false;
        this.showcounttable = false;
        this.showcounttabletime = false;
        this.showstaffingcounttable = false;
        this.notshowntocount = false;
        this.ScopeBasedRateBasedFileCountTable = false;
        this.EstimatedTimeTable = false;
        this.showtodate = false;
      } else if (pricingType == 11 || pricingType == 12) {
        this.type2 = false;
        this.type22 = false;
        this.type6 = false;
        this.showeffective = true;
        this.notshowntodigi = false;
        //$scope.showstaffing = false;
        this.showcounttable = false;
        this.showcounttabletime = true;
        this.showstaffingcounttable = false;
        this.showstaffingcount = false;
        this.notshowntocount = false;
        this.ScopeBasedRateBasedFileCountTable = false;
        this.EstimatedTimeTable = false;
        this.showtodate = false;
      } else if (pricingType == 3 || pricingType == 4 || pricingType == 10) {
        this.type2 = false;
        this.type22 = false;
        this.type6 = false;
        this.showeffective = true;
        this.notshowntodigi = false;
        //$scope.showstaffing = false;
        this.showcounttable = true;
        this.showcounttabletime = false;
        this.showstaffingcounttable = false;
        this.notshowntocount = false;
        this.ScopeBasedRateBasedFileCountTable = false;
        this.EstimatedTimeTable = false;
        this.showtodate = false;
      } else if (pricingType == 5 || pricingType == 15) {
        this.type2 = false;
        this.type22 = false;
        this.type6 = false;
        this.showeffective = false;
        this.notshowntodigi = false;
        //$scope.showstaffing = false;
        this.showcounttable = false;
        this.showcounttabletime = false;
        this.showstaffingcounttable = true;
        this.showstaffingcount = true;
        this.notshowntocount = false;
        this.ScopeBasedRateBasedFileCountTable = false;
        this.EstimatedTimeTable = false;
        this.showtodate = false;
      } else if (pricingType == 6) {
        this.type2 = false;
        this.type22 = false;
        this.type6 = true;
        this.showeffective = true;
        this.notshowntodigi = false;
        //$scope.showstaffing = false;
        this.showcounttable = false;
        this.showcounttabletime = false;
        this.showstaffingcounttable = false;
        this.notshowntocount = true;
        this.ScopeBasedRateBasedFileCountTable = false;
        this.EstimatedTimeTable = false;
        this.showtodate = false;
      }
      this.http.get(environment.apiURL + 'Pricing/GetjobStatusList').subscribe({
        next: (response: any) => {
          this.dropdownOptions = response.jsList;
        },
        error: (error) => {
          console.log(error, 'Api Error');
        },
      });
    }
  }
  loadCustomer(): void {
    this.http.get(environment.apiURL + 'Pricing/pricingList').subscribe(
      (response: any) => {
        this.Customer = response.customers;
        console.log(response, 'departmentsValues');
      },
      (error) => {
        console.log('Error loading departments values:', error);
      }
    );
  }
  onCustomerChange() {
    this.spinner.requestStarted();
    this.http
      .get(
        environment.apiURL +
          `Pricing/ShowDetailsofPricing?clientid=${this.selectedCustomers}`
      )
      .subscribe({
        next: (response: any) => {
          this.spinner.requestEnded();
          console.log(response);
          this.loadScope();
          this.customers = response;
        },
        error: (err) => {
          this.spinner.resetSpinner();
          console.log(err, 'Error');
        },
      });
  }
  loadScope() {
    this.http
      .get(
        environment.apiURL +
          `Pricing/ScopeByDeptCustId?clientid=${this.selectedCustomers}&departmentId=${this.selectedValue}`
      )
      .subscribe(
        (response: any) => {
          this.Scopes = response;
          console.log(response, 'departmentsValues');
        },
        (error) => {
          console.log('Error loading departments values:', error);
        }
      );
  }
  RejectClick(id: any): void {}
  onSubmit() {
    if (this.userRegistrationForm.invalid) {
      this.userRegistrationForm.markAllAsTouched(); // Mark the control as touched to trigger validation messages
      return; // Stop form submission if the form is invalid
    }
  }
  onCancel() {}

  back() {
    window.location.reload();
  }
  // CreateStaffing(){
  //   this.ScopeBasedRateBasedFileCountTable=true;
  // }

  CreateRateBasedFileCountAndConcession() {
    console.log("outside createbased file count");
    
    this.submitted = true;
    if (this.userRegistrationForm.valid) {
      this.userRegistrationForm.markAllAsTouched();
    console.log("inside createbased file count");
      let filecountdata = {
        ScopeId: this.selectedScope.id,
        ScopeTempDesc: this.selectedScope.description,
        FromRange: this.selectedFrom,
        ToRange: this.selectedTo,
        Price: this.selectedCountPrice,
      };
      this.AddedRecord.push(filecountdata);
      this.ViewFileCountTable = this.AddedRecord;
      this.ScopeBasedRateBasedFileCountTable = true;
      $('#ddlCurrentStaff').val('');
      $('#countfrom').val('');
      $('#countto').val('');
      $('#countprice').val('');
      $('#txtwefromdate').val('');
      return; // Stop form submission if the form is invalid
    }
    this.ScopeBasedRateBasedFileCountTable = true;
  }
  CreateEstimatedTime() {
    console.log("outside CreateEstimatedTime file count");
    this.submitted = true;
    if (this.userRegistrationForm.valid) {
      this.userRegistrationForm.markAllAsTouched();
    console.log("inside CreateEstimatedTime file count");
      //  form control
      if (
        this.selectedFrom < this.selectedTo &&
        this.selectedFrom != this.selectedTo
      ) {
        var filecountdata = {
          ScopeId: this.selectedScope.id,
          ScopeTempDesc: this.selectedScope.description,
          FromRange: this.selectedFrom,
          ToRange: this.selectedTo,
          Price: this.selectedCountPrice,
        };
        this.AddedRecord.push(filecountdata);
        this.ViewFileCountTable = this.AddedRecord;
        this.EstimatedTimeTable = true;
        $('#ddlCurrentStaff').val('');
        $('#countfrom').val('');
        $('#countto').val('');
        $('#countprice').val('');
        $('#txtwefromdate').val('');
      } else {
        alert('Check FromValue Less or Equal');
      }
    }
  }
  CreateStaffing() {
    this.submitted = true;
    let filecountdata: any;
    if (this.userRegistrationForm.valid) {
      this.userRegistrationForm.markAllAsTouched();
      if (this.selectedFrom != null || this.selectedTo != undefined) {
        if (this.selectedTo) {
          // if (this.ToRange <=this.ViewModel.WEToDate) {
          filecountdata = {
            ScopeTempDesc: this.selectedScope,
            FromDate: this.selectedFrom,
            ToDate: this.selectedTo,
            Price: this.selectedCountPrice,
          };
        } else {
          alert('Todate Should Less then EffectiveTo Date');
        }
      } else {
        filecountdata = {
          ScopeTempDesc: this.selectedScope,
          FromDate: this.selectedFrom,
          ToDate: this.selectedEffectivefromDate,
          Price: this.selectedCountPrice,
        };
      }
      $('#ddlCurrentStaff').val('');
      $('#countfrom').val('');
      $('#countto').val('');
      $('#countprice').val('');
      this.AddedRecord.push(filecountdata);
      this.ViewFileCountTable = this.AddedRecord;
      this.ScopeBasedRateBasedFileCountTable = true;
    }
  }
  RemoveId: any;
  btnRemoveScope(index: any) {
    this.RemoveId = index;
  }
  btndeleteScopepopup() {
    this.ViewFileCountTable.splice(this.RemoveId, 1);
    // $('#scopeworkflowdelete').modal('hide');
  }
  CreatePricing() {
    let datas: any;
    // if (this.userRegistrationForm.valid) {
    //   this.userRegistrationForm.markAllAsTouched();
      if (this.selectedPricing == 1 || this.selectedPricing == 9) {
        datas = {
          CustomerId: this.selectedCustomers.id,
          DepartmentId: this.selectedValue.id,
          ScopeId: this.selectedScope.Id,
          PricingTypeId: this.selectedPricing.id,
          WEFromDate: this.selectedfromDate,
          Price: this.selectedPrice,
          ScopeTempDesc: this.selectedScope.description,
          CreatedBy: this.loginservice.getUsername(),
          JobStatusId: this.selectedValueEfect,
        };
      } else if (this.selectedPricing == 2) {
        datas = {
          CustomerId: this.selectedCustomers.id,
          DepartmentId: this.selectedValue.id,
          ScopeId: this.selectedScope.Id,
          PricingTypeId: this.selectedPricing.id,
          RatePerHour: this.selectedAdditionalRate,
          EstimatedTime: this.selectedEstTime,
          WEFromDate: this.selectedfromDate,
          Price: this.selectedPrice,
          ScopeTempDesc: this.selectedScope.description,
          CreatedBy: this.loginservice.getUsername(),
          JobStatusId: this.selectedValueEfect,
        };
      } else if (this.selectedPricing == 13 || this.selectedPricing == 14) {
        datas = {
          CustomerId: this.selectedCustomers.id,
          DepartmentId: this.selectedValue.id,
          ScopeId: this.selectedScope.Id,
          PricingTypeId: this.selectedPricing.id,
          RatePerHour: this.selectedAdditionalRate,
          WEFromDate: this.selectedfromDate,
          ScopeTempDesc: this.selectedScope.description,
          CreatedBy: this.loginservice.getUsername(),
          JobStatusId: this.selectedValueEfect,
        };
      } else if (
        this.selectedPricing == 11 ||
        this.selectedPricing == 12
      ) {
        datas = {
          CustomerId: this.selectedCustomers.id,
          DepartmentId: this.selectedValue.id,
          PricingTypeId: this.selectedPricing.id,
          CreatedBy: this.loginservice.getUsername(),
          WEFromDate: this.selectedfromDate,
          AddCountDatas: this.ViewFileCountTable,
          JobStatusId: this.selectedValueEfect,
        };
      } else if (
        this.selectedPricing == 3 ||
        this.selectedPricing == 4 ||
        this.selectedPricing == 10
      ) {
        datas = {
          CustomerId: this.selectedCustomers.id,
          DepartmentId: this.selectedValue.id,
          PricingTypeId: this.selectedPricing.id,
          CreatedBy: this.loginservice.getUsername(),
          WEFromDate: this.selectedfromDate,
          AddCountDatas: this.ViewFileCountTable,
          JobStatusId: this.selectedValueEfect,
        };
      } else if (
        this.selectedPricing == 5 ||
        this.selectedPricing == 15
      ) {
        datas = {
          CustomerId: this.selectedCustomers.id,
          DepartmentId: this.selectedValue.id,
          PricingTypeId: this.selectedPricing.id,
          CreatedBy: this.loginservice.getUsername(),
          WEFromDate: this.selectedfromDate,
          WEToDate: this.selectedEffectivetoDate,
          AddCountDatas: this.ViewFileCountTable,
        };
      } else if (this.selectedPricing == 6) {
        datas = {
          CustomerId: this.selectedCustomers.id,
          DepartmentId: this.selectedValue.id,
          ScopeId: 21,
          PricingTypeId: this.selectedPricing.id,
          RatePerHour: this.selectedAdditionalRate,
          WEFromDate: this.selectedfromDate,
          Price: this.selectedPrice,
          ScopeTempDesc: 'Embroidery Digitizing',
          CreatedBy: this.loginservice.getUsername(),
          JobStatusId: this.selectedValueEfect,
        };
      }
      this.http
        .post(environment.apiURL + `Pricing/AddPricingWithScope`, datas)
        .subscribe((response) => {
          this.jobStatusFormControl = response;
        });
    }

    // $('#CreateDialog').on('hidden.bs.modal', function (e) {
    //     $('#CreateDialog').modal('hide');
    //     $scope.submitted = false;
    //     $scope.PricingForm.$setPristine();
    //     $scope.type2 = false;
    //     $scope.type22 = false;
    //     $scope.type6 = false;
    //     $scope.showeffective = true;
    //     $scope.notshowntodigi = true;
    //     $scope.showpricedetails = false;
    //     //$scope.showstaffing = false;
    //     $scope.showcounttable = false;
    //     $scope.showcounttabletime = false;
    //     $scope.notshowntocount = true;
    //     $scope.showstaffingcounttable = false;
    //     $scope.StaffingCountTable = false;
    //     $scope.ScopeBasedRateBasedFileCountTable = false;
    //     $scope.EstimatedTimeTable = false;
    //     $("#ddldepartment").val('');
    //     $("#ddlpricingtype").val('');
    //     $("#ddlclient").val('');
    //     $("#ddlscope").val('');
    //     $("#txtaditionalrate").val('');
    //     $("#txtesttime").val('');
    //     $("#txttype6adirate").val('');
    //     $("#txtfromdate").val('');
    //     $("#txtwefromdate").val('');
    //     $("#txttodate").val('');
    //     $("#ddldesignation").val('');
    //     $("#txtnoofartist").val('');
    //     $("#txtprice").val('');
    //     $("#ddlCurrentStaff").val('');
    //     $("#countfrom").val('');
    //     $("#countto").val('');
    //     $("#countprice").val('');
    //     $timeout(function callAtTimeout() {
    //         $location.path('/CreatePricingWithScope');
    //     }, 500);
    // })
  // }
}
