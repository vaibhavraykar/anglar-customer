import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Email } from 'src/app/beans/Email';


@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  constructor(public httpClient: HttpClient) { }

  public sendForgetPasswordEmail(data:Email): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiEmail/sendSetPasswordLink` ,data, { headers: { 'content-type': 'application/json' } });
  }

  public validateToken(token: string): Observable<any> {
    return this.httpClient.get(`${environment.domain}/nimaiEmail/validatePasswordLink/` + token, { headers: { 'content-type': 'application/json' } });
  }

  public viewTermsAndPolicy(): Observable<any> {
    return this.httpClient.get(`${environment.domain}/nimaiUCM/viewTermsAndPolicy` , { headers: { 'content-type': 'application/json' } });
  }
  public getUpdateTnc(data): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiUCM/updateTnc`,data , { headers: { 'content-type': 'application/json' } });
  }


  public passwordChangeSuccess(data: any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiEmail/passwordChangeSuccess` , data, { headers: { 'content-type': 'application/json' } });
  }

  public sendEmailReferSubsidiary(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiEmail/sendSubsidiaryAcivationLink` ,data, { headers: { 'content-type': 'application/json' } });
  }

  public sendEmailBranchUser(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiEmail/sendBranchUserLink` ,data, { headers: { 'content-type': 'application/json' } });
  }

    public sendBranchUserPasscode(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiEmail/sendBranchUserPasscode` ,data, { headers: { 'content-type': 'application/json' } });
  }

  public branchUserOTP(otp,token): Observable<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        'content-type':'application/json'
      })
    };

    return this.httpClient.post(`${environment.domain}/nimaiEmail/validatePasscode`, otp, httpHeaders);
  }
  public branchUserOTPnew(otp,): Observable<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " ,
        'content-type':'application/json'
      })
    };

    return this.httpClient.post(`${environment.domain}/nimaiEmail/validatePasscode`, otp, httpHeaders);
  }

  public validateInvalidCaptcha(userid) : Observable<any>{
    return this.httpClient.post<any>(`${environment.domain}/nimaiEmail/validateInvalidCaptcha/`+userid, { headers: { 'content-type': 'application/json' } });
  }


  // for automated Baau terms and condition;
  public Termsandcondition(userid) : Observable<any>{
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/updateTnC/`+userid, { headers: { 'content-type': 'application/json' } });
  }
  


}
