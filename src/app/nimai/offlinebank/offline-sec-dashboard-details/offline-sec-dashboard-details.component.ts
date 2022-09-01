import { Component, OnInit } from '@angular/core';
import * as $ from 'src/assets/js/jquery.min';
@Component({
  selector: 'app-offline-sec-dashboard-details',
  templateUrl: './offline-sec-dashboard-details.component.html',
  styleUrls: ['./offline-sec-dashboard-details.component.css']
})
export class OfflineSecDashboardDetailsComponent implements OnInit {
  open: boolean;

  constructor() {
    // $("#myModal18").show();
   }

  ngOnInit() {
    $("#myModal18").show();
  }
  closed(){
    $("#myModal18").hide();
  }

  openpopup(){
    console.log('i m here');
    $("#myModal18").hide();
    this.open = true;
    $("#myModal19").show();
  }
  closepopup(){
    $("#myModal19").hide();
  }
}
