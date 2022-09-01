import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notclosed: boolean;
  
  constructor(private tittleservice: TitleService) { 
    this.tittleservice.event.subscribe((v) => { 
      this.notclosed = v;
      console.log(this.notclosed);
    });
  }

  ngOnInit() {
  }

  closepostpaid(){
    this.tittleservice.event.next(false);
  }
  Paypostpaid(){
    this.tittleservice.plan.next(true);
  }

}
