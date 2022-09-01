import { TitleService } from 'src/app/services/titleservice/title.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { Subscription } from 'src/app/beans/subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';
import { loads } from '../../../assets/js/commons';

import { Router, NavigationExtras, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { onlinePaymentDltString } from 'src/app/beans/payment';
import { OnlinePaymentService } from 'src/app/services/payment/online-payment.service';
import {CookieService } from 'ngx-cookie-service';
import { ValidateRegex } from 'src/app/beans/Validations';
import { environment } from 'src/environments/environment';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import {paypalScript} from '../../../assets/js/commons';
import { concatMapTo, filter, pairwise } from 'rxjs/operators';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
  providers: [CookieService]
})
export class SubscriptionComponent implements OnInit {
  @ViewChild('content',{static:true}) content: ElementRef;
  @ViewChild('pdfTable',{static:true}) pdfTable!: ElementRef;
  
  @ViewChild('paypal',{static:true} )paypalElement: ElementRef;  
  isShow :boolean=false;
  public isVas: boolean=false;
  private cookies:string;
  public isRemove=false;
  public isApply=true;
  discountId:any=0;
  public loading = true;
  public isNew = false;
  public isOrder = false;
  public isPayment = false;
  public isPaymentSuccess = false;
  public isvasapplied:any;
   
  public title: string = "Subscription Details";
  public choosedPlan: Subscription = new Subscription();
  public paymentForm: FormGroup;
  public timeStamp = new Date();
  public parentURL: string = "";
  public subURL: string = "";
  advDetails: any = "";
  advPrice: any=0;
  choosedPrice: any;
  addedAmount: any="";
  grandTotal:any;
  showVASPlan :boolean= false;
  callVasService=false;
  isRenew = false;
  isnewPlan=false;
isRenewPlan=false;
  vas_id:any;
  branchUserEmailId: string;
  custUserEmailId:string;
  public isCustomer = false;
  status: any;
  hideRenew: boolean=false;
  couponError=false;
  hideBranches:boolean=true;
  couponSuccess:any;
  amountAfterCoupon:any;
  index:number=0;
  discount:any=0;
  public data: any;
  paymentTransactionId:any;
  detail: any="";
  pgDetail: any;
  param1: any;
  param2: any;
  pgstatus: void;
  creditStatus: any="";
  subscriptionBAC: boolean=true;
  addVasEnabled: boolean=false;
  vasPDetails: any="";
  vasPlanId: any=0;
  nimaiCount: any;
  buyNowfailMsg: any;
  trnxFailMsg: any;
  getcountData: any;
  afterAddingVas: any=0;
  verifyData: any;
  verifyId: any="";
  discountAmount: any=0;
  disableSendRequest: boolean=false;
  d_discount: any=0;
  showDiscount: boolean=false;
  isBA: boolean=false;
  public payPalConfig?: IPayPalConfig;
  paymentId: any="";
  token: any="";
  PayerID: any="";
  pgResponse: any="";
  vasPending: string="";
  subsStartDate: string;
  trnxPendingMsg: string;
  lcCredits: any;
  tradeSupport: string;
  viewAdvDetails: any[]=[];
  subCurrency: string;
  isVasBtn: boolean=true;
  isVasRemoveBtn: boolean=false;
  isPayementZero: boolean=false;
  isBAC: boolean=true;
  isRejected: boolean=false;
  userid: string;
  isBAA: boolean;
  pricing: any="";
  coupon: string="";
  fieoCoupon: any;
  isFieoCoupon: boolean=false;
  discountWithVas: number;
  isRemoveCoupon: boolean=false;
  discounFieo: string;
  fieoCouponMsg:boolean=false;
  isVasIds: boolean=false;
  getAdvisoryList: any;
  vasAdded: any;
  public advisoryService: any[]=[];
  previousPlansList: any[]=[];
  //htmlToPdf:string="<!DOCTYPE html><html><head></head><body><h1>This is a Heading</h1><p style=color:red;>This is a paragraph.</p></body></html>";
  htmlToPdf: any[]=[];
  dataPdf:any;
  downloadPdf:boolean;
  isVasInvoice: boolean=false;
  srNoForDiscount: any;
  srNoForVas: string;
  emailid: string="";

  
  
  //vasPDetails: Array<Subscription> = new Array<Subscription>();
  constructor(private cookieService:CookieService, private onlinePayment:OnlinePaymentService,public activatedRoute: ActivatedRoute, public titleService: TitleService, public subscriptionService: SubscriptionDetailsService, public fb: FormBuilder, public router: Router,private el: ElementRef) {
    this.paymentForm = this.fb.group({
      merchantId:[''],
      orderId:[''],
      currency:[''],
      amount:[''],
      redirectURL:[''],
      cancelURL:[''],
    });

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });

    // this.router.events
    // .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    // .subscribe((events: RoutesRecognized[]) => {
    //   console.log('previous url', events[0].urlAfterRedirects);
    //   console.log('current url', events[1].urlAfterRedirects);
    // });

   this.vasPending= sessionStorage.getItem('vasPending')
if(this.vasPending=='No'){
 this.addedAmount=sessionStorage.getItem('withVasAmt')
this.isVas=true;
//this.addedAmount=parseFloat(sessionStorage.getItem("subscriptionamount")) + parseFloat(this.addedAmount);
this.getVasPending();
let navigation = this.router.getCurrentNavigation();

}else{
  this.isVas=false;
    let navigation = this.router.getCurrentNavigation();

    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "New-Transaction"){
        this.getSubscriptionDetails();
      }
    }
    else{
      this.getPlan(sessionStorage.getItem("userID"));
// if(sessionStorage.getItem('status').toLowerCase()=='inactive'){
//   this.getSubscriptionDetails();
// }else{
//   this.getPlan(sessionStorage.getItem("userID"));
// }      
     
    }
  }

  }

  ngOnInit() {   
    $('#pdf').hide();
    this.userid=sessionStorage.getItem('userID');
    this.tradeSupport=environment.support
    this.activatedRoute.queryParams.subscribe(params => {
      this.paymentId = params["paymentId"],   
      this.PayerID=params["PayerID"],
      this.token=params["token"]
    })
   // paypalScript();  
    this.branchUserEmailId = sessionStorage.getItem('branchUserEmailId');
    this.custUserEmailId=sessionStorage.getItem('custUserEmailId');
    var userid=sessionStorage.getItem('userID')
  //  this.d_discount=sessionStorage.getItem('discountAmount')
  //  if(this.d_discount>0){
    
  //   this.showDiscount=true;
  //  }
    loads();
    this.titleService.changeTitle(this.title);
  
    this.getpaymentGateway();

    this.getStatus(); 
    this.getPreviousPlans()
this.getFieoToken();
    if(userid.startsWith('CU')){
      this.isBA=false;
     this.emailid=sessionStorage.getItem('branchUserEmailId');
    }else if(userid.startsWith('BA') ){
      this.isBA=true;
      this.emailid="";
    }
     else{
      this.isBA=false;
      this.emailid=sessionStorage.getItem('branchUserEmailId');
    }
  if( sessionStorage.getItem('page')=='cancelled'){
      this.renewPlan();
    }
   //this.download(this.paymentTransactionId)

  }
 
  getFieoToken(){

  this.onlinePayment.getLeadsCouponCode(this.custUserEmailId).subscribe((response)=>{
    let data=JSON.parse(JSON.stringify(response)).data;
    setTimeout(() => {
      if(data){
      this.fieoCoupon=data; 
      this.fieoCouponMsg=true;
        this.coupon="**********";
        $("#coupon").val("**********");
        this.applyNow($("#coupon").val());
      }
      // else{
      //   this.discounFieo="20%";
      // }
    }, 200);

  })
}
getPreviousPlans() {

  const userid={
    "userid":sessionStorage.getItem('userID')
  }

  this.subscriptionService.getPreviousPlans(userid).subscribe((res)=>{
    this.previousPlansList= JSON.parse(JSON.stringify(res)).data
    console.log(this.previousPlansList)
  })
}
  getpaymentGateway(){
  
  const data={
     "orderId":this.token,
     "payerId":this.PayerID,
     "userId" :sessionStorage.getItem('userID')
  }
  // if(data.paymentId && data.payerId){
    if(this.token){

      this.onlinePayment.PGResponse(data).subscribe((response)=>{
        this.pgResponse=JSON.parse(JSON.stringify(response))     
       sessionStorage.setItem('page',this.pgResponse.status);
       if(this.pgResponse.data){
       this.d_discount=this.pgResponse.data.discAmount;
       if(this.d_discount>0){        
        this.showDiscount=true;
       }else{
        this.showDiscount=false;
       }
      }
 if(this.pgResponse.status=='Success'){
  
    this.payment(this.pgResponse);

  }else if(this.pgResponse.status=='Failed'){
    const navigationExtras: NavigationExtras = {
      state: {
        title: 'Transaction has been failed',
        message:'',
        parent: this.subURL + '/' + this.parentURL + '/subscription'
      }
    };          
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
    .then(success => console.log('navigation success?', success))
    .catch(console.error);
  }); 

  }
  else if(this.pgResponse.status=='Cancelled')
{
  
  const navigationExtras: NavigationExtras = {
    state: {
      title: 'Transaction has been Cancelled',
      message:'',
      parent: this.subURL + '/' + this.parentURL + '/subscription'
    }
  };          
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
  .then(success => console.log('navigation success?', success))
  .catch(console.error);
}); 
}  

