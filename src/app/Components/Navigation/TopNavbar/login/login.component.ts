import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import saveAs from 'file-saver';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/Environments/environment';
import { SpinnerService } from 'src/app/Components/Spinner/spinner.service';
import { LoginService } from 'src/app/Services/Login/login.service';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(-50%)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms ease-in')
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ transform: 'translateX(0%)' }))
      ])
    ])
  ]

})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  isSubmitted: boolean;
  user: any;
  showUsernameField: boolean;
  showPasswordField: boolean;
  constructor(
    private loginservice: LoginService,
    private router: Router,
    private cookieService: CookieService,
    private spinnerService: SpinnerService,
    private http:HttpClient
  ) { }

  labelState = 'default';

  ngOnInit() {
    this.showUsernameField = false;
    this.showPasswordField = false;
  }



  // showUsernameField = true;
  // showPasswordField = true;

  onSubmit() {
    this.spinnerService.requestStarted();
    this.isSubmitted = true;
    this.showUsernameField = false;
    this.showPasswordField = false;
    this.loginservice.login(this.username, this.password).subscribe({
      next: (result) => {
        this.spinnerService.requestEnded();
        
        if (result.success== true) {
          this.cookieService.set('token', result.user.employeeName);
          this.cookieService.set('username', result.user.employeeId);
          this.cookieService.set('UserId', result.user.id);
          localStorage.setItem('token', result.user.employeeName);
          localStorage.setItem('username', result.user.employeeId);
          localStorage.setItem('UserId', result.user.id);
          
          // this.cookieService.set('password',window.btoa( result.user.password));
          this.username = this.user;
          this.router.navigate(['/topnavbar/dashboard']);
        }
        else{
          Swal.fire(
            'Login failed!',
            'Invalid Username or password!',
            'error'
          )
        }
      }
    });
  }
  
  // zipchecks(){
  //   let path = 'Clientorders_20000'
  //   // let path= this.jobCommonDetails.jobCommonDetails.tranFileUploadPath
  //   path = path.replace(/\\/g, '_');
     
  //         this.http.get(environment.apiURL+'Allocation/DownloadZipFile?path='+`${path}`).subscribe((response:any) => {
  //           console.log("test")
            
  //           // const data = new Blob([response], { type: 'application/octet-stream' });
  //           // console.log(data)
  //           // const url = window.URL.createObjectURL(data);
  //           // console.log(url)
  //           // const a = document.createElement('a');
  //           // a.href = url;
  //           // a.download = 'file-name.zip';
  //           // a.click();
  //           // window.URL.revokeObjectURL(url);
  //           // saveAs(new Blob([response.data], { type: "application/octet-stream" }), "test");
  //         });
            
  // }
  // zipcheck(): void {
  //   let path = 'Clientorders_20000'
  //   path = path.replace(/\\/g, '_');
     
  //   const fileUrl = environment.apiURL+'Allocation/DownloadZipFile?path='+`${path}`; // Replace with the actual URL of your zip file

  //   // Use HttpClient to make a GET request to fetch the zip file
  //   this.http.get(fileUrl, { responseType: 'blob' }).subscribe(response => {
  //     this.saveFile(response);
  //   });
  // }
  //   private saveFile(blob: Blob) {
  //     // Create a blob URL for the file
  //     const url = window.URL.createObjectURL(blob);
  
  //     // Create a link element to trigger the download
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'FileName.zip'; // Replace with the desired file name
  //     document.body.appendChild(a);
  
  //     // Trigger the click event to start the download
  //     a.click();
  
  //     // Clean up the blob URL and the link element
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //   }


}
