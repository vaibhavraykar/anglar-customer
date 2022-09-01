import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business } from 'src/app/beans/business';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BusinessDetailsService {
  constructor(public httpClient: HttpClient) { }
  public viewBusinessDetails(userID: string,token:string): Observable<Business> {
    const httpHeaders = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        'content-type':'application/json'
      })
    };
    return this.httpClient.get<Business>(`${environment.domain}/nimaiUCM/UserDetails/viewBusinessDetails/` + userID, httpHeaders);
  }
  public updateBusinessDetails(businessData: Business, userID): Observable<Business> {
    return this.httpClient.post<Business>(`${environment.domain}/nimaiUCM/UserDetails/updateBusinessDetails`, businessData, { headers: { 'content-type': 'application/json' } });
  }
  public viewCountryList(): Observable<any> {
    return this.httpClient.get<any>(`${environment.domain}/nimaiUCM/UserDetails/viewDetailedCountry` , { headers: { 'content-type': 'application/json' } });
  } 
  public removeOwner(data: any): Observable<Business> {
    return this.httpClient.post<Business>(`${environment.domain}/nimaiUCM/UserDetails/removeOwner` , data, { headers: { 'content-type': 'application/json' } });
  }


}