else if(this.pgResponse.status=='Declined')
{
  const navigationExtras: NavigationExtras = {
    state: {
      title: 'Your payment transaction has been declined.',
      message:'',
      parent: this.subURL + '/' + this.parentURL + '/subscription'
    }
  };          
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
  .then(success => console.log('navigation success?', success))
  .catch(console.error);
}); 
  //this.paypalPayNow();
  
} 
  else{
    console.log(this.pgResponse.status)
  }


      })
}
  //   else{
  //        const navigationExtras: NavigationExtras = {
  //     state: {
  //       title: 'Transaction has been cancelled',
  //       message:'',
  //       parent: this.subURL + '/' + this.parentURL + '/subscription'
  //     }
  //   };          
  //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //   this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
  //   .then(success => console.log('navigation success?', success))
  //   .catch(console.error);
  // }); 
  //   }

  // this.cookies= this.cookieService.get('status');
  // if(this.cookies=='Success'){
  
  //   this.payment(this.cookies);

  // }else if(this.cookies=='Failure'){
  //   document.cookie = 'status' +'=; Path=/';

  //   const navigationExtras: NavigationExtras = {
  //     state: {
  //       title: 'Transaction has been failed',
  //       message:'',
  //       parent: this.subURL + '/' + this.parentURL + '/subscription'
  //     }
  //   };          
  //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //   this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
  //   .then(success => console.log('navigation success?', success))
  //   .catch(console.error);
  // }); 
  // }else{
  //   console.log("this.cookies")
  // }
  
  }
  subscriptionDetails = [];
  getSubscriptionDetails() {
    this.titleService.loading.next(true);
    let req = {
      "userId": sessionStorage.getItem('userID'),
      "countryName": sessionStorage.getItem('registeredCountry')
    }
    this.subscriptionService.getPlansByCountry(req).subscribe(data => {
      this.isPaymentSuccess=false;      
      if(!this.isRenew){
        this.isNew = true;
        this.isnewPlan=true;
      }else{
        this.isNew = false;
      }    
      var userid = sessionStorage.getItem("userID");
    if(data)
      {
        if((userid.startsWith('CU'))){
          this.subscriptionDetails = data.data.customerSplans;
          this.isCustomer=true;
        } else if(userid.startsWith('BC')){
          this.subscriptionDetails = data.data.customerSplans;
          this.isCustomer=true;
          this.subscriptionBAC=false;
          this.isBAC=false;
        }
        else{
        this.subscriptionDetails = data.data.banksSplans;
          this.isCustomer=false;
        }
      }
      this.loading = false;
    }
    )
  }
  //added by ashvini -  “Next” button in the payment successful  page
  gotokyc(){
     //this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`])

if(this.isRejected && sessionStorage.getItem('kycStatus').toLowerCase()!='approved'){
 this.getSubscriptionDetails() //buynow
}else{
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`])
    .then(success => console.log('navigation success?', success))
    .catch(console.error);
   }); 
}
   }

public getVasPending(){
  
  this.callVasService=true
    let req = {
    "userId": sessionStorage.getItem('userID'),
    "countryName": sessionStorage.getItem('registeredCountry')
  }
  this.subscriptionService.getPlansByCountry(req).subscribe(response => {    
    this.data= JSON.parse(JSON.stringify(response)).data.customerSplans;
console.log(this.data)
    for(var x = 0; x < this.data.length; x++){
      if(this.data[x].subscriptionId==sessionStorage.getItem('subscriptionid')){
        this.vasPDetails=this.data[x];
      }     
    }
    this.subCurrency=this.vasPDetails.subscriptionCurrency;
//this.choosePlan(this.vasPDetails,'renew')
this.vasPDetails.userId=sessionStorage.getItem('userID')
this.choosedPlan=this.vasPDetails;

const arr=sessionStorage.getItem('vasId').split("-");


arr.forEach(ele=>{
 this.advisoryService.push(ele)
})

this.payNow(undefined);


    })
}

vasReplace(){
   this.isVasIds=true;
   this.isOrder=false;
}
  public choosePlan(plan: Subscription,flag:string) {
    console.log(this.advisoryService)
    this.advisoryService=[];
  
    const data={
      "userId": this.userid,
      "subscriptionName":plan.subscriptionName,
      "subscriptionAmount":plan.subscriptionAmount,
      "subscriptionId":plan.subscriptionId,
      "subscriptionValidity":plan.subscriptionValidity,
      "lcCount":plan.lcCount,
      "subsidiaries": plan.subsidiaries,
      "relationshipManager":plan.relationshipManager
    }
this.subCurrency=plan.subscriptionCurrency;
    this.onlinePayment.checkSubsidiary(data).subscribe((response)=>{
      let data=JSON.parse(JSON.stringify(response));
      if(data.status=="Failure" &&  !this.isBAA){
        $('#buyNowFailed').show();
        this.buyNowfailMsg=data.errMessage;
           }      
           else{

            this.choosedPlan = plan;
            this.choosedPlan.flag=flag;
            sessionStorage.setItem('flag',flag);
            sessionStorage.setItem("subscriptionamount", plan.subscriptionAmount.toFixed(2));
            sessionStorage.setItem("subscriptionid", plan.subscriptionId);        
            this.choosedPrice = this.choosedPlan.subscriptionAmount;
            this.addedAmount = this.choosedPrice;
            this.choosedPlan.userId = sessionStorage.getItem('userID');
            this.isNew = false;
            this.isRenew=false;
            this.isPaymentSuccess=false;
           
           if(this.userid.startsWith('BA')){
             
            this.isBAA=true;
            this.isVasIds=false;
            this.isOrder = true;
          }else{
            this.isVasIds=true;
            this.isBAA=false;
          }
           // this.isOrder = true;
            this.viewVASPlans();
           }
    })
    // this.onlinePayment.getLeadsCouponCode(this.custUserEmailId).subscribe((response)=>{
    //   let data=JSON.parse(JSON.stringify(response)).data;
    //   setTimeout(() => {
    //     if(data){
    //     this.fieoCoupon=data; 
    //       this.coupon="**********";
    //       $("#coupon").val("**********");
    //       this.applyNow($("#coupon").val());
    //     }
    //     // else{
    //     //   this.discounFieo="20%";
    //     // }
    //   }, 200);

    // })
this.getFieoToken();

    // if(this.choosedPlan.flag=='new' || sessionStorage.getItem(flag)=='new'){
    //   this.payNowSave('CreditPending',this.choosedPlan);
    // }
    
  }
  pendingOkBtn(){
    $('#txnPending').hide();
    if(sessionStorage.getItem('flag')=='renew' || sessionStorage.getItem('kycStatus')=='Approved'){
      this.router.navigate([`/${this.subURL}/${this.parentURL}/dashboard-details`])
    }else if(sessionStorage.getItem('flag')=='new'  || sessionStorage.getItem('kycStatus')=='Pending' || sessionStorage.getItem('kycStatus')=='PENDING'){
      this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`])
    }else{
      this.router.navigate([`/${this.subURL}/${this.parentURL}/dashboard-details`])
    }
      }
  buyNowOkBtn(){
    $('#buyNowFailed').hide();
    $('#continueFailed').hide();
  }
  getVASByUserId(){
    let data = {
      "userId": sessionStorage.getItem("userID")
    }
    this.subscriptionService.getVASByUserId(data).subscribe(response => {
    
      let res = JSON.parse(JSON.stringify(response.data[0]));
      this.pricing=Number(this.choosedPlan.grandAmount)-res.pricing;
     // if(res.isSplanWithVasFlag=="1"){        
        this.viewAdvDetails=JSON.parse(JSON.stringify(response)).data;
        if(res.isSplanWithVasFlag=="1"){         
          this.showVASPlan=true
         }else{        
          if(res.paymentSts=="Approved" || res.paymentSts=="approved"){    
            this.showVASPlan=true;
          
          }
          
          if(res.paymentSts=="Pending" || res.paymentSts=="Maker Approved" ){            
            this.choosedPlan.grandAmount=this.pricing;    
            this.showVASPlan=false;
            this.isVasInvoice=false
          }
             }

        if(this.status.paymentstatus.toLowerCase()=="rejected"){
          this.isRejected=true;
        }
          else{
          this.isRejected=false;
        }
       
    })
  }
  viewVASPlans(){
  
    var userid = sessionStorage.getItem("userID");   
      if((userid.startsWith('CU')) || (userid.startsWith('BC'))){
        this.showVASPlan = true;
      }
    else{
      this.showVASPlan = false;
    }   


    if((userid.startsWith('CU'))){
          this.isCustomer=true;
    } else if(userid.startsWith('BC')){
       this.isCustomer=true;
      this.subscriptionBAC=false;
      this.isBAC=false;
    }
    else{
    
      this.isCustomer=false;
    }
  

    let data = {
      "country_name": sessionStorage.getItem("registeredCountry")
    }
    this.subscriptionService.viewAdvisory(data,userid).subscribe(response => {
      if(!JSON.parse(JSON.stringify(response)).data){
        
        this.showVASPlan = false;
      }else{
        this.getAdvisoryList=JSON.parse(JSON.stringify(response)).data;
        
        this.vasAdded = Array.from({ length: this.getAdvisoryList.length }).fill('ADD');

        this.advDetails = JSON.parse(JSON.stringify(response)).data[0];
      this.viewAdvDetails=JSON.parse(JSON.stringify(response)).data
      //  this.advPrice = this.advDetails.pricing; //recent
        // if(this.advPrice){
        //   this.choosedPlan.subscriptionAmount=this.choosedPlan.subscriptionAmount+this.advPrice
        // }
         sessionStorage.setItem('vasId',this.advDetails.vas_id)

        this.vas_id=this.advDetails.vas_id
      }
    })
  }

