import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BuddyProofService } from 'src/app/Services/CoreStructure/BuddyProof/buddy-proof.service';
import { BuddyProofComponent } from '../buddy-proof/buddy-proof.component';
import { environment } from 'src/Environments/environment';
import { LoginService } from 'src/app/Services/Login/login.service';
import { SewOutService } from 'src/app/Services/CoreStructure/SewOut/sew-out.service';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buddy-proof-table',
  templateUrl: './buddy-proof-table.component.html',
  styleUrls: ['./buddy-proof-table.component.scss']
})
export class BuddyProofTableComponent implements OnInit {

  scopes: any[] = [];
  selectedScope: any = 0;

  displayedColumns: string[] = [
    'selected',
    'jobId',
    'estjob',
    'actions',
    'client',
    'customerSatisfaction',
    'fileName',
    'fileInwardMode',
    'scope',
    'jobstatus',
    'projectcode',
    'allocatedby',
    'artistname',
    'processstatus',
    'esttime',
    'jobcategory',
    'deliverydate'
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, private buddyService: BuddyProofService, private buddyproofcomponent: BuddyProofComponent, private loginservice: LoginService, private sewOutService: SewOutService, private _coreService: CoreService, private router: Router) { }

  ngOnInit(): void {
    //maintable
    this.freshJobs();
  }



  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




  //to save the checkbox value
  selectedQuery: any[] = [];

  setAll(completed: boolean, item: any) {
    
    if (completed == true) {
      this.selectedQuery.push(item)
    }
    else {

      if (this.selectedQuery.find(x => x.id == item.id)) {
        this.selectedQuery = this.selectedQuery.filter(x => {
          if (x.id != item.id) {
            return item
          }
        })
      }
    }
  }

  benchChecked: boolean = false;
  onBenchCheckboxChange(event: any) {
    this.benchChecked = event.checked;
  }
  tab(action) {
    if (action == '1') {
      this.freshJobs();
    }
    else if (action == '2') {
      this.revisionJobs();
    }
    else if (action == '3') {
      this.reworkJobs();
    }
    else if (action == '4') {
      this.quoteJobs();
    }
    else if (action == '5') {
      this.sewOut();
    }
    else if (action == '6') {
      this.bulkJobs();
    }
    else if (action == '6') {
      this.bulkUploadJobs();
    }
  }


  freshJobs() {
    this.buddyService.getTabValue1().subscribe(freshJobs => {
      this.dataSource = new MatTableDataSource(freshJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;
    });
  }
  revisionJobs() {
    this.buddyService.getTabValue2().subscribe(revisionJobs => {
      this.dataSource = new MatTableDataSource(revisionJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;
    });
  }
  reworkJobs() {
    this.buddyService.getTabValue3().subscribe(reworkJobs => {
      this.dataSource = new MatTableDataSource(reworkJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;
    });
  }
  quoteJobs() {
    this.buddyService.getTabValue4().subscribe(quoteJobs => {
      this.dataSource = new MatTableDataSource(quoteJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;
    });
  }
  sewOut() {
    this.buddyService.getTabValue5().subscribe(sewOut => {
      this.dataSource = new MatTableDataSource(sewOut.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;

    });
  }

  displayScopeDropdown: boolean = false; // hide a scope dropdown
  bulkJobs() {
    this.buddyService.getTabValue6().subscribe(bulkJobs => {
      this.dataSource = new MatTableDataSource(bulkJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = true;
    });
  }
  bulkUploadJobs() {
    this.buddyService.getTabValue7().subscribe(bulkUploadJobs => {
      this.dataSource = new MatTableDataSource(bulkUploadJobs.getWorkflowDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayScopeDropdown = false;

    });
  }


  scopeDropdown() {
    this.buddyService.getScopeDropdown().subscribe(scopedata => {
      this.scopes = scopedata.scopeDetails
      

    })
  }

  getTabValue() {
    
    return this.buddyproofcomponent.getCurrentTab();
  }

  workFlowConversion() {

  }

}
