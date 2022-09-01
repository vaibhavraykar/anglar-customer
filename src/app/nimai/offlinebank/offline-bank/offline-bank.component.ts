import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-offline-bank',
  templateUrl: './offline-bank.component.html',
  styleUrls: ['./offline-bank.component.css']
})
export class OfflineBankComponent implements OnInit {

  constructor(public activatedRoute: ActivatedRoute, public route: Router) {
    this.activatedRoute.url.subscribe((urlPath) => {
      console.log(urlPath);
      console.log(urlPath[0]);
      console.log(urlPath[0].path);
    })
   }

  ngOnInit() {
  }

}
