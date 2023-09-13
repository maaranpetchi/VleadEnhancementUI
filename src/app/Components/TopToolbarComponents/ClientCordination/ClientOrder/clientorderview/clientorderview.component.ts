import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { environment } from 'src/Environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-clientorderview',
  templateUrl: './clientorderview.component.html',
  styleUrls: ['./clientorderview.component.scss']
})
export class ClientorderviewComponent {
  OrderDetails: any;


  constructor(private router: Router, private location: Location, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ClientorderviewComponent>, private http: HttpClient) {
    console.log(data, "InjectedData");
    this.getOrderList();
  }

  goBack() {
    this.dialogRef.close();
  }


  getOrderList(){
    this.http.get<any>(environment.apiURL+`ClientOrderService/GetClientByOrderId/1?orderId=${this.data.orderId}`).subscribe({
      next:(results)=>{
        this.OrderDetails = results.fileUploadPath;
      }
    })
  
    
    }
  files: string[] = [];

  downloadFiles(path: string) {
    path = path.replace(/\\/g, '_');
    this.http.get<any>(environment.apiURL + `Allocation/getFileNames/${path}`).subscribe((result: any) => {
      this.files = result.files;
      if (this.files.length > 0) {
        this.files.forEach((value: string) => {
          const url =environment.apiURL+`Allocation/downloadFilesTest/${path}/${value}`;
          this.fileDownload(url, value);
        });
      }
    });
  }

  fileDownload(url: string, fileName: string): void {
    this.http
      .get(url, {
        responseType: 'blob',
      })
      .subscribe((response: Blob) => {
        saveAs(response, fileName);
      });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Use saveAs to trigger the download
    saveAs(data, 'your-filename.xlsx');
  // }
  }



  ///zip download
  
  enableZipDownloadBtn = false;

  zipDownload(folderPath: string, fileName: string): void {
    this.enableZipDownloadBtn = true;
    folderPath = folderPath.replace(/\\/g, '_');
    this.http.get(environment.apiURL+"Home/DownloadZipFile", {
      responseType: 'arraybuffer',
      params: { path: folderPath }
    }).subscribe((response: ArrayBuffer) => {
      const blob = new Blob([response], { type: "application/octet-stream" });
      saveAs(blob, fileName + ".zip");
    }, () => { }, () => {
      this.enableZipDownloadBtn = false;
    });
  }
}
