import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JobHistoryComponent } from '../job-history/job-history.component';
import { environment } from 'src/Environments/environment';
import saveAs from 'file-saver';

@Component({
  selector: 'app-jobhistory-details',
  templateUrl: './jobhistory-details.component.html',
  styleUrls: ['./jobhistory-details.component.scss']
})
export class JobhistoryDetailsComponent implements OnInit {

  displayedJobColumns: string[] = ['movedFrom', 'movedTo', 'movedDate', 'movedBy','MovedTo', 'remarks' , 'files'];
  displayedQueryColumns: string[] = ['movedFrom', 'movedTo', 'movedDate', 'movedBy','MovedTo', 'remarks' ,'ProcessStatus', 'files'];
  jobHistory: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    public dialogRef: MatDialogRef<JobHistoryComponent>,

  ){}
  dataJobSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getJobHistoryDetails(this.data);
    
  }

  getJobHistoryDetails(data:any){
    this.http.post<any>(environment.apiURL+'JobOrder/getJobHistory',this.data.jId).subscribe(data => {
      console.log(data,"data");
      
      this.dataJobSource = data.jobHistory; 
  })
  }
  downloadExcell(path: any): void {
    // console.log(this.jobHistory.fileUploadPath,"upload");
    
    // let path= this.jobHistory.fileUploadPath
    path = path.replace(/\\/g, '_');
    this.http
      .get(
        environment.apiURL +
          `Allocation/getFileNames/${path}`
      )
      .subscribe((response: any) => {
        const fileUrls: string[] = response.files;
        fileUrls.forEach((url) => {
          this.http.get(environment.apiURL+'Allocation/downloadFilesTest/'+`${path}/`+url).subscribe((response:any) => {
            saveAs(new Blob([response.data], { type: "application/octet-stream" }), url);
          })
        });
      });
  }
  getFileNameFromPath(filePath: string): string {
    const pathParts = filePath.split('/');
    return pathParts[pathParts.length - 1];
  }

  closeButton(){
    this.dialogRef.close();
  }

}
