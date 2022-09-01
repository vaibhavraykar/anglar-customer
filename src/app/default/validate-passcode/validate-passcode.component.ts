import { state } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as $ from '../../../assets/js/jquery.min';
import { ValidateRegex } from 'src/app/beans/Validations';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { LoginService } from 'src/app/services/login/login.service';
import { UserIdService } from 'src/app/services/UserId/user-id.service';
import { UserId } from 'src/app/services/UserId/userId-state';
import { loads } from '../../../assets/js/commons'
import { TermAndConditionsComponent } from '../term-and-conditions/term-and-conditions.component';

import { SignupService } from 'src/app/services/signup/signup.service';
import { LoaderServiceService } from 'src/app/services/LoaderService/loader-service.service';
// import { loads } from
@Component({
  selector: 'app-validate-passcode',
  templateUrl: './validate-passcode.component.html',
  styleUrls: ['./validate-passcode.component.css']
})
export class ValidatePasscodeComponent implements OnInit {
  public key: string;

subscription: Subscription;
passCode: any;
Active:boolean;
errMessage: any;
encryptionLengthnew:any
// passCode = "12345";
passCodenewok ="123456";
public username: string = "";
passValue: any;
validateId: any="";
recaptchaReactive:any;
captchaErrMsg: string;
response: any;
emailAddress: any="";
attempts: any;
nameInRoute: string;
tcFlag: string;
termsAndcondition: any;

@ViewChild(TermAndConditionsComponent, { static: true }) termsAndconditions: TermAndConditionsComponent;
  tremandcond: boolean;
  useridblock: boolean;
  passCodenotmatch: boolean;

  constructor(public router: ActivatedRoute, public route: Router, public lgsc: LoginService, private loader: LoaderServiceService,public Service: SignupService,
    private newloader: LoaderServiceService,    public data:  UserIdService,public rsc: ForgetPasswordService) { 
    this.router.queryParams.subscribe(params => {
      // this.key = params["BA56696"]
      // this.key = 'BA56696'
      this.key = params["key"]
      this.nameInRoute  = this.key.split(' ').join('+');
      console.log(this.nameInRoute);
      console.log(this.key);
    })

    let sendEmail = {
      "event": 'ADD_BRANCH_USER',
      // "userId": this.key,
      "userId": this.nameInRoute,
      // "usermode": 'offline'
     
    }
    console.log(sendEmail);
    this.rsc.sendBranchUserPasscode(sendEmail)
      .subscribe(
        (response) => {
         this.passCode = JSON.parse(JSON.stringify(response));
         this.validateId=JSON.parse(JSON.stringify(response)).id;
         this.encryptionLengthnew = JSON.parse(JSON.stringify(response)).encryptionLength;
         console.log(this.passCode);
         if(JSON.parse(JSON.stringify(response)).errCode == 'EX003' ){
            this.attempts = JSON.parse(JSON.stringify(response)).message;
            this.useridblock = true;
            $("#attemptFail").show();
         }
         // start tnc
         if(JSON.parse(JSON.stringify(response)).tcFlag == 'yes'){
            // console.log(' i accepted the trem and condition');
            this.tremandcond = true; 
         }else if(JSON.parse(JSON.stringify(response)).tcFlag != 'yes' ){
          //  console.log('not accepted');
           this.tremandcond = false;
         }
         //end of tnc 
         if(this.passCode.message=='Your account has blocked '){
              this.attempts=this.passCode.message;
           $('#attemptFail').show();
         }else{

         this.passCode = this.passCode.data;
         console.log('i m here')
        //  new
      
       }
        },
        (error) => {
        }
      )  


   
    console.log(this.key);
    var username = this.key;
    this.data.changeUserName(username);

  }

  ngOnInit() {
    loads();
  }

  captchaValue(){
    this.captchaErrMsg = "";
}
  ngOnDestroy(){
    // this.subscription.unsubscribe();
  }
passCodenew ='123456';

