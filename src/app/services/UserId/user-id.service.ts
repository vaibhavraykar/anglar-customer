import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserId } from './userId-state';

@Injectable({
  providedIn: 'root'
})
export class UserIdService {

  private userIdnew = new Subject<UserId>();
  UserId = this.userIdnew.asObservable();
  // private messageSource = new BehaviorSubject('default value');
  //  currentvalue = this.messageSource.asObservable();


   public userSource = new BehaviorSubject('');
   userMessage = this.userSource.asObservable();
  constructor() { }
 
newvalue(key: string){
  // this.messageSource.next(key);
}

  newuser(key){
    this.userIdnew.next(<UserId>{key});
  }
  changeUserName(username:string){
    this.userSource.next(username);
  }
}