addVasPlan(){
  if(this.advisoryService.length==0)
    this.showVASPlan = false;
   else
   this.showVASPlan = true;

  this.isVasIds=false;
  this.isOrder=true;
}

  removeCoupon(val){
    this.fieoCoupon="";
    this.couponError=false;
    sessionStorage.setItem('vasPending','')
    this.addVasEnabled=false;
    let req = {
      "discountId": this.discountId,
      "userId":sessionStorage.getItem('userID')
    }

    this.subscriptionService.removeCoupon(req).subscribe(response => {
       let data= JSON.parse(JSON.stringify(response))
       this.isRemoveCoupon=true;
        const first_input = this.el.nativeElement.querySelector('.coupantext');
        first_input.value=null;
        this.isRemove=false;
        this.isApply=true;        
        this.discountId="0";
        this.discount="0";
this.discountAmount=0;
        if(this.callVasService)
        {
          this.addedAmount = this.choosedPrice+parseFloat(this.advPrice);
        }
        else
        {
          this.addedAmount=this.choosedPrice;
          if(val){ //before -remove if
            this.amountAfterCoupon=this.choosedPrice;
          }
         
        }  
        this.couponSuccess=false;

    }
    )
  }
  applyNow(val){
    
if(this.fieoCoupon){
 // this.isFieoCoupon=true;
  val=this.fieoCoupon;
}

    let req = {
      "userId": sessionStorage.getItem('userID'),
      "subscriptionName":this.choosedPlan.subscriptionName,
	    "coupenCode":val,
	    "subscriptionAmount":this.choosedPlan.subscriptionAmount,
      "subscriptionId":this.choosedPlan.subscriptionId
    }
   
    this.subscriptionService.applyCoupon(req).subscribe(response => {
       let data= JSON.parse(JSON.stringify(response))
       this.isRemove=true;
       this.isApply=false;
       if(data.status=="Failure"){
         this.couponError=true;
         this.isRemove=false;
         this.isApply=true;
       }else{
        this.couponSuccess=data.status;
        this.isRemove=true;
        this.isApply=false;
        this.amountAfterCoupon = Number(data.data.grandAmount);
        this.discount=Number(data.data.discount);
        sessionStorage.setItem('discount',data.data.discount);
        this.discountAmount=data.data.discount;
        this.discountId=data.data.discountId;
        sessionStorage.setItem('discountId',data.data.discountId);
        if(this.callVasService)
        {
          this.addedAmount = this.amountAfterCoupon+parseFloat(this.advPrice);
        }
        else
        {
          this.addedAmount=this.amountAfterCoupon
        }  
        this.couponError=false;
       }
    }
    )
   
  }
  public payNow(planType) {
    

    if(sessionStorage.getItem('vasPending')=="No"){
      this.addedAmount=parseFloat(sessionStorage.getItem("subscriptionamount")) + parseFloat(this.addedAmount);
console.log(this.addedAmount)
       this.vasPlanId = sessionStorage.getItem("vasId")
    }else{
      this.vasPlanId="";  
      this.advisoryService.forEach(ele=>{
       this.vasPlanId = this.vasPlanId + ele.vas_id +"-" 
      })
    }


this.vasPlanId=this.vasPlanId.slice(0,-1);
if(this.vasPlanId==""){
  this.vasPlanId="0";
}
    const data={
      "userId":sessionStorage.getItem('userID'),
      "grandAmount":this.addedAmount,
      "vasId": this.vasPlanId,
      "subscriptionId":this.choosedPlan.subscriptionId,       
        "discountId":this.discountId      

    }
    this.subscriptionService.continueBuy(data).subscribe(response => {   
  this.verifyId=JSON.parse(JSON.stringify(response)).data;
  if(sessionStorage.getItem('vasPending')=="No"){
    this.addedAmount= parseFloat(this.addedAmount)-parseFloat(sessionStorage.getItem("subscriptionamount")) ;
  }
  if(JSON.parse(JSON.stringify(response)).status=="Failure"){
    const navigationExtras: NavigationExtras = {
      state: {
        title: 'Oops! Something went wrong while Renewing the plan',
       // message: data.errMessage,
        parent: this.subURL + '/' + this.parentURL + '/subscription'
      }
    };          
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
    .then(success => console.log('navigation success?', success))
    .catch(console.error);
  
  }); 
  sessionStorage.setItem('vasPending',"Yes")
  }


  // const param={
  //   id:respo.data,
  //   "grandAmount":this.addedAmount
  // }

  // this.subscriptionService.verifyPayment(param).subscribe(response => { 
  //   this.verifyData=JSON.parse(JSON.stringify(response));
    
  // if( this.verifyData.status=='Failure'){
  //   this.trnxFailMsg=JSON.parse(JSON.stringify(response)).data;
  //   $('#continueFailed').show();
  // }else{   
//console.log(this.addedAmount.toFixed(2))
    this.paymentForm.patchValue({
      amount: this.addedAmount,
      currency:this.subCurrency
    });
    let elements = document.getElementsByTagName('input');
    for (var i = 0; i < elements.length; i++) {
      if(elements[i].value)
      elements[i].classList.add('has-value')
    }
    this.isNew = false;
    this.isRenew=false;
    this.isOrder = false;
    this.isPayment = true;
    this.isPaymentSuccess=false;
    const sd = this;
    $('.green').hide();
    $('.selection').hide();
    $('.red').hide();
    $('.green').slideUp();
    $('.red').slideUp();
    $('#planUnlimited').show();
    $("#option-two"). prop("checked", true);
    // this.titleService.loading.next(true);
    $(document).ready(function () {
      if(planType == "unlimited"){
        $('.red').show();
        $('.selection').hide();
        $('#planUnlimited').hide();
      }else{
        $('.green').show();

        $('.selection').show();
        $('#planUnlimited').show();
       
      }
      $('input[type="radio"]').click(function () {
        sd.loading = true;
        var inputValue = $(this).attr("value");
        if (inputValue == 'green') {
          $('.green').slideDown();
          $('.red').slideUp();
          // this.titleService.loading.next(false);
        }
        else {
          // this.titleService.loading.next(false);
          $('.green').slideUp();
          $('.red').slideDown();
        }
      });
    });
    // this.titleService.loading.next(false);
   // this.paypalSubmit();

 // }
//})
})
  }


  getGrandAmount(){
  this.paymentForm.patchValue({
    amount: this.choosedPrice,
  })
  }