 resolved(event){
  this.captchaErrMsg = "";
 }
  onOTPClick(){
    console.log(this.passValue);
    console.log((this.termsAndcondition));
    console.log((this.passValue).value);
    if(this.tremandcond != true){
    var element = <HTMLInputElement> document.getElementById("isCheckedForTerms");
  var isChecked = element.checked;
  if(isChecked){
    this.tcFlag='yes';
    $('#checkboxError').hide();
 
   
    var username = this.key;
    this.data.changeUserName(username);
    
    if(!this.passValue && !this.recaptchaReactive){
      this.errMessage = "Kindly enter passcode!"; 
      this.captchaErrMsg="Please verify Google Recaptcha."
      return;
    }

    if(!this.passValue){
      this.errMessage = "Kindly enter passcode!";
    
      return;
    }
    if(!this.recaptchaReactive){     
      this.captchaErrMsg="Please verify Google Recaptcha."
      return;
    }
    // sessionStorage.setItem('token', this.passCode.split('_')[0]);
    var data = {
      "token" : this.passCode.split('_')[0],
      "passcodeValue": this.passValue,
      "recaptchaResponse":this.recaptchaReactive,
      // "userId":this.key,
      "userId":this.nameInRoute,
      "emailid": sessionStorage.getItem('custUserEmailId'),
      "id":this.validateId,
      "tkenLength": this.encryptionLengthnew,


    }

   
    this.rsc.branchUserOTPnew(data).subscribe(
      (response) => {
        this.response = JSON.parse(JSON.stringify(response));
        console.log(response);
        var username = JSON.parse(JSON.stringify(response)).data.userId;
        // var user = userId;
        var userId = JSON.parse(JSON.stringify(response)).data.userId;
        console.log(userId, ' user id');
       var user =JSON.parse(JSON.stringify(response)).data.firstName + " " + JSON.parse(JSON.stringify(response)).data.lastName;
        sessionStorage.setItem('userID', username);
        sessionStorage.setItem('username', user);
        console.log(username);
        console.log(user);
        console.log(this.key);

        
    
    this.newloader.show();
        //end
        if(JSON.parse(JSON.stringify(response)).errCode=='EX001'){
             // this.attempts="Invalid Details"
             this.attempts =JSON.parse(JSON.stringify(response)).message;
          this.passCodenotmatch = true;
          this.useridblock = false;
          $("#attemptFail").show();
          
        }else{
              if(JSON.parse(JSON.stringify(response)).flag=== 1)
              {
                // for tremsandcondition
     this.rsc.Termsandcondition(userId).subscribe(
      (response) => {
        console.log(response);
      }
     )
                this.newloader.show();
                // this.loader.isLoading.next(true);
                
                this.route.navigate(['/automated/baau/newrequest'])
              }
              else{
                this.recaptchaReactive="" 
                this.attempts=JSON.parse(JSON.stringify(data)).message;
                this.errMessage=JSON.parse(JSON.stringify(data)).message;
                $("#attemptFail").show();
                this.newloader.hide();
              
               }
        
         }
      },
    );
  }
    else{
      this.tcFlag='no';
      $('#checkboxError').show();      
     } 

    }
     else  {
      var username = this.key;
      this.data.changeUserName(username);
      
      if(!this.passValue && !this.recaptchaReactive){
        this.errMessage = "Kindly enter passcode!"; 
        this.captchaErrMsg="Please verify Google Recaptcha."
        return;
      }
  
      if(!this.passValue){
        this.errMessage = "Kindly enter passcode!";
      
        return;
      }
      if(!this.recaptchaReactive){     
        this.captchaErrMsg="Please verify Google Recaptcha."
        return;
      }
      // sessionStorage.setItem('token', this.passCode.split('_')[0]);
      var data = {
        "token" : this.passCode.split('_')[0],
        "passcodeValue": this.passValue,
        "recaptchaResponse":this.recaptchaReactive,
        // "userId":this.key,
        "userId":this.nameInRoute,
        "emailid": sessionStorage.getItem('custUserEmailId'),
        "id":this.validateId,
        "tkenLength": this.encryptionLengthnew,
  
  
      }
  
     
      this.rsc.branchUserOTPnew(data).subscribe(
        (response) => {
          this.response = JSON.parse(JSON.stringify(response));
          console.log(response);
          var username = JSON.parse(JSON.stringify(response)).data.userId;
          // var user = userId;
          var userId = JSON.parse(JSON.stringify(response)).data.userId;
          console.log(userId, ' user id');
         var user =JSON.parse(JSON.stringify(response)).data.firstName + " " + JSON.parse(JSON.stringify(response)).data.lastName;
          sessionStorage.setItem('userID', username);
          sessionStorage.setItem('username', user);
          console.log(username);
          console.log(user);
          console.log(this.key);
  
       
      
      this.newloader.show();
          //end
          if(JSON.parse(JSON.stringify(response)).errCode=='EX001'){
            // this.attempts="Invalid Details"
            this.attempts =JSON.parse(JSON.stringify(response)).message;
            this.passCodenotmatch = true;
            this.useridblock = false;
            $("#attemptFail").show();
            this.newloader.hide();
            
          }else{
                if(JSON.parse(JSON.stringify(response)).flag=== 1)
                {
                  this.newloader.show();
                  // this.loader.isLoading.next(true);
                  
                  this.route.navigate(['/automated/baau/newrequest'])
                }
                else{
                  this.recaptchaReactive="" 
                  this.attempts=JSON.parse(JSON.stringify(data)).message;
                  this.errMessage=JSON.parse(JSON.stringify(data)).message;
                  $("#attemptFail").show();
                  this.newloader.hide();
                
                 }
          
           }
        },
      );
     }


  }


  passCodeValue(){
    this.errMessage = "";
}
close(){
  $('#attemptFail').hide();
}
validateRegexFields(event, type){
  if(type == "noSpace"){
    var key = event.keyCode;
    if ( key == 32) {
      event.preventDefault();
    }
  }
  if(type == "number"){
    ValidateRegex.validateNumber(event);
  }
  else if(type == "alpha"){
    ValidateRegex.alphaOnly(event);
  }
  else if(type == "alphaNum"){
    ValidateRegex.alphaNumeric(event);
  }else if(type=="namewithspace"){
    var key = event.keyCode;
    if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/ || (event.shiftKey && key === 55) || key===190 /* . key*/)) {
        event.preventDefault();
    }    
  }

}



openTermAndServiceDialog(num) {   
  if(num==1){
    this.termsAndconditions.termsConditions();
  }else{
    this.termsAndconditions.privacyPolicy();
  }
}

acceptTerms(){
  var element = <HTMLInputElement> document.getElementById("isCheckedForTerms");
  var isChecked = element.checked;
  if(isChecked){
    this.tcFlag='yes';
    $('#checkboxError').hide();
  }
   else{
    this.tcFlag='no';
    $('#checkboxError').show();      
   }     
}


}


