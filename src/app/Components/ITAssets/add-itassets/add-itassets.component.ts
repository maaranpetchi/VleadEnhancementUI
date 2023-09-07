import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/Services/CustomerVSEmployee/Core/core.service';
import { LoginService } from 'src/app/Services/Login/login.service';
import { SpinnerService } from '../../Spinner/spinner.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/Environments/environment';
import { ItassetsService } from 'src/app/Services/ITAssets/itassets.service';


//Interface for servertype
interface GETSTD {
  id: string;
  description: string;
}
interface GETWSD {
  id: string;
  description: string;
}
@Component({
  selector: 'app-add-itassets',
  templateUrl: './add-itassets.component.html',
  styleUrls: ['./add-itassets.component.scss']
})
export class AddItassetsComponent implements OnInit {
  hardwareStepFormGroup: FormGroup;
  softwareStepFormGroup: FormGroup;
  id: number;
  apiResponseData: any;
  data: any;



  ngOnInit(): void {
    this.getPcType();
    this.getSoftwareData();
    this.getTableData();

    if (this.sharedDataService.shouldFetchData) {
      const data = this.sharedDataService.getData();
      console.log(data, "Data 1");
      this.apiResponseData = data.data;
      console.log(this.apiResponseData, "apiresponsedata");

      this.fetchUpdateData();
      this.sharedDataService.shouldFetchData = false;
    }
  }
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private _coreService: CoreService, private sharedDataService: ItassetsService, private loginservice: LoginService, private spinnerService: SpinnerService, private router: Router) {

  }
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['baynumber', 'software', 'softwarestatus', 'Action'];
  employeeFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    let payload = {
      "id": id
    }
    this.spinnerService.requestStarted();
    this.http.post<any>(environment.apiURL + `ITAsset/nDeleteITSAsset`, payload).subscribe({
      next: (res) => {
        this.spinnerService.requestEnded();

        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.getTableData();
      }
    });
  }
  resetFormGroups() {
    // Reset the form groups by setting their values to null or empty
    this.hardwareStepFormGroup.reset();
    this.softwareStepFormGroup.reset();
  }

  fetchUpdateData() {
    console.log(this.apiResponseData.itheDetailList.id, "getting ID");

    let payload = {
      "id": this.apiResponseData.itheDetailList.id
    }
    this.http.post<any>(environment.apiURL + `ITAsset/nGetEditedITAsset`, payload).subscribe(results => {

      console.log(results, "fetchUpdateData");
      this.BayNo = results.itheDetailList.bayNumber,
        this.Location = results.itheDetailList.location,
        this.PcName = results.itheDetailList.pcName,
        this.PcType = results.itheDetailList.pcTypeId,
        this.Monitor = results.itheDetailList.monitor,
        this.MonitorSno = results.itheDetailList.monitorSerialNumber,
        this.keyboard = results.itheDetailList.keyboard,
        this.keyboardSno = results.itheDetailList.keyboardSerialNumber,
        this.Roll = results.itheDetailList.roll,
        this.Division = results.itheDetailList.division,
        this.Brand = results.itheDetailList.brand,
        this.Model = results.itheDetailList.model,
        this.WarrantyDetails = results.itheDetailList.warantyDetails,
        this.RAM = results.itheDetailList.ram,
        this.Processor = results.itheDetailList.processor,
        this.Graphics = results.itheDetailList.graphics,
        this.HDD = results.itheDetailList.hdd,
        this.TAGNumber = results.itheDetailList.tagNumber,
        this.MacAddress = results.itheDetailList.macAddress,
        this.OS = results.itheDetailList.os,
        this.IPAddress = results.itheDetailList.ipAddress,
        this.ServerType = results.itheDetailList.serverTypeId,
        this.InvoiceDate = results.itheDetailList.invoiceDate,
        this.InvoiceNumber = results.itheDetailList.invoiceNumber,
        this.Mouse = results.itheDetailList.mouse,
        this.MouseSNO = results.itheDetailList.mouseSerialNumber,
        this.WorkingStatus = results.itheDetailList.workingStatusId
      if (results && results.itheDetailList) {
        this.data = true; // Set the data availability status to true
        // Set other fields based on the available data
      } else {
        this.data = false; // Set the data availability status to false
      }

    });

  }


  //NgModel to save the values
  Type: string;
  BayNo: string;
  Location: string;
  baynodisable: boolean = false;


  PcName: string;
  PcType: any;
  HardwareData: any[] = [];
  PcTypeV: any;

  Monitor: string;
  MonitorSno: string;
  keyboard: string;
  keyboardSno: string;

  Roll: string;
  Division: string;

  Brand: string;
  Model: string;

  WarrantyDetails: string;
  RAM: string;

  Processor: string;
  Graphics: string;

  HDD: string;
  TAGNumber: string;

  MacAddress: string;
  OS: string;

  IPAddress: string;
  ServerType: any;
  GetSTD: GETSTD[] = [
    { id: '1', description: "Server" },
    { id: '2', description: "Virtual Server" }
  ];
  ServerTypeV: any;

  InvoiceDate: Date;
  InvoiceNumber: string;
  Mouse: string;
  MouseSNO: string;
  WorkingStatus: any;
  GetWSD: GETWSD[] = [
    { id: '1', description: "Active" },
    { id: '2', description: "Repair" },
    { id: '3', description: "Stand By" }
  ];
  WorkingStatusV: any;
  //NgModel to save the values


  //second Form 
  SoftwareId: number[];
  SoftwareData: any[] = [];
  SoftwareStatus: number;


  //method to get the pctype dropdown
  getPcType() {
    this.http.get<any>(environment.apiURL + `ITAsset/nGetHardwareSoftware`).subscribe(results => {
      this.HardwareData = results.hardwareData;
    });
  }

  getSoftwareData() {
    this.http.get<any>(environment.apiURL + `ITAsset/nGetHardwareSoftware`).subscribe(results => {
      this.SoftwareData = results.softwareData;
    });
  }


  getTableData() {
    this.http.get<any>(environment.apiURL + `ITAsset/nGetTableITSAsset`).subscribe(results => {
      this.dataSource = results.titsDetailList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
    });
  }
  //mrthod to show the instock in input field
  onTypeChange() {

    if (this.Type === "2") {
      this.BayNo = 'Instock';
      // Disable the BayNo input field
      this.baynodisable = true;
    } else {
      // If the selected type is anything other than "InStock"
      // Reset the BayNo field to an empty value
      this.BayNo = '';
      // Enable the BayNo input field
      this.baynodisable = false;
    }
  }

  firstAdd() {
    console.log(this.Location,"location");
    let payloadupload = {
      "id": 0,
      "employeeId": this.loginservice.getUsername(),
      "BayNumber": this.BayNo,
      "Brand": this.Brand,
      "Division": this.Division,
      "EmployeeId": this.loginservice.getUsername(),
      "Graphics": this.Graphics,
      "HardwareId": "2",
      "Hdd": this.HDD,
      "InvoiceDate": this.InvoiceDate,
      "InvoiceNumber": this.InvoiceNumber,
      "IpAddress": this.IPAddress,
      "Keyboard": this.keyboard,
      "KeyboardSerialNumber": this.keyboardSno,
      "Location": this.Location,
      "MacAddress": this.MacAddress,
      "Model": this.Model,
      "Monitor": this.Monitor,
      "MonitorSerialNumber": this.MonitorSno,
      "Mouse": this.Mouse,
      "MouseSerialNumber": this.MouseSNO,
      "Os": this.OS,
      "PcName": this.PcName,
      "Processor": this.Processor,
      "Ram": this.RAM,
      "Roll": this.Roll,
      "ServerTypeId": this.ServerType,
      "TagNumber": this.TAGNumber,
      "WarantyDetails": this.WarrantyDetails,
      "WorkingStatusId": this.WorkingStatus,
      "softwareId": [],
      "softwareStatusId": 0,
      "serverType": "",
      "workingStatus": "",

    }
    this.http.post<any>(environment.apiURL + `ITAsset/nSetITHData`, payloadupload).subscribe(results => {
      console.log(results, "Firstnextc")
      this._coreService.openSnackBar("Data Added successfully!");
      this.id = results.ithDetailList.id;
    });
    console.log(payloadupload, "payloadinfirstpage");
  }


  secondadd(){
  

  console.log(this.apiResponseData.itheDetailList.id,"itassetsid")
    ///////////////////////////////////////////// PAYLAOD///////////////////////////////////////////////////

    let demoPayload = {
      "id": 0,
      "employeeId": this.loginservice.getUsername(),
      "itAssetId": this.apiResponseData.itheDetailList.id,
      "bayNumber": this.BayNo,
      "location": this.Location,
      "pcName": this.PcName,
      "hardwareId": "2",
      "monitor": this.Monitor,
      "monitorSerialNumber": this.MonitorSno,
      "keyboard":this.keyboard,
      "keyboardSerialNumber": this.keyboardSno,
      "roll": this.Roll,
      "division": this.Division,
      "brand": this.Brand,
      "model": this.Model,
      "warantyDetails": this.WarrantyDetails,
      "ram": this.RAM,
      "processor": this.Processor,
      "graphics": this.Graphics,
      "hdd": this.HDD,
      "tagNumber": this.TAGNumber,
      "macAddress": this.MacAddress,
      "os": this.OS,
      "ipAddress": this.IPAddress,
      "serverType": this.ServerType,
      "serverTypeId": this.ServerType,
      "invoiceDate": this.InvoiceDate,
      "invoiceNumber": this.InvoiceNumber,
      "mouse": this.Mouse,
      "mouseSerialNumber": this.MouseSNO,
      "workingStatus": this.WorkingStatus,
      "workingStatusId": this.WorkingStatus,
      "isDeleted": true,
      "createdBy": 0,
      "createdDate": new Date().toISOString,
      "updatedBy": 0,
      "updatedDate": new Date().toISOString,
      "softwareId": [],
      "softwareStatusId": 0
    }
    
    this.http.post<any>(environment.apiURL + `ITAsset/nUpdateITHData`, demoPayload).subscribe(results => {
      console.log(results, "updatedResults")
      this._coreService.openSnackBar("Data updated successfully!");
      this.id = results.ithDetailList.id;
    });
    console.log(demoPayload, "payloadinfirstpage");
  }


  softwareclick() {

    let AddPayload = {
      "id": 0,
      "employeeId": this.loginservice.getUsername(),
      "itAssetId": this.id,
      "bayNumber": "",
      "location": "",
      "pcName": "",
      "hardwareId": 0,
      "monitor": "",
      "monitorSerialNumber": "",
      "keyboard": "",
      "keyboardSerialNumber": "",
      "roll": "",
      "division": "",
      "brand": "",
      "model": "",
      "warantyDetails": "",
      "ram": "",
      "processor": "",
      "graphics": "",
      "hdd": "",
      "tagNumber": "",
      "macAddress": "",
      "os": "",
      "ipAddress": "",
      "serverType": "",
      "serverTypeId": 0,
      "invoiceDate": "",
      "invoiceNumber": "",
      "mouse": "",
      "mouseSerialNumber": "",
      "workingStatus": "",
      "workingStatusId": 0,
      "isDeleted": true,
      "createdBy": 0,
      "createdDate": new Date().toISOString(),
      "updatedBy": 0,
      "updatedDate": "",
      "softwareId": this.SoftwareId,
      "softwareStatusId": this.SoftwareStatus
    }
    console.log(AddPayload, "AddPayload");

    this.http.post<any>(environment.apiURL + `ITAsset/nSetITSData`, AddPayload).subscribe(results => {
      this._coreService.openSnackBar(results.itsDetailList);
      this.getTableData();

    });
  }


  updateData() {
    let payload = {
      "id": this.apiResponseData.itheDetailList.id
    }
    this.http.post<any>(environment.apiURL + `ITAsset/nGetEditedITAsset`, payload).subscribe(results => {
      let AddPayload = {
        "id": 0,
        "employeeId": this.loginservice.getUsername(),
        "itAssetId": this.id,
        "bayNumber": this.BayNo,
        "location": this.Location,
        "pcName": this.PcType,
        "hardwareId": 0,
        "monitor": this.Monitor,
        "monitorSerialNumber": this.MonitorSno,
        "keyboard": this.keyboard,
        "keyboardSerialNumber": this.keyboardSno,
        "roll": this.Roll,
        "division": this.Division,
        "brand": this.Brand,
        "model": this.Model,
        "warantyDetails": this.WarrantyDetails,
        "ram": this.RAM,
        "processor": this.Processor,
        "graphics": this.Graphics,
        "hdd": this.HDD,
        "tagNumber": this.TAGNumber,
        "macAddress": this.MacAddress,
        "os": this.OS,
        "ipAddress": this.IPAddress,
        "serverType": this.ServerType,
        "serverTypeId": results.itheDetailList.s,
        "invoiceDate": "",
        "invoiceNumber": "",
        "mouse": "",
        "mouseSerialNumber": "",
        "workingStatus": "",
        "workingStatusId": 0,
        "isDeleted": true,
        "createdBy": 0,
        "createdDate": new Date().toISOString(),
        "updatedBy": this.loginservice.getUsername(),
        "updatedDate": new Date().toISOString,
        "softwareId": this.SoftwareId,
        "softwareStatusId": this.SoftwareStatus
      }
      console.log(AddPayload, "AddPayload");

      this.http.post<any>(environment.apiURL + `ITAsset/nSetITSData`, AddPayload).subscribe(results => {
        this._coreService.openSnackBar(results.itsDetailList);
        this.getTableData();

      })
    });;
  }





  softwareSubmitclick() {
    this._coreService.openSnackBar("Record Added Successfully!")
  }
}
