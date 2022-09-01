import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from '../../../../assets/js/jquery.min';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})
export class ErrorPopupComponent implements OnInit {
  public title: string;
  public message: string;
  public parent :string;
  // newparent: string;
  constructor(public router: Router) {

    let navigation = this.router.getCurrentNavigation();
   console.log(this.router.url);
    const state = navigation.extras.state as {
      title: string,
      message: string,
       parent:string
       
    };
    this.title = state.title;
    this.message = state.message;
    this.parent = state.parent;
    // this.newparent = login;
   }

  ngOnInit() {
    
  }

  close() {
    $('.modal').hide();
    if(this.parent === 'login'){
      this.router.navigate(['/'+this.parent]);
    } else if(this.parent === "accountactivation"){
      // this.router.navigate(['/'+this.parent]);
      this.router.navigate(['/'  + 'login']);
    } else if(this.parent === "forgetpassword"){
      this.router.navigate(['/'+this.parent]);
    
    }else if(this.parent==="cst/dsb/subscription" || this.parent==="bcst/dsb/subscription"){
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([this.parent])
        .then(success => console.log('navigation success?', success))
        .catch(console.error);
       }); 
    }else{
      this.router.navigate(['/'+this.parent]);
    }
   

  }

}