public pymentForZero(){
  if(this.paymentForm.get('amount').value>0){
  }

}

  public payment(pgData) {
 
    this.titleService.loading.next(true);
if(this.branchUserEmailId=='undefined'){
  this.choosedPlan.emailID=this.custUserEmailId
}else{
  this.choosedPlan.emailID=this.branchUserEmailId  
}
if(this.isPayementZero){

this.choosedPlan.grandAmount=this.paymentForm.get('amount').value;
this.choosedPlan.discount=sessionStorage.getItem('discount');
this.choosedPlan.discountId=sessionStorage.getItem('discountId');
this.choosedPlan.modeOfPayment="Credit" ;
  } else{
   //testest
    //this.choosedPlan.vasAmount=this.advPrice;
   

    if(Number(pgData.data.vasAmount)>0 ){
      this.choosedPlan.vasAmount=Number(pgData.data.vasAmount);
      this.choosedPlan.isVasApplied=1;
     

     // const arr=sessionStorage.getItem('vasId').split("-");
     
      // const arr=sessionStorage.getItem('vasId').slice(0,-1);
        let req = {
          "userId": sessionStorage.getItem('userID'),
      //    "vasId": arr[i],
          "vasPurchased":sessionStorage.getItem('vasId')+"-",
          "subscriptionId":sessionStorage.getItem('subscriptionid'),
          "mode" : "Credit",
          "isSplanWithVasFlag":"1"
        }
        this.subscriptionService.addVas(req).subscribe(data => {
        }
        )
     

    
    }else{
      this.choosedPlan.vasAmount=0;
      this.choosedPlan.isVasApplied=0;
    }
    this.d_discount=pgData.data.discAmount;
    if(this.d_discount>0){        
     this.showDiscount=true;
    }else{
     this.showDiscount=false;
    }
    
    this.choosedPlan.grandAmount=pgData.data.subsAmount;      
    this.choosedPlan.discount=pgData.data.discAmount
    this.choosedPlan.discountId=pgData.data.discId
    this.choosedPlan.modeOfPayment="Credit" ;
    this.choosedPlan.subscriptionId=pgData.data.subscriptionId;
    this.choosedPlan.flag=pgData.data.subsflag;       
    this.choosedPlan.customerSupport= pgData.data.custSupport;
    this.choosedPlan.lcCount=pgData.data.lcCount;
    this.choosedPlan.relationshipManager= pgData.data.relManager;
    this.choosedPlan.subscriptionAmount= Number(pgData.data.actualAmt);
    this.choosedPlan.subscriptionName= pgData.data.subsName;
    this.choosedPlan.subscriptionValidity= pgData.data.subsValidity;
    this.choosedPlan.subsidiaries=pgData.data.subsidiaries;
    this.choosedPlan.userId=pgData.data.userId;
   // this.choosedPlan.
   // this.choosedPlan.vasAmount=this.cookieService.get('vasAmount');
sessionStorage.setItem('subscriptionid',pgData.data.subscriptionId)
  }
    if(this.isnewPlan){
      this.choosedPlan.flag="new"
    }
    if(this.isRenewPlan){
      this.choosedPlan.flag="renew"
    }
   
    if(  sessionStorage.getItem('vasPending')=='No'){
      let data=    {
        "userId":sessionStorage.getItem('userID'),
        "subscriptionId":sessionStorage.getItem('subscriptionid'),
        "vasId":sessionStorage.getItem('vasId')+"-",
        "mode" :'Credit',
       // "pricing":this.choosedPlan.grandAmount,
        "paymentTxnId":pgData.data.orderId,
        "invoiceId":pgData.data.invoiceId,
      //  "isSplanWithVasFlag":"0"
          }
      this.subscriptionService.addVASAfterSubscription(data)
      .subscribe(
        response => {
        let data= JSON.parse(JSON.stringify(response))
        if(data.data)
        //this.paymentTransactionId=pgData.data.orderId;
        this.paymentTransactionId=this.paymentId;
        this.isNew = false;
        this.isOrder = false;
        this.isPayment = false;
        this.isPaymentSuccess = true;
        this.titleService.loading.next(false);
       if(data.status=='Success'){
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Subscription Plan',
              message: data.errMessage,
              parent: this.subURL + '/' + this.parentURL + '/subscription'
            }
          };          
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/success`], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
        }); 
      }
      },
      (error) => {
        this.titleService.loading.next(false);
      }
    )
    document.cookie = 'status' +'=; Path=/';
   // document.cookie = 'vasAmount' +'=; Path=/';
   sessionStorage.setItem('vasPending','Yes')

      }else{

        //online payment
    this.subscriptionService.saveSplan(sessionStorage.getItem('userID'), this.choosedPlan)
      .subscribe(
        response => {
          let data= JSON.parse(JSON.stringify(response))
          if(data.data)
         // this.paymentTransactionId=pgData.data.orderId;
          this.paymentTransactionId=this.paymentId
          this.isNew = false;
          this.isOrder = false;
          this.isPayment = false;
          this.isPaymentSuccess = true;
          this.titleService.loading.next(false);
         if(pgData.status=='Success' || data.errMessage=="Subscription Plan Renewed Successfully." || data.errMessage=="Subscription Plan Purchased Successfully."){
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Subscription Plan',
                message: data.errMessage,
                parent: this.subURL + '/' + this.parentURL + '/subscription'
              }
            };          
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
          }); 
        }
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
      document.cookie = 'status' +'=; Path=/';
     // document.cookie = 'vasAmount' +'=; Path=/';
     sessionStorage.setItem('vasPending','Yes')
      }
  }
 
//   getSubcriptions(){
//  if(this.vasPending=='No'){
//   alert('getSubcriptions')
//   this.renewPlan()
// }
//   }
// getSubcriptions(){
//   alert(`/${this.subURL}/${this.parentURL}/subscription`);
//  this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription`]);

// }

  public getPlan(userID: string) {
    console.log('kkkoo')
    if((userID.startsWith('CU'))){
  
      this.isCustomer=true;
    }
    else{
      this.isCustomer=false;
    }
    this.subscriptionService.getPlanByUserId(userID)

      .subscribe(
        response => {
       console.log('ll')
          if(JSON.parse(JSON.stringify(response)).data){
            this.choosedPlan = JSON.parse(JSON.stringify(response)).data[0];              
            this.paymentTransactionId=JSON.parse(JSON.stringify(response)).data[0].invoiceId;
          
            this.subsStartDate=this.choosedPlan.subsStartDate;
            console.log(this.subsStartDate);
          let reData=JSON.parse(JSON.stringify(response)).data[0]       
          if(this.choosedPlan.vasAmount){
           // this.showVASPlan=true
            this.advPrice=this.choosedPlan.vasAmount;         
           if(this.choosedPlan.isVasApplied==1)
              this.getVASByUserId();
           
            
          } 
        
         
          // if(reData.isVasApplied=="1")
          //   this.viewVASPlans()
          if(reData.grandAmount)
          //  this.choosedPlan.subscriptionAmount=Number(sessionStorage.getItem("subscriptionamount"));
         this.isNew = false
          this.isOrder = false;
          this.isPayment = false;
          this.isPaymentSuccess = true;
          this.titleService.loading.next(false);
        
        }else{


          if(sessionStorage.getItem('status').toLowerCase() == "inactive"){
            //this.getSubscriptionDetails();
           let data = {
              "userid": sessionStorage.getItem('userID'),
              "emailAddress": this.emailid
            }
            this.subscriptionService.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
              response => {        
                this.getcountData = JSON.parse(JSON.stringify(response)).data;
            this.choosedPlan.customerSupport= this.getcountData.customersupport
            this.choosedPlan.subscriptionValidity= this.getcountData.subscriptionvaldity
            this.choosedPlan.grandAmount= this.getcountData.grandamount
            this.choosedPlan.lcCount= this.getcountData.lc_count
            this.choosedPlan.relationshipManager= this.getcountData.relationshipmanager
            this.choosedPlan.status= this.getcountData.status
            this.choosedPlan.subscriptionAmount= this.getcountData.subscriptionamount
            this.choosedPlan.subscriptionId= this.getcountData.subscriptionid
            this.choosedPlan.subscriptionName= this.getcountData.subscriptionname
            this.choosedPlan.subsidiaries= this.getcountData.subsidiries
            this.choosedPlan.vasAmount= this.getcountData.vasamount
            this.choosedPlan.discount=this.getcountData.discountAmount
           

console.log(this.choosedPlan)

          })
          this.isPaymentSuccess = true;
        }else{
          this.getSubscriptionDetails();
        }
        }
        },
        (error) => {
          this.titleService.loading.next(false);
          //this.getSubscriptionDetails();
          // if(sessionStorage.getItem('status').toLowerCase() != "active"){
          //   console.log("this.choosedPlan.status")
          //   this.isPaymentSuccess = true;
          
          // }
        }
      )
  }

  closeWT(){
    $('#myModal4').hide();
    $('.modal-backdrop').hide();


  }
  sendAccDetails(){    
      let req = {
        "userId": sessionStorage.getItem('userID'),
        "event":"Account_Details",
      }
      this.subscriptionService.sendAccDetails(req).subscribe(data => {
       // alert("bank details sent successfully")
      }
      )
  }
  sendRequest(){
    sessionStorage.setItem('vasId',this.vasPlanId)
    if(!this.disableSendRequest){
   
    const req=  {
      "userId":sessionStorage.getItem('userID'),
      "event":"WIRE_TRANSFER",
      "wireTransfer":"wire_SendRequest"
  }
  if(this.paymentForm.get('amount').value>0){

  this.subscriptionService.sendBankDetails(req).subscribe(data => {
   //  alert("bank details sent successfully")
   
   });
  }
  }
    this.cookieService.delete('status');
    document.cookie = 'status' +'=; Path=/';
    document.cookie = 'paymentMode' +'=; Path=/';

    this.titleService.loading.next(true);
    if(this.branchUserEmailId=='undefined'){

      this.choosedPlan.emailID=this.custUserEmailId
    
    }else{
      this.choosedPlan.emailID=this.branchUserEmailId  
    }
   
    this.choosedPlan.modeOfPayment="Wire"
if(this.addVasEnabled){
  this.choosedPlan.vasAmount=this.advPrice;
}else{
  this.choosedPlan.vasAmount=0;
}
// else(sessionStorage.getItem('vasPending')=='No'){
//   this.choosedPlan.vasAmount=this.advPrice;

// }
//this.choosedPlan.modeOfPayment="Wire" ;
    this.choosedPlan.grandAmount=this.addedAmount
    this.choosedPlan.discount=this.discount;
    this.choosedPlan.discountId=this.discountId;
    this.choosedPlan.subscriptionId=sessionStorage.getItem('subscriptionid')
    if(this.isnewPlan){
      this.choosedPlan.flag="new"
    }
    if(this.isRenewPlan){
      // if(this.isRejected){
      //   this.choosedPlan.flag="new"
      // }else{
        this.choosedPlan.flag="renew"
     // }
     
    }
    
if(  sessionStorage.getItem('vasPending')=='No'){
        //    const arr=sessionStorage.getItem('vasId').split("-");

  let data=    {
    "userId":sessionStorage.getItem('userID'),
    "subscriptionId":sessionStorage.getItem('subscriptionid'),
    "vasId":sessionStorage.getItem('vasId')+"-",
    "mode" :'Wire',
    "paymentTrnId":"",
    "invoiceId":"",
   // "isSplanWithVasFlag":"0"
      }
  this.subscriptionService.addVASAfterSubscription(data)
  .subscribe(
    response => {
    let data= JSON.parse(JSON.stringify(response))
    if(data.data)
      this.paymentTransactionId=data.data
    this.isNew = false;
    this.isOrder = false;
    this.isPayment = false;
    this.isPaymentSuccess = true;
    this.titleService.loading.next(false);
    if(data.status=="Failure"){
      const navigationExtras: NavigationExtras = {
        state: {
          title: 'Oops! Something went wrong while Renewing the plan',
          message: data.errMessage,
          parent: this.subURL + '/' + this.parentURL + '/subscription'
        }
      };          
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
      this.isPaymentSuccess = true;
    }); 
    }else {
      this.trnxPendingMsg="The account details where the payment needs to be made has been sent to your registered email ID. Kindly make the payment and wait for the approval. It usually takes up 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
      //this.trnxPendingMsg="  Your renewal payment approval is pending. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
        $('#txnPending').show();
    //   const navigationExtras: NavigationExtras = {
    //     state: {
    //       title: 'SubscriptionPlan',
    //       message: data.errMessage,
    //       parent: this.subURL + '/' + this.parentURL + '/subscription'
    //     }
    //   };          
    //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //   this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/success`], navigationExtras)
    //   .then(success => console.log('navigation success?', success))
    //   .catch(console.error);
    // }); 
    }
  },
  (error) => {
    this.titleService.loading.next(false);
  }
)
//this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`]);
sessionStorage.setItem('vasPending','Yes')

}else{
//send request
    this.subscriptionService.saveSplan(sessionStorage.getItem('userID'), this.choosedPlan)
      .subscribe(
        response => {
          let data= JSON.parse(JSON.stringify(response))
          if(data.data)
            this.paymentTransactionId=data.data
          this.isNew = false;
          this.isOrder = false;
          this.isPayment = false;
          this.isPaymentSuccess = true;
          this.titleService.loading.next(false);

          if( this.advisoryService.length>0){ 
            this.choosedPlan.isSplanWithVasFlag=1;
             let req = {
               "userId": sessionStorage.getItem('userID'),
               "vasPurchased":sessionStorage.getItem('vasId')+"-",
               "subscriptionId":sessionStorage.getItem('subscriptionid'),
               "mode" : "Wire",
               "isSplanWithVasFlag":"1"
             }
             console.log(req)
             this.subscriptionService.addVas(req).subscribe(data => {
             }
             )
            
           } 
           else{
             this.choosedPlan.isVasApplied=0;
           }

          if(data.status=="Failure"){
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Oops! Something went wrong while Renewing the plan',
                message: data.errMessage,
                parent: this.subURL + '/' + this.parentURL + '/subscription'
              }
            };          
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
            this.isPaymentSuccess = true;
          }); 
          }else {


        


            this.trnxPendingMsg="The account details where the payment needs to be made has been sent to your registered email ID. Kindly make the payment and wait for the approval. It usually takes up 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
            //this.trnxPendingMsg="  Your renewal payment approval is pending. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
              $('#txnPending').show();
             
          }
         
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
    //this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`]);
    sessionStorage.setItem('vasPending','Yes')
      }
  }

  addRemoveVas(index,vasPLan){
   //  this.advPrice=0;
    //this.advPrice=parseFloat(this.advPrice) + vasPLan.pricing;

   // var deleteAmount=0;
    if(this.vasAdded[index]=="ADD"){
      this.advisoryService.push(vasPLan)
      this.vasAdded[index] = 'REMOVE';
      this.addAdvService();
    }else{
    //  deleteAmount=this.advisoryService[index].pricing
  
   const i = this.advisoryService.indexOf(vasPLan);
   this.vasAdded[i] = 'ADD';
      //this.advisoryService.splice(i, 1);
      this.removeAddVas(index,vasPLan)

    }
   if(this.advisoryService.length==0)
   this.showVASPlan = false;
  else
  this.showVASPlan = true;
  }

  addAdvService(){  
 
      this.isVasBtn=false;
      this.isVasRemoveBtn=true;
      this.addVasEnabled=true;
      this.callVasService=true;
    
      var amount=0;
      if(this.advisoryService){
         this.advisoryService.forEach(ele=>{
           amount=amount+ele.pricing
          this.advPrice=amount;
        })
      }
      if(this.amountAfterCoupon){
        this.addedAmount=parseFloat(this.amountAfterCoupon)+parseFloat(this.advPrice);
      }
      else{
        this.addedAmount = (parseFloat(this.choosedPrice) + parseFloat(this.advPrice))-parseFloat(this.discountAmount)
      }
            this.afterAddingVas=this.advPrice;

     const data= {
        "userId":sessionStorage.getItem('userID'),
        "grandAmount":parseFloat(this.choosedPrice) + parseFloat(this.advPrice)
      }
      this.subscriptionService.addVASToGrand(data).subscribe(response => { 
         sessionStorage.setItem('isvasapplied','true')     
        this.vasPlanId=sessionStorage.getItem('vasId')  

        if(this.fieoCoupon){
        const data=  {
           "userId":sessionStorage.getItem('userID'),
            "subscriptionName":this.choosedPlan.subscriptionName,
            "subscriptionAmount":this.choosedPlan.subscriptionAmount,
            "subscriptionId":this.choosedPlan.subscriptionId,
            }
         this.subscriptionService.applyCouponAfterVASBuy(data).subscribe(response=>{
          this.discount= JSON.parse(JSON.stringify(response)).data.discount
          this.discountId=JSON.parse(JSON.stringify(response)).data.discountId
          this.discountWithVas=parseFloat(sessionStorage.getItem('discount'));
          this.addedAmount=(parseFloat(this.amountAfterCoupon)+parseFloat(this.advPrice))-(this.discount-this.discountWithVas);
         })
        }
      })
      
     // event.target.value = "Remove";
      sessionStorage.setItem('vasPending','Yes')   
    
  }
