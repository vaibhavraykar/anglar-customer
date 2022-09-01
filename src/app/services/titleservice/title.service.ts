import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  public titleSource = new BehaviorSubject('NIMAI');
  titleMessage = this.titleSource.asObservable();
  public userSource = new BehaviorSubject('');
  userMessage = this.userSource.asObservable();
  public loading = new BehaviorSubject(false);
  loader = this.loading.asObservable();
  // loader = this.
  public quote = new BehaviorSubject(false);
  isQuote = this.quote.asObservable();

  // for post paid model code
  public event = new BehaviorSubject(false);
  active = this.event.asObservable();
// for postpaid
public postpaid = new BehaviorSubject(false);
activednew = this.postpaid.asObservable();
  // for plan 
  public plan = new BehaviorSubject(false);
  actived = this.plan.asObservable();





  constructor() { }

  changeTitle(title: string) {
    this.titleSource.next(title);
  }

  changeUserName(username:string){
    this.userSource.next(username);
  }
}
