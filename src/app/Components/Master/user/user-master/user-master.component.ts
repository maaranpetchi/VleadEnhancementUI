import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserMasterService } from 'src/app/Services/Master/user-master.service';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdduserMasterComponent } from '../adduser-master/adduser-master.component';
import { AddEditUsermasterComponent } from '../add-edit-usermaster/add-edit-usermaster.component';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit {

  displayedColumns: string[] = [
    'Name',
    'UserName',
    'UserType',
    'Role',
    'action',
  ]

  employees: any = {};
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _empService: UserMasterService,
    private _coreService: CoreService,
    private spinnerService: SpinnerService,
  ) { }
  myForm = new FormGroup({
    name: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    userType: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    Password: new FormControl('')
  })
  ngOnInit(): void {
    this.getMasterUsers();
  }

  getMasterUsers() {
    this.spinnerService.requestStarted();
    this._empService.getAllMasterUsers().subscribe({
      next: (data) => {
        this.spinnerService.requestEnded();
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        this.spinnerService.resetSpinner();
        console.log(err);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddUsers() {
    const dialogRef = this._dialog.open(AdduserMasterComponent, {
      width: '100%',
      height: '550px',
    })
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getMasterUsers();
        }
      },
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditUsermasterComponent, {
      width: '100%',
      height: '400px',
      data: data,
    })
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getMasterUsers();
        }
      },
    });
  }

  deleteMasterUser(data) {
    let deleteUser = {
      "id": data.id,
      "username": "string",
      "password": "string",
      "userType": "string",
    }
    this._empService.deleteMasterUser(deleteUser).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.getMasterUsers();

      },
      error: console.log,
    })
  }


}
