import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../../Login/login.service';

@Injectable({
  providedIn: 'root'
})
export class SewOutService {

  constructor(private http:HttpClient,private loginservice:LoginService) { }

  getScopeDropdown():Observable<any> {
  return this.http.get(`https://localhost:7208/api/Allocation/getScopeValues/${this.loginservice.getUsername()}`)
  }

  getTabValue1():Observable<any> {
  return this.http.get(`https://localhost:7208/api/Allocation/getWorkflowJobList/${this.loginservice.getUsername()}/${this.loginservice.getProcessId()}/1/0`)
  }
  getTabValue2():Observable<any> {
  return this.http.get(`https://localhost:7208/api/Allocation/getWorkflowJobList/${this.loginservice.getUsername()}/${this.loginservice.getProcessId()}/2/0`)
  }
  getTabValue3():Observable<any> {
  return this.http.get(`https://localhost:7208/api/Allocation/getWorkflowJobList/${this.loginservice.getUsername()}/${this.loginservice.getProcessId()}/3/0`)
  }
  getTabValue4():Observable<any> {
  return this.http.get(`https://localhost:7208/api/Allocation/getWorkflowJobList/${this.loginservice.getUsername()}/${this.loginservice.getProcessId()}/4/0`)
  }
  getTabValue5():Observable<any> {
  return this.http.get(`https://localhost:7208/api/Allocation/getWorkflowJobList/${this.loginservice.getUsername()}/${this.loginservice.getProcessId()}/5/0`)
  }
  getTabValue6():Observable<any> {
    return this.http.get(`https://localhost:7208/api/Allocation/getWorkflowJobList/${this.loginservice.getUsername()}/${this.loginservice.getProcessId()}/6/0`) 
   }
  getTabValue7():Observable<any> {
    return this.http.get(`https://localhost:7208/api/Allocation/getWorkflowJobList/${this.loginservice.getUsername()}/${this.loginservice.getProcessId()}/7/0`) 
   }
}
