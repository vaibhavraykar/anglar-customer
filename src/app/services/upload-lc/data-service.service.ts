import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  public refinance = new BehaviorSubject(false);
  // public bankGuarante=new BehaviorSubject(false);

  refinanting = this.refinance.asObservable();
  // bankGuarantee=this.bankGuarante.asObservable();


  constructor() { 
   
  }
}
