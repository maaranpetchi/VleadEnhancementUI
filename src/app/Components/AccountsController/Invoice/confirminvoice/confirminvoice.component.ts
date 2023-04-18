import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PricingcalculationService } from 'src/app/Services/AccountController/PricingCalculation/pricingcalculation.service';

export interface MyData {
  selected:any,
  Client:any,
  Jobid:any,
  Jobdate:any,
  FileName:any,
  ProjectCode:any,
  Department:any,
  JobStatus:any,
  scope:any,
  StitchCount:any,
  estimatedtime:any,
  rate:any,
  ESTFileReceivedDate:any,
  ESTDateofUpload:any,
  nonbillableupload:any
}
@Component({
  selector: 'app-confirminvoice',
  templateUrl: './confirminvoice.component.html',
  styleUrls: ['./confirminvoice.component.scss']
})
export class ConfirminvoiceComponent implements OnInit {


  constructor(private http: HttpClient, private _empService: PricingcalculationService, private dialog: MatDialog) { }

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

  selectedInvoices: any[] = [];

 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setAll(completed: boolean, item: any) {
    console.log("before", this.selectedInvoices)
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
    console.log("after", this.selectedInvoices)
  }



  ngOnInit(): void {
    this.http.get<MyData[]>('https://your-api-endpoint.com/data').subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    //clientdropdown
    this.http.get<any>('https://localhost:7208/api/Invoice/GetClient').subscribe(clientdropdowndata => {
      this.clientdata = clientdropdowndata;
      console.log(clientdropdowndata);
    });
  }

  clientdata: any = {
    clientList: [],
  };

  dataSource: MatTableDataSource<MyData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  myForm = new FormGroup({

    fromDate: new FormControl("", Validators.required),
    toDate: new FormControl("", Validators.required),
    ClientId: new FormControl("", Validators.required)
  });



  onSubmit() {
    // Call the API to get the search results
    this.http.post<any>('https://localhost:7208/api/Invoice/GetClientDetails', {
      "clientId": this.myForm.value?.ClientId,
      "fromDate": this.myForm.value?.fromDate,
      "toDate": this.myForm.value?.toDate
    }).subscribe((results: any) => {
      // Set the search results in the data source

      this.dataSource.data = results.getInvoice;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(results, "results")
    }
    )
  }

  onInvoiceCalculation(item: any) {
    // Call the API to get the search results
    // this.http.post<any>('https://localhost:7208/api/Invoice/GetCalculatedInvoice', item).subscribe((results: any) => {
    //   // Set the search results in the data source
    //   const dialogRef = this.dialog.open(InformationpopupComponent, {
    //     width: '500px',
    //     height: '150px',
    //     data: 'Updated successfully!'
    //   }
    //   );
    // }
    // )
  }
}