removeAddVas(i,vasPLan){
  
if(vasPLan){  
  const i = this.advisoryService.indexOf(vasPLan);//
  const j = this.getAdvisoryList.indexOf(vasPLan)
  this.vasAdded[j] = 'ADD';
     this.advisoryService.splice(i, 1);
     this.advPrice=this.advPrice-vasPLan.pricing;
}
  const data= {
    "userId":sessionStorage.getItem('userID'),
  }
  this.subscriptionService.removeVASFromGrand(data).subscribe(response => {   

    this.vasPlanId=0; 

  })
  this.isVasRemoveBtn=false;
  this.isVasBtn=true;
  this.afterAddingVas=0;
this.addVasEnabled=false;
this.callVasService=false;  
if(this.amountAfterCoupon){
 
  if(this.fieoCoupon){
    this.addedAmount= this.amountAfterCoupon   
   this.discount=sessionStorage.getItem('discount')
 }else{
  this.addedAmount= this.amountAfterCoupon
  if(this.discountAmount){
    this.addedAmount= ((this.choosedPlan.subscriptionAmount+  parseFloat(this.advPrice) )- parseFloat(this.discountAmount)) - parseFloat(this.advPrice);
  }else{
    this.discount=sessionStorage.getItem('discount')
    this.addedAmount= parseFloat(this.amountAfterCoupon) + parseFloat(this.discount);
  }
}

}
else{   
  console.log(this.addedAmount)
  this.addedAmount =  ( this.addedAmount - vasPLan.pricing)-this.discountAmount;
}

if(this.advisoryService.length==0)
   this.showVASPlan = false;
  else
  this.showVASPlan = true;
}

  renewPlan(){
     
    this.isRenew=true;
    this.isRenewPlan=true;
    this.isPaymentSuccess=false;
    this.getSubscriptionDetails() 
   
  }

  getStatus(){
    var userid=this.userid;
    if(userid.startsWith('CU')){
     this.emailid=sessionStorage.getItem('branchUserEmailId');
    }else if(userid.startsWith('BA') ){
      this.emailid="";
    }
     else{
      this.emailid=sessionStorage.getItem('branchUserEmailId');
    }

    console.log("this.emailid")
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress": this.emailid
    }
    this.subscriptionService.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
      response => {        
        this.status = JSON.parse(JSON.stringify(response)).data;
          console.log(this.status.paymentTransId)
          if(this.choosedPlan.invoiceId==this.status.paymentTransId){
            this.paymentTransactionId=this.status.paymentTransId
            this.isVasInvoice=false;
          }else{
            this.paymentTransactionId=this.choosedPlan.invoiceId
         this.isVasInvoice=true;
          }
        this.d_discount=this.status.discountAmount;
        if(this.d_discount>0){        
         this.showDiscount=true;
        }else{
         this.showDiscount=false;
        }

if(this.status.status.toLowerCase()=="inactive"){
  this.subscriptionService.getInactiveSPlan(sessionStorage.getItem('userID')).subscribe(
    response => {        
      this.paymentTransactionId=JSON.parse(JSON.stringify(response)).data[0].invoiceId
     
      this.subsStartDate=JSON.parse(JSON.stringify(response)).data[0].subsStartDate;
      let date = new Date(this.subsStartDate);
        console.log(date);
       this.subsStartDate = date.setDate(date.getDate() + 1).toString();
       console.log(this.subsStartDate);

    })
}

     if( this.status.issplanpurchased){
        if( this.status.paymentstatus =='INACTIVE' ||  this.status.paymentstatus== 'Expired' ){
          this.trnxPendingMsg="  Your subcription plan has been expired , Please renew your subcription plan."
          $('#txnPending').show();
        }else if(this.status.paymentstatus=='Rejected'){
          this.trnxPendingMsg="  Your subscription payment is rejected. Contact support for more clarification "+this.tradeSupport
      
          this.isRejected=true;
          // $('#txnPending').show();
        } else if(this.status.paymentstatus=='Pending' || this.status.paymentstatus=='Maker Approved'){ //mPending
     // this.trnxPendingMsg="  Your renewal payment approval is pending. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
     this.trnxPendingMsg="The account details where the payment needs to be made has been sent to your registered email ID. Kindly make the payment and wait for the approval. It usually takes up 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
          
     $('#txnPending').show();
        }
      }
        // if(this.status.modeofpayment=='Credit'){
        //   this.paymentTransactionId=this.status.paymentTransId;
        // }else{
        //   this.paymentTransactionId=this.status.paymentTransId;
        // }
        if(this.status.kycstatus=='Approved'){
         this.hideRenew=true;
        }else{
          this.hideRenew=false;
        }      
      
    
      });
  
      const param={
        "subscriptionId":sessionStorage.getItem('subscriptionid')
      }
      this.subscriptionService.viewSubscriptionBySubscriptionId(param).subscribe(
        response => {        

          let data = JSON.parse(JSON.stringify(response)).data;
        
          if(data)
        this.lcCredits=data.lCount
        })
  
    }



    public convetToPDF()
    {
$('#pdf').show();

    var data = document.getElementById('pdf');
    html2canvas(data).then(canvas => {
    // Few necessary setting options
    var imgWidth = 209;
    var pageHeight = 295;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;
     
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save('Payment Invoice.pdf'); // Generated PDF
    });
    $('#pdf').hide();
    }


    download(invoiceId){ 
      console.log(invoiceId)
     // this.htmlToPdf=[];
      this.subscriptionService.getDownloadInvoice(sessionStorage.getItem('userID'),invoiceId).subscribe((response) => { 
        if(JSON.parse(JSON.stringify(response)).data)
      
          this.htmlToPdf=  JSON.parse(JSON.stringify(response)).data
        this.dataPdf=this.htmlToPdf
           if(this.dataPdf.sPlanAmount){         
          if(this.dataPdf.vasAmount >0 || this.dataPdf.vasAmount>0.0){
            this.srNoForVas="2"
            if(this.dataPdf.vasDiscount>0 || this.dataPdf.vasDiscount>0.0){
              this.srNoForDiscount="3";
            }else{
              this.srNoForDiscount="2"

            }
          }else{
          //  this.srNoForVas="1"
            this.srNoForDiscount="2"
          }
        }else{
          this.srNoForVas="1"

        }
          
       console.log(this.htmlToPdf)
      },
      (error)=>{
        console.log(error.error.text)
  
           
      })
    setTimeout(() => {
      this.convetToPDF();
    }, 1000);
     
    
    
    }

