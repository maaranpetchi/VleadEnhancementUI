import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './AngularMaterialModule/material/material.module';
import { NavigationModule } from './NavigationModuleRouting/navigation/navigation.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AdvanceadjustmentComponent } from './Components/AccountsController/AdvanceAdjustment/Index/advanceadjustment/advanceadjustment.component';
import { EditadvanceadjustmentComponent } from './Components/AccountsController/AdvanceAdjustment/Edit/editadvanceadjustment/editadvanceadjustment.component';
import { MovetointegrationComponent } from './Components/AccountsController/Tally/movetointegration/movetointegration.component';
import { UpdateExchangeRateComponent } from './Components/AccountsController/Tally/update-exchange-rate/update-exchange-rate.component';
import { SpinnerComponent } from './Components/Spinner/spinner/spinner.component';
import { DialogComponent } from './Components/dialog/dialog.component';
import { ViewUnapprovaljobsComponent } from './Components/Sales/view-unapprovaljobs/view-unapprovaljobs.component';
import { CustomerSalesmappingComponent } from './Components/Sales/customer-salesmapping/customer-salesmapping.component';
import { PricingApprovalprocessComponent } from './Components/Sales/pricing-approvalprocess/pricing-approvalprocess.component';
import { EmployeePopupComponent } from './Components/TopToolbarComponents/ProofReadingAllocation/employee-popup/employee-popup.component';
import { JobCategorypopupComponent } from './Components/TopToolbarComponents/ProofReadingAllocation/job-categorypopup/job-categorypopup.component';
import { VendorService } from './Services/Vendor/vendor.service';

import { ProductionQuotationComponent } from './Components/TopToolbarComponents/ProductionAllocation/production-quotation/production-quotation.component';
import { QuotationPopupComponent } from './Components/TopToolbarComponents/ProductionAllocation/quotation-popup/quotation-popup.component';
import { AttendanceIndexComponent } from './Components/Attendance/attendance-index/attendance-index.component';


@NgModule({
  declarations: [
    AppComponent,
    MovetointegrationComponent,
    UpdateExchangeRateComponent,
    SpinnerComponent,
    DialogComponent,
    ViewUnapprovaljobsComponent,
    CustomerSalesmappingComponent,
    PricingApprovalprocessComponent,
    EmployeePopupComponent,
    JobCategorypopupComponent,
  

   
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    NavigationModule,
    MatDialogModule,
  ],
  providers: [
    EditadvanceadjustmentComponent,
    AdvanceadjustmentComponent,
    VendorService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }