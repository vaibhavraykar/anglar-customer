import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ValidateRegex } from 'src/app/beans/Validations';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { LoaderServiceService } from 'src/app/services/LoaderService/loader-service.service';

import { LoginService } from 'src/app/services/login/login.service';
import { loads } from '../../../assets/js/commons';
import * as $ from '../../../assets/js/jquery.min';
import { TermAndConditionsComponent } from '../term-and-conditions/term-and-conditions.component';

@Component({
  selector: 'app-validate-activepasscode',
  templateUrl: './validate-activepasscode.component.html',
  styleUrls: ['./validate-activepasscode.component.css']
})
export class ValidateActivepasscodeComponent implements OnInit {
  public key: string;

Active:boolean;
errMessage: any;
passCode : any;

validateId: any="";
recaptchaReactive:any;
captchaErrMsg: string;
response: any;
emailAddress: any="";
attempts: any;
passValue: any;
termsAndcondition:any;
encryptionLengthnew:any;
nameInRoute: string;
tcFlag: string;
public parentURL: string = "";
public subURL: string = "";
parent:any;

@ViewChild(TermAndConditionsComponent, { static: true }) termsAndconditions: TermAndConditionsComponent;
  tremandcond: boolean;
  passCodenotmatch: boolean;
  useridblock: boolean;
  constructor(public router: ActivatedRoute, public route: Router, public lgsc: LoginService, private loader: LoaderServiceService, 
    private newloader: LoaderServiceService,public rsc: ForgetPasswordService) {



    this.router.queryParams.subscribe(params => {
      
      this.key = params["key"]
      this.nameInRoute  = this.key.split(' ').join('+');
 
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
         if(JSON.parse(JSON.stringify(response)).errCode == 'EX003' ){
          this.useridblock = true;
          this.attempts = JSON.parse(JSON.stringify(response)).message;
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
        
        //  new
      
       }
        },
        (error) => {
        }
      )  
    console.log(this.key);
   }

  ngOnInit() {
    loads();
  }

  captchaValue(){
    this.captchaErrMsg = "";
}
resolved(event){
  this.captchaErrMsg = "";
 }
  passCodenew ='123456';
  newvalue(){
 
   
  }

   onOTPClick(){
    // console.log((this.termsAndcondition).value);
    if (this.tremandcond != true){
    var element = <HTMLInputElement> document.getElementById("isCheckedForTerms");
    var isChecked = element.checked;
    if(isChecked){
      this.tcFlag='yes';
      console.log(this.tcFlag);
      $('#checkboxError').hide();
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
    var data = {
      "token" : this.passCode.split('_')[0],
      "passcodeValue": this.passValue,
      "recaptchaResponse":this.recaptchaReactive,
      // "userId":this.key,
      "userId": this.nameInRoute,
      "emailid": sessionStorage.getItem('custUserEmailId'),
      "id":this.validateId,
      "tkenLength": this.encryptionLengthnew

    }
   
    this.rsc.branchUserOTPnew(data).subscribe(
      (response) => {
        this.response = JSON.parse(JSON.stringify(response));
        console.log(response);
        var username = JSON.parse(JSON.stringify(response)).data.userId;
        var userId = JSON.parse(JSON.stringify(response)).data.userId;
       var user =JSON.parse(JSON.stringify(response)).data.firstName + " " + JSON.parse(JSON.stringify(response)).data.lastName;
        sessionStorage.setItem('userID', username);
        sessionStorage.setItem('username', user);

        if(JSON.parse(JSON.stringify(response)).errCode=='EX001'){
           // this.attempts="Invalid Details"
           this.attempts = JSON.parse(JSON.stringify(response)).message;
           this.passCodenotmatch = true;
           $("#attemptFail").show();
        
        }else
        {    
            
         
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
                this.route.navigate(['/automated/baau/new-transaction-qoute']);
              
              }
              else{
                this.recaptchaReactive=""
                this.attempts=JSON.parse(JSON.stringify(data)).message;
                this.errMessage=JSON.parse(JSON.stringify(data)).message;
            
               }
            
         }
      },
    );
    }
    else{
      this.tcFlag='no';
      $('#checkboxError').show();  
        
     }
    } else {
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
      var data = {
        "token" : this.passCode.split('_')[0],
        "passcodeValue": this.passValue,
        "recaptchaResponse":this.recaptchaReactive,
        // "userId":this.key,
        "userId": this.nameInRoute,
        "emailid": sessionStorage.getItem('custUserEmailId'),
        "id":this.validateId,
        "tkenLength": this.encryptionLengthnew
  
      }
     
      this.rsc.branchUserOTPnew(data).subscribe(
        (response) => {
          this.response = JSON.parse(JSON.stringify(response));
          console.log(response);
          var username = JSON.parse(JSON.stringify(response)).data.userId;
        
         var user =JSON.parse(JSON.stringify(response)).data.firstName + " " + JSON.parse(JSON.stringify(response)).data.lastName;
          sessionStorage.setItem('userID', username);
          sessionStorage.setItem('username', user);
          if(JSON.parse(JSON.stringify(response)).errCode=='EX001'){
            // this.attempts="Invalid Details"
            this.attempts = JSON.parse(JSON.stringify(response)).message;
            this.passCodenotmatch = true;
            $("#attemptFail").show();
          
          }else
          {
           
                if(JSON.parse(JSON.stringify(response)).flag=== 1)
                {
                  this.newloader.show();
                  // this.loader.isLoading.next(true);
                  this.route.navigate(['/automated/baau/new-transaction-qoute']);
                
                }
                else{
                  this.recaptchaReactive=""
                  this.attempts=JSON.parse(JSON.stringify(data)).message;
                  this.errMessage=JSON.parse(JSON.stringify(data)).message;
              
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
 acceptTerms(){
  var element = <HTMLInputElement> document.getElementById("isCheckedForTerms");
  var isChecked = element.checked;
  if(isChecked){
    this.tcFlag='yes';
    console.log(this.tcFlag);
    $('#checkboxError').hide();
  }
   else{
    this.tcFlag='no';
    $('#checkboxError').show();  
      
   }     
}

openTermAndServiceDialog(num) {   
  if(num==1){
    this.termsAndconditions.termsConditions();
  }else{
    this.termsAndconditions.privacyPolicy();
  }
}
 }