paypalSubmit(){



  sessionStorage.setItem('discountAmount','0');    
  let orderid="";
  function makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    orderid=text;
  }
  let possible = "ABCDEFGHZ1456912";
  const lengthOfCode = 15;
  makeRandom(lengthOfCode, possible);

if(this.addVasEnabled || sessionStorage.getItem('vasPending')=='No'){
this.vasPlanId=sessionStorage.getItem('vasId');
}else{
  this.vasPlanId=0;
}


  const onlinePay={
    "userId":sessionStorage.getItem('userID'),
    "merchantId":"45990",
    "orderId":orderid,
    //"amount":this.addedAmount,
    "currency":this.paymentForm.get('currency').value,  
    "cancelURL":`${environment.domain}/nimaiSPlan/PGResponse`,
    "redirectURL":`${environment.domain}/nimaiSPlan/PGResponse`,     
   "merchantParam1":sessionStorage.getItem('userID'),
   "merchantParam2":sessionStorage.getItem('subscriptionid'),
   "merchantParam3":sessionStorage.getItem('flag'),
   "merchantParam4":this.vasPlanId +"-"+ this.discountAmount,
   "merchantParam5":sessionStorage.getItem('subscriptionamount'),
   
  }
  
  this.onlinePayment.initiatePG(onlinePay).subscribe((response)=>{
    this.detail = JSON.parse(JSON.stringify(response)).data; 
          const param={
            "id":this.verifyId,
            "grandAmount":this.addedAmount
          }

          this.subscriptionService.verifyPayment(param).subscribe(response => { 
            this.verifyData=JSON.parse(JSON.stringify(response));

          if( this.verifyData.status=='Failure'){
            this.trnxFailMsg=JSON.parse(JSON.stringify(response)).data;
            $('#continueFailed').show();
          }else{ 
           // paypalScript(param.grandAmount);  
           this.initConfig(param.grandAmount)
          }
  });
});


}

  
  submit(){   
    sessionStorage.setItem('discountAmount','0');
    
  let orderid="";
  function makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    orderid=text;
  }
  let possible = "ABCDEFGHZ1456912";
  const lengthOfCode = 15;
  makeRandom(lengthOfCode, possible);

