import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderServiceService } from 'src/app/services/LoaderService/loader-service.service';

import { LoaderState } from 'src/app/services/LoaderService/loader-state';
@Component({
  selector: 'app-new-loader',
  templateUrl: './new-loader.component.html',
  styleUrls: ['./new-loader.component.css']
})
export class NewLoaderComponent implements OnInit {
  loadingnew: boolean;
  private subscription: Subscription;
  constructor(private loaderService: LoaderServiceService) { 
   
  }

  ngOnInit() {
  this.subscription =this.loaderService.loaderState.subscribe((state: LoaderState) => {
    this.loadingnew = state.show;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
