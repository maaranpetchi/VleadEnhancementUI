import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../../Spinner/spinner.service';
import { EmployeevsskillsetService } from 'src/app/Services/EmployeeVsSkillset/employeevsskillset.service';
import { TransitionCheckState } from '@angular/material/checkbox';
import { LoginService } from 'src/app/Services/Login/login.service';
import { environment } from 'src/Environments/environment';
import Swal from 'sweetalert2/src/sweetalert2.js'
import { catchError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addedit-billing',
  templateUrl: './addedit-billing.component.html',
  styleUrls: ['./addedit-billing.component.scss']
})
export class AddeditBillingComponent implements OnInit {

  form: FormGroup;
  customers: any[];
  departments: any[];

  ngOnInit() {
    this.initForm();
    this.loadCustomers();
    this.loadDepartments();
  }
  constructor(private http: HttpClient, private router: Router, private spinnerService: SpinnerService, private _empservice: EmployeevsskillsetService, private fb: FormBuilder, private loginservice: LoginService) { }



  initForm() {
    this.form = this.fb.group({
      customerId: ["", Validators.required],
      departmentId: ["", Validators.required],
      billingDate: ['', Validators.required],
      createdBy: [this.loginservice.getUsername()],
      updateBy: 0

    });
  }

  loadCustomers() {
    this.spinnerService.requestStarted();
    this.http.get<any>(environment.apiURL + `user/getallcustomers`).pipe(catchError((error) => {
      this.spinnerService.requestEnded();
      return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
    })).subscribe((response) => {
      this.spinnerService.requestEnded();

      this.customers = response
    })

  }

  loadDepartments() {

  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value, "FormValues");
      this.spinnerService.requestStarted();
      this.http.post<any>(environment.apiURL + `BillingCycleMonthly/Creation`, this.form.value).pipe(catchError((error) => {
        this.spinnerService.requestEnded();
        return Swal.fire('Alert!', 'An error occurred while processing your request', 'error');
      })).subscribe((response) => {
        this.spinnerService.requestEnded();
        Swal.fire('Done', 'Billing Added Sucessfully', 'success').then((result) => {
          if (result.isConfirmed) {
            this.form.reset();
          }
        })
      })

    } else {
      // Handle invalid form
      console.log('Form is invalid. Please check the fields.');
    }
  }
}
