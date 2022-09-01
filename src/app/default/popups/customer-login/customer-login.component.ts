import { Component, OnInit,ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from '../../../../assets/js/jquery.min';
import { FormGroup, FormControl } from '@angular/forms';
import {Validators} from '@angular/forms';
import  { ValidateRegex } from '../../../beans/Validations';
import { SignupService } from 'src/app/services/signup/signup.service';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { loads } from '../../../../assets/js/commons'
import { TitleService } from 'src/app/services/titleservice/title.service';
import { LoginComponent } from '../../login/login.component';
import { environment } from 'src/environments/environment';
import { LoaderServiceService } from 'src/app/services/LoaderService/loader-service.service';
@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css']
})
export class CustomerLoginComponent implements OnInit {
  public parent: string;
  emailAddress: any="";
  submitted: boolean = false;
  passCode: any;
  loading:boolean;
  passValue: any;
  recaptchaReactive:any;
  errMessage: any;
  userId: string;
  captchaErrMsg: string;
  attempts: any;
  validateId: any="";
  response: any;
  tradeSupport: string;
  tradeName: string;
  loadingnew: boolean;
public parentURL:string ="";

  constructor(public titleService: TitleService,public router: Router, public Service: SignupService, public fps: ForgetPasswordService,
    private loaderservice: LoaderServiceService, private el: ElementRef,public activatedRoute: ActivatedRoute,) {

    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      parent: string
    };
    this.parent = state.parent;
    console.log(this.parent);
    console.log(this.activatedRoute.url);
    this.activatedRoute.url.subscribe((urlPath) => {
      console.log(urlPath);
      console.log(urlPath[0]);
      console.log(urlPath[0].path);
    })
    // this.activatedRoute.parent.url.subscribe((urlPath) => {
    //   this.parentURL = urlPath[urlPath.length - 1].path;
    // });
  }

  customerLoginForm = new FormGroup({
    //batch_id: new FormControl('', [Validators.required,Validators.minLength(3)]),
    employee_id: new FormControl('', [Validators.required,Validators.minLength(3)]),
    email_id: new FormControl('', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]),
    employee_name: new FormControl('', [Validators.required])
  })

  get custLogDetails() {
    return this.customerLoginForm.controls;
  }

  ngOnInit() {
    this.loaderservice.hide();
    this.tradeSupport= environment.support;
    this.tradeName= environment.name;
    // this.titleService.loading.next(false); // new
    this.userId=sessionStorage.getItem('userID');
    if(this.userId.startsWith('RE')){
     // $('.modal1').show();
     let kycStatus=sessionStorage.getItem("kStatus")
     if(kycStatus=="KycStauts:Approved"){
       $('.modal1').show();
 
       }else{  
         this.onBALoginClick()
         $('.modal2').show();
 
       }
    }else if(this.userId.startsWith('BA')){
      this.onBALoginClick()
      $('.modal2').show();

    }else if(this.userId.startsWith('BC')){
      let kycStatus=sessionStorage.getItem("kStatus")
     if(kycStatus=="KycStauts:Approved"){
       $('.modal1').show();
 
       }else{  
         this.onBALoginClick()
         $('.modal2').show();
 
       }

  }else if(this.userId.startsWith('CU')){
    let kycStatus=sessionStorage.getItem("kStatus")
    if(kycStatus=="KycStauts:Approved"){
      $('.modal1').show();

      }else{  
        this.onBALoginClick()
        $('.modal2').show();

      }
    


  }



    loads();
  }
  ngAfterViewInit() {
    /*added by ashvini -Default cursor should be present in the Branch ID field of the Enter Access Details page of the Bank as Customer. */
    const first_input = this.el.nativeElement.querySelector('.first_input');
    first_input.focus();
  }
  close() {
    $('.modal1').hide();
    $('#attemptFail').hide();
    if (this.parent === 'login') {
      this.router.navigate(['/' + this.parent]);
    } else {
      this.router.navigate(['/nimai/' + this.parent]);
    }



  }



  onBALoginClick() {    
        let sendEmail = {
          "event": 'ADD_BRANCH_USER',
          "userId": sessionStorage.getItem("userID"),
         
        }
        this.fps.sendBranchUserPasscode(sendEmail)
          .subscribe(
            (response) => {
             this.passCode = JSON.parse(JSON.stringify(response));
             this.validateId=JSON.parse(JSON.stringify(response)).id;
            //  if(this.passCode.message=='Your account has blocked '){
            //       this.attempts=this.passCode.message;
            //    $('#attemptFail').show();
            //  }else{

             this.passCode = this.passCode.data;
             console.log('i m here')
             // new
             this.titleService.loading.next(false);
              sessionStorage.setItem('branchUserEmailId', this.emailAddress);
              $('.modal1').hide();
              $('.modal2').show();
           // }
            },
            (error) => {
              if(this.passCode.message=='Your account has blocked '){
                this.attempts=this.passCode.message;
             $('#attemptFail').show();
           }
              $('.modal1').hide();
              $('.modal3').show();
              // alert("unable to send mail")

            }
          )     
          const dat=  {
            "userId":sessionStorage.getItem('userID'),
            "password":"password",
            "emailId":this.emailAddress,
          }
          this.Service.authenticate(dat).subscribe((response)=>{
          sessionStorage.setItem('token',JSON.parse(JSON.stringify(response)).token)
          })
  }

  onLoginClickWOA(){
  let sendEmail = {
    "event": 'ADD_BRANCH_USER',
    "emailId": this.emailAddress,
    "userId": sessionStorage.getItem("userID"),
    "employeeName":this.customerLoginForm.get('employee_name'),
    "branchId": ""
  }
  this.fps.sendEmailBranchUser(sendEmail)
    .subscribe(
      (response) => {
       this.passCode = JSON.parse(JSON.stringify(response));
       this.passCode = this.passCode.data;
        sessionStorage.setItem('branchUserEmailId', this.emailAddress);
        $('.modal1').hide();
        $('.modal2').show();
      },
      (error) => {
        $('.modal1').hide();
        $('.modal3').show();
        // alert("unable to send mail")

      }
    )

}

  onCustLoginClick() {    
    this.submitted = true;
    this.emailAddress = this.customerLoginForm.get('email_id').value.trim();
    this.customerLoginForm.get('email_id').setValue(this.customerLoginForm.get('email_id').value.trim())
    if (this.customerLoginForm.invalid) {
      return;
    }
    this.submitted = false;   
    let userID: string = sessionStorage.getItem('userID');
    this.Service.userBranch(this.customerLoginForm.value,userID).subscribe(
      (response) => {
      let responseData = JSON.parse(JSON.stringify(response));
      var matches = responseData.data.match(/\d+/g)
      sessionStorage.setItem('custUserEmailId', this.emailAddress);
     
      if (matches != null) {
      
        let sendEmail = {
          "event": 'ADD_BRANCH_USER',
          "emailId": this.emailAddress,
          "userId": sessionStorage.getItem("userID"),
          "employeeName":this.customerLoginForm.get('employee_name').value,
          "branchId": responseData.data
        }
        this.fps.sendEmailBranchUser(sendEmail)
          .subscribe(
            (response) => {
           
             this.passCode = JSON.parse(JSON.stringify(response));
             this.validateId=JSON.parse(JSON.stringify(response)).id;
             if(this.passCode.errCode=='EX003'){
               this.attempts=this.passCode.message
               $('#attemptFail').show();
             }else{
              this.passCode = this.passCode.data;
              sessionStorage.setItem('branchUserEmailId', this.emailAddress);
              $('.modal1').hide();
              $('.modal2').show();
             }
            
            },
            (error) => {
              $('.modal1').hide();
              $('.modal3').show();
              // alert("unable to send mail")

            }
          )


          
        }
        else{
          $('.modal1').hide();
          $('.modal3').show();
        }
      },
      (error) => { }
    );
    const dat=  {
      "userId":sessionStorage.getItem('userID'),
      "password":"password",
      "emailId":this.emailAddress,
    }
    this.Service.authenticate(dat).subscribe((response)=>{
    sessionStorage.setItem('token',JSON.parse(JSON.stringify(response)).token)
    })
  }

  passCodeValue(){
      this.errMessage = "";
  }
  captchaValue(){
    this.captchaErrMsg = "";
}
resolved(event){
 this.captchaErrMsg = "";
}
  onOTPClick() {
    // this.loadingnew = true;
    this.titleService.loading.next(true);
   
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
      "userId":sessionStorage.getItem('userID'),
      "emailid": sessionStorage.getItem('custUserEmailId'),
      "id":this.validateId

    }
   
    this.fps.branchUserOTP(data,sessionStorage.getItem('token')).subscribe(
      (response) => {
       
        this.response = JSON.parse(JSON.stringify(response));
        if(JSON.parse(JSON.stringify(response)).errCode=='EX001'){
          this.attempts="Invalid Details"
          $("#attemptFail").show();
          this.loaderservice.hide();
        }else{
          this.titleService.loading.next(true);
          this.loaderservice.show();
          this.fps.validateInvalidCaptcha(sessionStorage.getItem('userID')).subscribe(data=>{
            // this.titleService.loading.next(false); //new
       if(JSON.parse(JSON.stringify(data)).message== "Authorise Access"){
        this.titleService.loading.next(true); // new
        // setTimeout(( 
        // ) => {
        //   if(this.response.flag == 1){
         
        //     this.titleService.loading.next(true);
        //     console.log('im herer');
        //     this.titleService.loading.next(true);
        //     let kycStatus=sessionStorage.getItem("kStatus")
        //     if(this.response.data.userId.startsWith('BC')){
        //       if(kycStatus=="KycStauts:Approved"){
        //         this.titleService.loading.next(false);
        //         this.router.navigate(['/cst/dsb/dashboard-details']);   
        //       }else if(kycStatus=="KycStauts:Rejected"){
        //         this.router.navigate(['/cst/dsb/kyc-details']);   
        //       }else {
        //         this.router.navigate(['/cst/dsb/personal-details']);   
        //       }
        //     }
        //    else if(this.response.data.userId.startsWith('CU')){
        //     if(kycStatus=="KycStauts:Approved"){
        //       this.router.navigate(['/cst/dsb/dashboard-details']); 
        //     }else if(kycStatus=="KycStauts:Rejected"){ 
        //       this.router.navigate(['/cst/dsb/kyc-details']); 
        //     }else{
        //       this.router.navigate(['/cst/dsb/personal-details']); 
        //     }
        //   }
        //     else if(this.response.data.userId.startsWith('BA')){
        //       // new
        //       // this.titleService.loading.next(true);
        //     //   if(kycStatus=="KycStauts:Approved"){
        //     // // setTimeout(() => {
        //     // //   this.router.navigate(['/bcst/dsb/dashboard-details']);
        //     // // }, );
        //       if(kycStatus=="KycStauts:Approved"){
        //         this.router.navigate(['/bcst/dsb/dashboard-details']);  
        //       }else if(kycStatus=="KycStauts:Rejected"){
        //         this.router.navigate(['/bcst/dsb/kyc-details']);   
        //       }else{  
        //         this.router.navigate(['/bcst/dsb/personal-details']);  
        //       }
        //     }
        //     else if(this.response.data.userId.startsWith('RE')){
        //       if(kycStatus=="KycStauts:Approved"){
        //       this.router.navigate(['/ref/rcs/dashboard-details']);   
        //       }else if(kycStatus=="KycStauts:Rejected"){
        //       this.router.navigate(['/ref/rcs/kyc-details']);   
        //       }else{  
        //       this.router.navigate(['/ref/rcs/personal-details']);    
        //       }
        //     }
        //     $('.modal2').hide();
        //     this.loading = true;
        //     this.titleService.loading.next(true);
        //     setTimeout(() => {
        //       this.titleService.loading.next(false);
        //     }, 4000);
        //     this.titleService.loading.next(false);
        //   } else{
        //    this.recaptchaReactive=""
        //     this.errMessage = response.message;
        //     if(this.errMessage=='Attempt excedded'){
        //     this.attempts=this.errMessage
        //             $("#attemptFail").show();
        //     }
        //   } 
        //   this.titleService.loading.next(true);
        // }, 4000);
         if(this.response.flag == 1){
         
          this.titleService.loading.next(true);
          console.log('im herer');

          let kycStatus=sessionStorage.getItem("kStatus")
          console.log(kycStatus);
          if(this.response.data.userId.startsWith('BC')){
            if(kycStatus=="KycStauts:Approved"){
              this.titleService.loading.next(false);
              this.router.navigate(['/cst/dsb/dashboard-details']);   
            }else if(kycStatus=="KycStauts:Rejected"){
              this.router.navigate(['/cst/dsb/kyc-details']);   
            }else {
              this.router.navigate(['/cst/dsb/personal-details']);   
            }
          }
         else if(this.response.data.userId.startsWith('CU')){
          if(kycStatus=="KycStauts:Approved"){
            this.router.navigate(['/cst/dsb/dashboard-details']); 
          }else if(kycStatus=="KycStauts:Rejected"){ 
            this.router.navigate(['/cst/dsb/kyc-details']); 
          }else{
            this.router.navigate(['/cst/dsb/personal-details']); 
          }
        }
          else if(this.response.data.userId.startsWith('BA')){
            if(kycStatus=="KycStauts:Approved"){
              
              this.titleService.event.next(true); // for post paid
              this.router.navigate(['/bcst/dsb/dashboard-details']);  
            }else if(kycStatus=="KycStauts:Rejected"){
              this.router.navigate(['/bcst/dsb/kyc-details']);   
            }else{  
              this.router.navigate(['/bcst/dsb/personal-details']);  
            }
          }
          else if(this.response.data.userId.startsWith('RE')){
            if(kycStatus=="KycStauts:Approved"){
            this.router.navigate(['/ref/rcs/dashboard-details']);   
            }else if(kycStatus=="KycStauts:Rejected"){
            this.router.navigate(['/ref/rcs/kyc-details']);   
            }else{  
            this.router.navigate(['/ref/rcs/personal-details']);    
            }
          }
          // $('.modal2').hide();
          this.titleService.loading.next(false);
        } else{
         this.recaptchaReactive=""
          this.errMessage = response.message;
          this.loaderservice.hide();
          if(this.errMessage=='Attempt excedded'){
          this.attempts=this.errMessage
                  $("#attemptFail").show();
          }
        }
        this.titleService.loading.next(true);
        this.loaderservice.show()
        this.loading = true;
       }else{
        this.recaptchaReactive=""
        this.attempts=JSON.parse(JSON.stringify(data)).message;
        this.errMessage=JSON.parse(JSON.stringify(data)).message;
        // $("#attemptFail").show();
        this.loaderservice.hide();
       }
          })
    }
      },
      (err) => {
        this.recaptchaReactive=""
        console.log(err)
        this.loaderservice.hide();
      }
    )
    this.titleService.loading.next(true);
  }

  attemptOk(){
    this.router.navigate(['/'])
    // $("#attemptFail").hide();
    // $('.modal2').hide();
    // $('.modal1').hide();
    // $('.modal3').hide();
  }

  reenterCustLoginDetails() {
    $('.modal3').hide();
    $('.modal1').show();
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

}
