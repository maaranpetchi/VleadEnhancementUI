import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './AngularMaterialModule/material/material.module';
import { NavigationModule } from './NavigationModuleRouting/navigation/navigation.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AdvanceadjustmentComponent } from './Components/AccountsController/AdvanceAdjustment/Index/advanceadjustment/advanceadjustment.component';
import { EditadvanceadjustmentComponent } from './Components/AccountsController/AdvanceAdjustment/Edit/editadvanceadjustment/editadvanceadjustment.component';
import { MovetointegrationComponent } from './Components/AccountsController/Tally/movetointegration/movetointegration.component';
import { UpdateExchangeRateComponent } from './Components/AccountsController/Tally/update-exchange-rate/update-exchange-rate.component';
import { GetJobHistoryPopupComponent } from './Components/TopToolbarComponents/ClientCordination/completedjobs/completedjobpopupjobhistory/get-job-history-popup/get-job-history-popup.component';
import { SpinnerComponent } from './Components/Spinner/spinner/spinner.component';
import { DialogComponent } from './Components/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MovetointegrationComponent,
    UpdateExchangeRateComponent,

    SpinnerComponent,
      DialogComponent,

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
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