if(this.addVasEnabled || sessionStorage.getItem('vasPending')=='No'){
this.vasPlanId=sessionStorage.getItem('vasId');
}else{
  this.vasPlanId=0;

}
    const onlinePay={
      "userId":sessionStorage.getItem('userID'),
      "merchantId":"45990",
      "orderId":orderid,
      //"amount":this.addedAmount,
      "currency":this.paymentForm.get('currency').value,  
      "cancelURL":`${environment.domain}/nimaiSPlan/PGResponse`,
      "redirectURL":`${environment.domain}/nimaiSPlan/PGResponse`,     
     "merchantParam1":sessionStorage.getItem('userID'),
     "merchantParam2":sessionStorage.getItem('subscriptionid'),
     "merchantParam3":sessionStorage.getItem('flag'),
     "merchantParam4":this.vasPlanId +"-"+this.discountAmount,
     "merchantParam5":sessionStorage.getItem('subscriptionamount'),
     
    }
    this.onlinePayment.initiatePG(onlinePay).subscribe((response)=>{
      this.detail = JSON.parse(JSON.stringify(response)).data; 

//       const param={
//         id:this.verifyId,
//         "grandAmount":this.addedAmount
//       }
    
//       this.subscriptionService.verifyPayment(param).subscribe(response => { 
//         this.verifyData=JSON.parse(JSON.stringify(response));
//       if( this.verifyData.status=='Failure'){
//         this.trnxFailMsg=JSON.parse(JSON.stringify(response)).data;
//         $('#continueFailed').show();
//       }else{   


// var url="https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction"

// const mapForm = document.createElement('form');
// mapForm.method = 'POST';
// mapForm.action = url;
// mapForm.style.display = 'none';

// const mapInput = document.createElement('input');
// mapInput.type = 'hidden';
// mapInput.name = 'encRequest';
// mapInput.value = this.detail.requestDump;
// mapForm.appendChild(mapInput);

// const mapInput1 = document.createElement('input');
// mapInput1.type = 'hidden';
// mapInput1.name = 'access_code';
// mapInput1.value = this.detail.accessCode;
// mapForm.appendChild(mapInput1);
// document.body.appendChild(mapForm);

// mapForm.submit();
// }
// })   
})
 

  }

  clickHere(){
  const req=  {
      "userId":sessionStorage.getItem('userID'),
      "event":"WIRE_TRANSFER",
      "wireTransfer":"wire_CLickHere"
  }
  this.subscriptionService.sendBankDetails(req).subscribe(data => {
    this.disableSendRequest=true;
   //  alert("bank details sent successfully")

   });
  }
  
  validateRegexFields(event, type){
    var key = event.keyCode;
   
      if(type=="name_validation"){
        this.couponError=false
        if (!((key >= 65 && key <= 90) ||(key < 33 || key > 47) ||(key < 48 || key > 57) || (key < 58 || key > 64) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/)) {

          event.preventDefault();
      }
      // else if (key==8){
      //   this.couponSuccess=false;
      // } 
    }
   
  }


    public initConfig(totalAmount): void {
      const self = this; 
      this.payPalConfig = {
      currency: this.subCurrency,
      clientId: 'sb',
    
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
           
            amount: {
              currency_code: this.subCurrency,
              value: totalAmount,
              breakdown: {
                item_total: {
                  currency_code: this.subCurrency,
                  value: totalAmount
                }
              }
            },
            description:  "Total",
            custom_id:"SVD34434-232",
              reference_id:"ppppppp",
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: this.subCurrency,
                  value: totalAmount,
                },
              }
            ],
          
          }
        ],
        
        application_context: {
          shipping_preference: 'NO_SHIPPING',      
          billing_preference: 'NO_BILLING'
        },
       
     //   advanced: { extraQueryParams: [ { name: "disable-funding", value:"credit,card"} ] } ,
      },
      // advanced: {
      //   commit: 'true'
      // },
      // style: {
      //   label: 'paypal',
      //   layout: 'vertical'
      // },
      style: {
        layout: 'horizontal',
        tagline :false ,
       // color:'blue',
      
    },
    //   onApprove: (data, actions) => {
    //     console.log('onApprove - transaction was approved, but not authorized', data, actions);
       
    //     actions.order.get().then(details => {
    //       console.log('onApprove - you can get full order details inside onApprove: ', details);
    //     });
    //     return actions.order.capture().then(function(details) {
         
    //       alert('Transaction completed by ' + details.payer.name.given_name + '!');
         
    //   });
    // },
    onApprove: function (data, actions) {  
     // alert('You have successfully created subscription ' + data.subscriptionID);  
      self.getSubcriptionDetails(data.subscriptionID);  
    }, 

      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
       // this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
    }
  //  // const self = this;  
  //  // this.planId = 'P-20D52460DL479523BLV56M5Y';  //Default Plan Id
  //   this.paypalElement.nativeElement.Buttons({  
    
  //     style: {
  //         layout: 'horizontal'
  //     },
  //     // Set up the transaction

  //     createOrder: function(data, actions) {
  //         return actions.order.create({

  //             purchase_units: [{
  //                 account_id:"CU1515",
  //               name:"ASB23454344",
  //               custom_id:"SVD34434-232",
  //                 reference_id:"ppppppp",
                 
  //                 description:  "Total",
  //                 amount: {
  //                     value: "l6",
  //                     currency_code: this.subCurrency
  //                 }
  //             }],
            
  //             application_context: {
  //                 shipping_preference: 'NO_SHIPPING',      
  //                 billing_preference: 'NO_BILLING'
  //               }
  //         });


          
  //     },
      

  //     // Finalize the transaction
  //     onApprove: function(data, actions) {
  //         return actions.order.capture().then(function(details) {
  //             console.log(details)
  //             console.log(data)

  //             // Show a success message to the buyer
  //             alert('Transaction completed by ' + details.payer.name.given_name + '!');
  //         });
  //     },
  //     onCancel: function (data) {  
  //       // Show a cancel page, or return to cart  
  //       alert(data);  
  //     },  
  //     onError: function (err) {  
  //       // Show an error page here, when an error occurs  
  //       alert(err);  
  //     }  
  
  //   }).render(this.paypalElement.nativeElement);  
  
  // }

  getSubcriptionDetails(subcriptionId) {  
    const navigationExtras: NavigationExtras = {
      state: {
        title: 'Subscription Plan',
        message: "Subscription Plan Renewed Successfully.",
        parent: this.subURL + '/' + this.parentURL + '/subscription'
      }
    };          
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/success`], navigationExtras)
    .then(success => console.log('navigation success?', success))
    .catch(console.error);
  }); 
  }



  paypalPayNow(){
   // sessionStorage.setItem("ccy",this.paymentForm.get('currency').value)
    sessionStorage.setItem('discountAmount','0');
    sessionStorage.setItem('vasId',this.vasPlanId)

    let orderid="";
    function makeRandom(lengthOfCode: number, possible: string) {
      let text = "";
      for (let i = 0; i < lengthOfCode; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      orderid=text;
    }
    let possible = "ABCDEFGHZ1456912";
    const lengthOfCode = 15;
    makeRandom(lengthOfCode, possible);
  
  if(sessionStorage.getItem('vasPending')=='No'){
  this.vasPlanId=sessionStorage.getItem('vasId')   +"-" ;
  }else if(this.addVasEnabled ){
   
    this.vasPlanId="";  
this.advisoryService.forEach(ele=>{
  this.vasPlanId = this.vasPlanId + ele.vas_id   +"-" 
})
  } 
 // alert(sessionStorage.getItem('isvasapplied'))
  if(this.paymentForm.get('amount').value==0){
   this.isPayementZero=true;
    this.payment(this.choosedPlan);
  }else{



    const onlinePay={
      "userId":sessionStorage.getItem('userID'),
      "merchantId":"45990",
      "orderId":orderid,
     // "amount":Number(this.addedAmount),
      "currency":"USD",  
      "redirectURL":"",
      "cancelURL":"",
     "merchantParam1":sessionStorage.getItem('userID'),
     "merchantParam2":sessionStorage.getItem('subscriptionid'),
     "merchantParam3":sessionStorage.getItem('flag'),
     "merchantParam4":this.vasPlanId +this.discountAmount ,
     "merchantParam5":sessionStorage.getItem('subscriptionamount'),
     "merchantParam6":this.discountId,
     "language":1
     
    }
    
    this.onlinePayment.initiatePG(onlinePay).subscribe((response)=>{
      let url=JSON.parse(JSON.stringify(response)).data.redirect_url
      sessionStorage.setItem("URL",url)  
  //var url="https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction"
  
  const mapForm = document.createElement('form');
  mapForm.method = 'POST';
  mapForm.action = url;
  mapForm.style.display = 'none';
  
  const mapInput = document.createElement('input');
  mapInput.type = 'hidden';
  mapInput.name = 'encRequest';
  //mapInput.value = this.detail.requestDump;
  mapForm.appendChild(mapInput);
  
  const mapInput1 = document.createElement('input');
  mapInput1.type = 'hidden';
  mapInput1.name = 'access_code';
  //mapInput1.value = this.detail.accessCode;
  mapForm.appendChild(mapInput1);
  document.body.appendChild(mapForm);
  
  mapForm.submit();
  
    })
  }
  
}
}

