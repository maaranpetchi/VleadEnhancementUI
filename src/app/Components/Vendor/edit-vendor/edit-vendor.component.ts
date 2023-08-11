import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/Environments/environment';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { SpinnerService } from '../../Spinner/spinner.service';
import { LoginService } from 'src/app/Services/Login/login.service';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceValue: number;
  pendingAmount: number;
  amtTobePaid: number;
  amtPaidHide: boolean = true;

  constructor(
    private loginservice:LoginService,
    private _fb: FormBuilder,
    private spinnerService: SpinnerService,
    private http: HttpClient,
    private _dialogRef: MatDialogRef<EditVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
  }

  calculatePendingAmount(): void {
    this.pendingAmount = this.invoiceValue - this.amtTobePaid;
  }

  onFormSubmit(): void {
    const payload = {
      id: 0,
      vendorName: this.vendorName,
      invoiceNumber: this.invoiceNumber,
      invoiceDate: this.invoiceDate,
      invoiceValue: this.invoiceValue,
      pendingAmount: this.pendingAmount,
      amountbePaid: this.amtTobePaid,
      amountPaid: 0,
      employeeId: this.loginservice.getUsername(),
    };

    this.spinnerService.requestStarted();
    this.http.post<any>(environment.apiURL + `ITAsset/nSetVendorDetails`, payload).subscribe({
      next: (val: any) => {
        this.spinnerService.requestEnded();
        Swal.fire(
          'Done!',
          'Employee Added Succesfully!',
          'success'
        )
        this._dialogRef.close();
        window.location.reload();
      },
      error: (err: any) => {
        this.spinnerService.resetSpinner();
      }
    });
  }
}
