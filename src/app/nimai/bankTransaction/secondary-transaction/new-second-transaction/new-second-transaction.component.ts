import { Component, OnInit, EventEmitter, Output,ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { LcDetail } from 'src/app/beans/LCDetails';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { formatDate } from '@angular/common';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { TitleService } from 'src/app/services/titleservice/title.service';
import  { ValidateRegex } from '../../../../beans/Validations';
import { call } from 'src/assets/js/bootstrap-filestyle.min'
import { loads } from 'src/assets/js/commons'
import { LoginService } from 'src/app/services/login/login.service';
import { ApplicantBenficiarySecondaryComponent } from './applicant-benficiary-secondary/applicant-benficiary-secondary.component';
import * as FileSaver from 'file-saver';
import { PricingGuidanceComponent } from './pricing-guidance/pricing-guidance.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { environment } from 'src/environments/environment';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { MatSelect } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-new-second-transaction',
  templateUrl: './new-second-transaction.component.html',
  styleUrls: ['./new-second-transaction.component.css']
})
export class NewSecondTransactionComponent implements OnInit {
  @ViewChild(ApplicantBenficiarySecondaryComponent, { static: true }) ApplicantBeneficiary: ApplicantBenficiarySecondaryComponent;
  @ViewChild(PricingGuidanceComponent, { static: true }) Others: PricingGuidanceComponent;
  @ViewChild(ProductDetailsComponent, { static: true }) tenor: ProductDetailsComponent;
  @ViewChild('sample', { static: true }) sample: MatSelect;
  @Input() public LcDetail:FormGroup;

  // maps the appropriate column to fields property
  public fields: Object = { text: 'Game', value: 'Id' };
  // set the height of the popup element
  public height: string = '220px';
  // set the placeholder to DropDownList input element
  public waterMark: string = 'Select a game';
  // set the value to select an item based on mapped value at initial rendering
  public value: string = 'Game3';
 countryName: any;
 public hasValue=false;
 public isValidAppEmail=false;
 public isValidBeneEmail=false;
 submitted: boolean;
 disableRadiobtn: boolean=true;
 nimaiCount: any;
 errorMsg: string;
 public subsidiaries: any;
 parentID: string;
 userid: string;
 youAre: any;
 subID: any;
 parentID1: string;
 countryData: any = [];
 dataSource :any=[];
 selectedDay: any;
 applicantName: any;
 beneName: any;
 selectedcountry: any=[];
 
  public lcDetailForm: FormGroup
  public selector: string = "Confirmation";
  public title: string = "New Transaction";
  public refinancing: boolean = false;
  public bankGuarantee:boolean=false;
  public counter = 1;
  public saveCount = 0;
  public isPrev: boolean = false;
  public isNext: boolean = true;
  public isSave: boolean = false;
  public isPreview: boolean = false;
  public previewShow: boolean = false;
  public isEdit: boolean = false;
  public isConfirm: boolean = false;
  public loading: boolean = false;
  public date: string = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');
  usanceDays: number=0;
  public lcDetail: LcDetail = null;
  public lc: any = [];
  public transactionID: string = null;
  public subURL: string = "";
  public parentURL: string = "";
  showUpdateButton: boolean = false;
  isUpdate: boolean = false;
  draftData: any;
  cloneData: any;
  document: any;
  selectInfo: any;
  notImgDownload: boolean=false;
  imgDownload: boolean=false;
  fileData: any;
  currencies: any;
  portOfDischarge: any;
  goodsArray: any;
  isBankOther: boolean=false;
  othersStr: any="";
  currentDateTime: string;
  goodsList: any="";
  trnxFailedMsg: any="";
  accountType: string;
  otherType: boolean;
  goodsType: boolean;
  negotiationDate: boolean;
  lastShipmentDate: boolean;
   lCIssuingDate: boolean;
  lCCurrency: boolean;
  lCValue: boolean;
  lCIssuanceCountry: boolean;
  // swiftCode: boolean;
  // lCIssuanceBranch: boolean;
  lCIssuanceBank: boolean;
  count: number=0;
  trnxMsg: string;
  validityDate: any;
  lcMaturityDatenew: any;
  lCIssuingDatenew: any;
  tradeSupport: string;
  isRejected: boolean=false;
  invalidDate: any;
  invalidMsg: string;
  isDownloadORview: string;
  isExpired: boolean=false;
  isBgOther: boolean=false;
  status: string="";
  creditCounts: number;
  subUserID: string="";
  countSub: number=0;
  subdata: any;
  portOfLoading: any;
  errMsg: boolean;
  public toDayDate:any = new Date();
  showErr: boolean;
  minDate = new Date;
  typeofTransaction: any;
  old:any;
  // NAN:boolean;
  newvalue:number;

  // rds: refinance Data Service
  constructor(public psd: PersonalDetailsService,public getCount: SubscriptionDetailsService,public activatedRoute: ActivatedRoute, public fb: FormBuilder,public loginService: LoginService, public router: Router, public rds: DataServiceService, public titleService: TitleService, public upls: UploadLcService,private el: ElementRef) {
    // this.toDayDate = new Date();
    this.toDayDate = formatDate(new Date(), "yyyy-MM-dd", 'en-US')
    console.log(this.toDayDate);

    this.lcDetailForm = this.fb.group({
      selector: ['Confirmation'],
       userId: sessionStorage.getItem('userID'),
     // userId: [''],
      secTransactionType: ['',[Validators.required]],
      // applicantCountry:['',[Validators.required]],
      applicantCountry:[''],
      // applicantName:['',[Validators.required]],
      applicantName:[''],
      beneCountry:[''],
      // beneName:['',[Validators.required]],
      beneName:[''],
      lCIssuanceBank: ['',[Validators.required]],
      // lCIssuanceBranch: ['',[Validators.required]],
      // swiftCode: ['',[Validators.required]],
      lCIssuanceCountry: ['',[Validators.required]],
      lCValue: ['',[Validators.required]],
      lCCurrency: ['',[Validators.required]],
      // goodsType:['',[Validators.required]],
      goodsType:[''],
      otherType:[''],
      validity:['',[Validators.required]],
      minParticipationAmt:['',[Validators.required]],
      isESGComplaint:[''],
      retentionAmt:['',[Validators.required]],
      // loadingCountry:['',[Validators.required]],
      // loadingPort:['',[Validators.required]],
      // dischargeCountry:['',[Validators.required]],
      // dischargePort:['',[Validators.required]],
      loadingCountry:[''],
      loadingPort:[''],
      dischargeCountry:[''],
      dischargePort:[''],
      applicableLaw:['UK',[Validators.required]],
      otherlaw:[''],
      requirementType: [''],
      commissionScheme:[''],     
      lcMaturityDate:['',[Validators.required]],
      lCIssuingDate: [''], 
      benchmark:[''],
      otherCondition:[''],   
      usanceDays:[''],
      branchUserEmail: [''],
      transactionId:[''],
      offeredPrice:[''],
      participationBasis:['',[Validators.required]],
      lastShipmentDate: [''],
      
      bgExpiryDate:[''],
      claimExpiryDate:[''],
      negotiationDate: [''],
     
      bgType:[],
      otherBGType:[],
      // For Confirmation 
      confirmationPeriod: [''],
      paymentTerms: [''],
      startDate:[''],
      // tenorEndDate: [''],
      tenorFile: [''],
      // For Discounting 
      discountingPeriod:[''],
      remarks:[''],
    
      //For Refinancing
      originalTenorDays:[''],
      refinancingPeriod:[''],
      
      lcNumber:[''],
      lastBeneBank:[''],
      lastBeneSwiftCode:[''],
      lastBankCountry:[''],  
      
      //applicantName:sessionStorage.getItem('companyName'),
      //applicantCountry:sessionStorage.getItem('registeredCountry'),
       // beneName:sessionStorage.getItem('companyName'),
      beneBankCountry:[''],
      beneBankName:[''],
      beneSwiftCode:[''],
    //  beneCountry:sessionStorage.getItem('registeredCountry'),     
     
      chargesType: [''],
     
      lcProForma:[''],
      ended:[''],
      lCExpiryDate:[''],    
      
      insertedDate:this.date,
      insertedBy:sessionStorage.getItem('userID'),
      modifiedDate:this.date,
      modifiedBy:sessionStorage.getItem('userID'),
      transactionflag:[''],
      transactionStatus:[''],
      userType:[''],
      applicantContactPerson:[''],
      applicantContactPersonEmail:[''],
      beneContactPerson:[''],
      // beneContactPersonEmail:['',[Validators.required,Validators.email]]   
      beneContactPersonEmail:['',[Validators.email]]   
     })

  //  this.goodsService();

    this.titleService.changeTitle(this.title);

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    let navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "draftTransaction"){
        console.log('draft')
        var trnsactionID = navigation.extras.state.trnsactionID;
         this.callDraftTransaction(trnsactionID);
      }
      // else if(navigation.extras.state.redirectedFrom == "cloneTransaction"){
      //   var trnsactionID = navigation.extras.state.trnsactionID;
      //   // this.callCloneTransaction(trnsactionID);
      //   console.log(this.transactionID);
        else if(navigation.extras.state.redirectedFrom == "cloneTransaction"){
          this.typeofTransaction = "cloneTransaction";
          var trnsactionID = navigation.extras.state.trnsactionID;
          console.log(this.transactionID);
          this.callCloneTransaction(trnsactionID);
      }
    }

  
   // this.lc = this.lcDetailForm.value;    
  }

  ngOnInit() {

    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));
    this.currencies = JSON.parse(sessionStorage.getItem('currencyData'));
    this.goodsService();
    const lcd = this;
    $(document).ready(function () {
      const anchor: any[] = $('.nav-tabs').find('a');
      lcd.saveCount = anchor.length;

    })
    call();
    setTimeout(() => {
      loads();
    }, 500);
   
  //    {
  //     let data = {
  //       "userid": sessionStorage.getItem('userID'),
  //       "emailAddress": sessionStorage.getItem('branchUserEmailId')
  //     }
  
  //     this.getCount.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
  //       response => {
  //         this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
  //         if(this.nimaiCount.status=='INACTIVE'){
  //           debugger
  //           this.trnxMsg="  Your subcription plan is inactive , Please renew your subcription plan."
  //           $('#trnxInactiveBA').show();
  //         }
  //             if( this.nimaiCount.paymentstatus =='INACTIVE' ||  this.nimaiCount.paymentstatus== 'Expired' ){
  //               this.trnxMsg="  Your subcription plan has been expired , Please renew your subcription plan."
  //               $('#trnxInactiveBA').show();
  //             }else if(this.nimaiCount.paymentstatus=='Rejected'){
              
  //               this.trnxMsg="  Your subscription payment is rejected. Contact support for more clarification "+this.tradeSupport
               
               
  //               $('#trnxInactiveBA').show();
  //             } else if(this.nimaiCount.paymentstatus=='Pending' || this.nimaiCount.paymentstatus=='Maker Approved'){ //mPending
  //           this.trnxMsg="  Your renewal payment approval is pending. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
  //           $('#trnxInactiveBA').show();
  //           // const navigationExtras: NavigationExtras = {
  //           //   state: {
  //           //     title: 'Transaction Not Allowed!',
  //           //     message: 'Your renewal payment approval is pending. It usually takes up to 48 hours to approve the payment. For more clarification contact us at'+this.tradeSupport,
  //           //     parent: this.subURL+"/"+this.parentURL + '/dashboard-details',
  //           //     redirectedFrom: "New-Transaction"
  //           //   }
  //           // };
  //           // this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
  //           //   .then(success => console.log('navigation success?', success))
  //           //   .catch(console.error);
  //         }
  
  //         // if(this.nimaiCount.lc_count<=this.nimaiCount.lcutilizedcount ){
  //           this.creditCounts=this.nimaiCount.lc_count-this.nimaiCount.lcutilizedcount;
  
  // console.log(this.nimaiCount.lcutilizedcount)
  //      if(0  >= this.creditCounts  ){
  //        if(this.nimaiCount.accounttype=='MASTER'){
  //         const navigationExtras: NavigationExtras = {
  //           state: {
  //             title: 'Transaction Not Allowed!',
  //             message: 'You had reached maximum LC Count! Please Renew Your Subscription Plan',
  //             parent: this.subURL+"/"+this.parentURL + '/subscription',
  //             redirectedFrom: "New-Transaction"
  //           }
  //         };
  //         this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
  //           .then(success => console.log('navigation success?', success))
  //           .catch(console.error);
    
  //        }else{
  //         const navigationExtras: NavigationExtras = {
  //           state: {
  //             title: 'Transaction Not Allowed!',
  //             message: 'You had reached maximum LC credits! Please ask your parent user to renew the subscription plan',
  //             parent: this.subURL+"/"+this.parentURL + '/dashboard-details',
  //             redirectedFrom: "New-Transaction"
  //           }
  //         };
  //         this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
  //           .then(success => console.log('navigation success?', success))
  //           .catch(console.error);
    
  //        }
            
  //        }
  //       },
  //       error => { }
  //     )
  //   }


}

public dateFormat(date: string): string {
  if(date==undefined){
    this.invalidDate="Invalid Date";
    this.invalidMsg="Please select Validity date";
   $("#invalidDate").show(); 
  }else{
    let formatedDate = formatDate(new Date(date), "yyyy-MM-dd", 'en-US');
    return formatedDate;
  }
 
}

calculateDiff(){

  var firstDate = moment(this.lcDetailForm.get('lCIssuingDate').value);
  console.log(firstDate);

  var secondDate = moment(this.lcDetailForm.get('lcMaturityDate').value);
  console.log(secondDate);
  
 
 
  var diffInDays = (Math.abs(firstDate.diff(secondDate, 'days')) + 1);
  console.log(diffInDays);
  // this.newvalue = (diffInDays);
  console.log(typeof this.newvalue);
  // console.log(this.newvalue);
  // if( (newdiffInDays) == 'NaN' ){
  //   //  let old = '0';
  //    let newnumber:number = 0;
  //   //  this.NAN = true;
  //    console.log(newnumber);
  //    console.log(' i mhere new');
  //   // console.log(old);
  //   // this.lcDetailForm.controls['usanceDays'].setValue(old);
    
  // }
// else if(this.newvalue != NaN )
{
  // console.log(' i not here ');
  this.lcDetailForm.controls['usanceDays'].setValue(diffInDays);
}
}
onItemChange(e,beneCP,beneCPEmail,appCP,appCPEmail,applicantName,beneName){
  this.applicantName=applicantName;
  this.beneName=beneName;
 this.youAre=e;
  this.LcDetail.get('beneContactPerson').setValue(beneCP); 
  this.LcDetail.get('beneContactPersonEmail').setValue(beneCPEmail);
  this.LcDetail.get('applicantContactPerson').setValue(appCP); 
  this.LcDetail.get('applicantContactPersonEmail').setValue(appCPEmail);
  var radioValue = $("input[name='userType']:checked").val();
  this.LcDetail.get('userType').setValue(e);

  if (e == "Beneficiary") {
     $('#divApplicant').hide();
     $('#divBene').show();
     this.LcDetail.get('applicantName').setValue('');
     this.LcDetail.get('applicantCountry').setValue('');
     this.LcDetail.get('beneName').setValue(sessionStorage.getItem('companyName'));
     this.LcDetail.get('beneCountry').setValue(sessionStorage.getItem('registeredCountry'));
     let elements = document.getElementsByTagName('input');
     for (var i = 0; i < elements.length; i++) {
       if(elements[i].value)
       elements[i].classList.add('has-value')
     }
    // this.selectSubsidiaries(null,e);

  }
  else if (e == "Applicant") {
     $('#divApplicant').show();
     $('#divBene').hide();
     this.LcDetail.get('applicantName').setValue(sessionStorage.getItem('companyName'));
     this.LcDetail.get('applicantCountry').setValue(sessionStorage.getItem('registeredCountry'));
     this.LcDetail.get('beneName').setValue('');
     this.LcDetail.get('beneCountry').setValue('');
     this.hasValue=true;
  }
  else{
    this.LcDetail.get('applicantName').setValue('');
    this.LcDetail.get('applicantCountry').setValue('');
    this.LcDetail.get('beneName').setValue('');
    this.LcDetail.get('beneCountry').setValue('');
  }

}
goodsService() {
  this.loginService.getGoodsData().
    subscribe(
      (response) => {
        this.goodsArray = JSON.parse(JSON.stringify(response));
        this.goodsList = this.goodsArray.filter(item => item.productCategory !== 'None');
      },
      (error) => {}
    )
}
selectSubsidiaries(clone){
  console.log(clone)
clone=this.youAre;

if(this.LcDetail.get('applicantName').value){
debugger
  this.subsidiaries.forEach(element => {
    if(element.subCompany==this.LcDetail.get('applicantName').value){
      this.LcDetail.get('applicantCountry').setValue(element.country);
       sessionStorage.setItem('subUserID',element.subUserId);
    }
    
  });
}
else{

this.subsidiaries.forEach(element => {
  if(element.subCompany==this.LcDetail.get('beneName').value){
    this.LcDetail.get('beneCountry').setValue(element.country);
     sessionStorage.setItem('subUserID',element.subUserId);
  }
  
});
}


}
onKeyUpBeneEmail(event){    
  var emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
  if(!emailPattern.test(event.target.value))
  {
    this.isValidBeneEmail=true;
  }​else{
    this.isValidBeneEmail=false;
  }
}
onKeyUpAppEmail(event){    
  var emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
  if(!emailPattern.test(event.target.value))
  {
    this.isValidAppEmail=true;
  }​else{
    this.isValidAppEmail=false;
  }
}

validateRegexFields(event, type){
  if(type == "number"){
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
  }
   // ValidateRegex.validateNumber(event);
  }
  else if(type == "alpha"){
    ValidateRegex.alphaOnly(event);
  }
  else if(type == "alphaNum"){
    ValidateRegex.alphaNumeric(event);
  }else if(type == "alphaNumericNoSpace"){
    ValidateRegex.alphaNumericNoSpace(event);
  }
  else if(type=="namewithspace"){
    var key = event.keyCode;
    if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/ || (event.shiftKey && key === 55) || key===190 /* . key*/)) {
        event.preventDefault();
    }    
  }else if(type == "date_validation"){  
    var key = event.keyCode;   
    if (key!=191 && key!=189 && key > 31 && (key < 48 || key > 57)) {
      event.preventDefault();
    }
  }
}

getSubsidiaryData(){
  const data = {
    "userId": sessionStorage.getItem('userID'),
  }
  this.psd.subUserListForNewTxn(data).
    subscribe(
      (response) => {
        this.subsidiaries = JSON.parse(JSON.stringify(response)).list;    
        this.selectedcountry=this.subsidiaries;
       
        this.countryData.push('All');
        for (let entry of this.subsidiaries) {
          this.countryData.push(entry.subCompany);
        }
        console.log(this.countryData)


if(this.youAre=='Applicant'){
this.subsidiaries.forEach(element => {

  if(element.subCompany==this.applicantName){
    this.LcDetail.get('applicantCountry').setValue(element.country);
     sessionStorage.setItem('subUserID',element.subUserId);
  } 
});
}
else if(this.youAre=='Beneficiary'){
this.subsidiaries.forEach(element => {   
 if (element.subCompany==this.beneName){
    this.LcDetail.get('beneCountry').setValue(element.country);
     sessionStorage.setItem('subUserID',element.subUserId);
  }
  
});
}
              },
      (error) => {}
    )
}


onKey(value) { 
  console.log(value)
  this.selectedcountry = this.search(value);
  this.selectSubsidiaries(value)
   }
   search(value: string) { 
     let filter = value.toLowerCase();
     return this.subsidiaries.filter(option => option.subCompany.toLowerCase().startsWith(filter));
   }
 

   public next() {  
    console.log(this.counter)

   if(this.lcDetailForm.get('beneContactPersonEmail').value){
     var emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
   if(!emailPattern.test(this.lcDetailForm.get('beneContactPersonEmail').value))
   {
     this.errorMsg=" Email ID is Invalid. "
       $('#validateMsg').show();  
       return
   }
   }
   let elements = document.getElementsByTagName('input');
   for (var i = 0; i < elements.length; i++) {
     if(elements[i].value)
     elements[i].classList.add('has-value')
   }
   let elementTextarea = document.getElementsByTagName('textarea');
   for (var i = 0; i < elementTextarea.length; i++) {
     if(elementTextarea[i].value)
     elementTextarea[i].classList.add('has-value')
   }
   let elementSelect = document.getElementsByTagName('select');
   for (var i = 0; i < elementSelect.length; i++) {
     if(elementSelect[i].value)
     elementSelect[i].classList.add('has-value')
   }
  
   this.previewShow = false;
   this.titleService.loading.next(true);

   const anchor: any[] = $('.nav-tabs').find('a');

   for (let index = 0; index < anchor.length; index++) {


     if (index == this.counter && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter + 1)) {
       $(anchor[index]).attr('aria-expanded', 'true');
       $(anchor[index]).parent().addClass('active')

       const tabpanes: any[] = $('.tab-content').find('.tab-pane')
       for (let i = 0; i < tabpanes.length; i++) {
         if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter + 1)) {
           $(tabpanes[i]).addClass('active');
         } else {
           $(tabpanes[i]).removeClass('active');
         }

       }
     } else {
       $(anchor[index]).attr('aria-expanded', 'false');
       $(anchor[index]).parent().removeClass('active')
     }


   }
   this.counter++;
   debugger
   if (this.saveCount == this.counter) {
     this.isPrev = true;
     this.isNext = false;
     this.isSave = false;
     if(this.isUpdate){
       this.showUpdateButton = true;
       this.isPreview = false;
     }
     else{
       this.showUpdateButton = false;
       this.isPreview = true;
     }
   } else {
     this.isPrev = true;
   }
   this.titleService.loading.next(false);


 }

 public prev() {
   this.previewShow = false;
   this.titleService.loading.next(true);
   const anchor: any[] = $('.nav-tabs').find('a');
   this.counter--;

   for (let index = 0; index < anchor.length; index++) {

     if (index == (this.counter - 1) && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter)) {
       $(anchor[index]).attr('aria-expanded', 'true');
       $(anchor[index]).parent().addClass('active');

       const tabpanes: any[] = $('.tab-content').find('.tab-pane')
       for (let i = 0; i < tabpanes.length; i++) {
         if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter)) {
           $(tabpanes[i]).addClass('active');
         } else {
           $(tabpanes[i]).removeClass('active');
         }

       }
     } else {
       $(anchor[index]).attr('aria-expanded', 'false');
       $(anchor[index]).parent().removeClass('active')
     }

   }

   if (this.counter == 1) {
     this.isPrev = false;
     this.isNext = true;
     this.isSave = false;
     this.isPreview = false;
     this.showUpdateButton = false;

   } else {  
     this.isPrev = true;
     this.isNext = true;
     this.isSave = false;
     this.isPreview = false;
     this.showUpdateButton = false;
   }
   this.titleService.loading.next(false);
 }

//  portDischargeOnchange(event:any){
//   var data;
//   if(this.lcDetailForm.get('dischargeCountry').value==""){
//      data={
//       "countryName":event
      
//     } 
//   }else{
//      data={
//       "countryName":this.lcDetailForm.get('dischargeCountry').value
//     } 
//   }
    
//     this.upls.getPortByCountry(data).subscribe(
//       (response) => {
//         this.portOfDischarge = JSON.parse(JSON.stringify(response)).data;
//       });
      
// }
// portLoadingOnchange(event:any){
// var data;
// if(this.lcDetailForm.get('loadingCountry').value==""){
//  data={
//   "countryName":event
// } 
// }else{
//  data={
//   "countryName":this.lcDetailForm.get('loadingCountry').value
// } 
// }     
//     this.upls.getPortByCountry(data).subscribe(
//       (response) => {
//         this.portOfLoading = JSON.parse(JSON.stringify(response)).data;
//       });
// }

preview(){
console.log(Number(this.lcDetailForm.get('minParticipationAmt').value)+Number(this.lcDetailForm.get('retentionAmt').value))
console.log(Number(this.lcDetailForm.get('lCValue').value))
  if(Number(this.lcDetailForm.get('minParticipationAmt').value)+Number(this.lcDetailForm.get('retentionAmt').value) > Number(this.lcDetailForm.get('lCValue').value)){
    this.errMsg=true;
    return
  }else{
    this.errMsg=false;
  }
console.log(this.lcDetailForm);
  this.lcDetailForm.get('requirementType').setValue(this.lcDetailForm.get('selector').value)
  // new 
   let data = this.lcDetailForm.value;
  data.validity = (data.validity) ? this.dateFormat(data.validity) : this.dateFormat(this.validityDate);
  data.lcMaturityDate = (data.lcMaturityDate) ? this.dateFormat(data.lcMaturityDate) : this.dateFormat(this.lcMaturityDatenew);
  data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : this.dateFormat(this.lCIssuingDatenew);
  data.branchUserEmail=sessionStorage.getItem('custUserEmailId');
  console.log(data.branchUserEmail);
  // end

  this.upls.saveLc(data)
  .subscribe(
    (response) => {
      this.transactionID = JSON.parse(JSON.stringify(response)).data;
      this.loading = false;
      this.lc = this.lcDetailForm.value;
      this.previewShow = true;
      this.isPrev = false;
      this.isNext = false;
      this.isSave = false;
      this.isPreview = false;
      this.showUpdateButton = false;
      this.isEdit = true;
      this.isConfirm = true;
      this.titleService.loading.next(false);    })
  // this.upls.saveLc(this.lcDetailForm.value)
  // .subscribe(
  //   (response) => {
  //     this.transactionID = JSON.parse(JSON.stringify(response)).data;
  //     this.loading = false;
  //     this.lc = this.lcDetailForm.value;
  //     this.previewShow = true;
  //     this.isPrev = false;
  //     this.isNext = false;
  //     this.isSave = false;
  //     this.isPreview = false;
  //     this.showUpdateButton = false;
  //     this.isEdit = true;
  //     this.isConfirm = true;
  //     this.titleService.loading.next(false);    })
    
}


public checkCount() {
  this.titleService.loading.next(true);
   this.loading = true;
   console.log(this.lcDetailForm);
   let body = {
     transactionId: this.transactionID,
     userId:  sessionStorage.getItem('userID')
   }
   if(this.lcDetailForm.invalid){
    console.log(this.lcDetailForm);
    this.showErr = true;
    return;
  } else{
this.upls.confirmLc(body).subscribe(
        
  (response) => {
    this.status="active-secondary-transaction";
                
                  var errmsg = JSON.parse(JSON.stringify(response)).errMessage;
                  if(errmsg){
                    this.loading = false;
                    this.titleService.loading.next(false);
                    this.trnxFailedMsg=errmsg;
                    $('#trnxFailed').show();
                  
                  }
                  else{
                    // this.setForm();
                    this.edit();

 const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Successful',
              message: 'Your LC Transaction has been successfully placed. Keep checking the Active Transaction section for the quotes received.',
              parent: this.subURL+"/"+this.parentURL + "/"+this.status
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-secondary-transaction/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
          this.isUpdate = false;
        }

  })
}
}
public edit() {
  this.isUpdate = true;
  this.isEdit = false;
  this.showErr = false;
  this.isConfirm = false;
  this.previewShow = false;
  this.counter = 0;

  const anchor: any[] = $('.nav-tabs').find('a');

  for (let index = 0; index < anchor.length; index++) {


    if (index == this.counter && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter + 1)) {
      $(anchor[index]).attr('aria-expanded', 'true');
      $(anchor[index]).parent().addClass('active')

      const tabpanes: any[] = $('.tab-content').find('.tab-pane')
      for (let i = 0; i < tabpanes.length; i++) {
        if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter + 1)) {
          $(tabpanes[i]).addClass('active');
        } else {
          $(tabpanes[i]).removeClass('active');
        }

      }
    } else {
      $(anchor[index]).attr('aria-expanded', 'false');
      $(anchor[index]).parent().removeClass('active')
    }


  }
  this.counter++;


  this.isNext = true;
  this.isSave = false;
  this.isPreview = false;

  this.isPrev = false;

// this.Others.isESGComplaint(this.lcDetailForm.get('isESGComplaint').value)

}




public update(){
    this.showErr = false;
  if(Number(this.lcDetailForm.get('minParticipationAmt').value)+Number(this.lcDetailForm.get('retentionAmt').value) > Number(this.lcDetailForm.get('lCValue').value)){
    this.errMsg=true;
    return
  }else{
    this.errMsg=false;
  }
  this.loading = true;
  if(this.lcDetailForm.get('isESGComplaint').value){
    this.lcDetailForm.get('isESGComplaint').setValue("Yes");
  }     else{
  this.lcDetailForm.get('isESGComplaint').setValue("");
   }  
  this.titleService.loading.next(true);

  this.lcDetailForm.get('isESGComplaint').setValue("Yes");
  
  let data = this.lcDetailForm.value;
  data.validity = (data.validity) ? this.dateFormat(data.validity) : this.dateFormat(this.validityDate);
  data.lcMaturityDate = (data.lcMaturityDate) ? this.dateFormat(data.lcMaturityDate) : this.dateFormat(this.lcMaturityDatenew);
  data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : this.dateFormat(this.lCIssuingDatenew);
  data.transactionId = this.transactionID;
      this.upls.updateLc(data).subscribe(
        (response) => {
           this.transactionID = JSON.parse(JSON.stringify(response)).data;
          this.loading = false;
          this.titleService.loading.next(false);
          this.lc = this.lcDetailForm.value;
          this.previewShow = true;
          this.isPrev = false;
          this.isNext = false;
          this.isSave = false;
          this.isPreview = false;
          this.showUpdateButton = false;
          this.isEdit = true;
          this.isConfirm = true;
        },
        (error) => {
          this.loading = false;
          this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Failed',
              message: '',
              parent: this.subURL+"/"+this.parentURL +'/new-secondary-transaction'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-secondary-transaction/error`], navigationExtras)
            .then(success => console.log('navigation error?', success))
            .catch(console.error);
        }
      )
    
}


callDraftTransaction(trnsactionID){
  this.transactionID = trnsactionID;
  const param = {
    transactionId: trnsactionID
  }
  let emailBodyUpdate = {
    "transactionid": trnsactionID,
    "userId": sessionStorage.getItem('userID'),
    "event": "LC_UPDATE"
    }
  this.isUpdate = true;
  
  this.upls.getCustspecificDraftTransaction(param).subscribe(
    (response) => {
  
      this.draftData = JSON.parse(JSON.stringify(response)).data;
  
    
      this.portDischargeOnchange(this.draftData.dischargeCountry)
      this.portLoadingOnchange(this.draftData.loadingCountry)
      this.lcDetailForm.patchValue({
        userId: this.draftData.userId,
        selector: this.draftData.requirementType,
        secTransactionType: this.draftData.secTransactionType,
        applicantCountry:this.draftData.applicantCountry,
        applicantName: this.draftData.applicantName,
        beneCountry: this.draftData.beneCountry,
        beneName: this.draftData.beneName,
        lCIssuanceBank:  this.draftData.lCIssuanceBank,
        lCIssuanceBranch:  this.draftData.lCIssuanceBranch,
        swiftCode:  this.draftData.swiftCode,
        lCIssuanceCountry:  this.draftData.lCIssuanceCountry,
        lCValue:  this.draftData.lCValue,
        lCCurrency:  this.draftData.lCCurrency,
        goodsType: this.draftData.goodsType,
        otherType: this.draftData.otherType,
        validity: this.draftData.validity,
        minParticipationAmt: this.draftData.minParticipationAmt,
        isESGComplaint: this.draftData.isESGComplaint,
        retentionAmt: this.draftData.retentionAmt,
        loadingCountry: this.draftData.loadingCountry,
        loadingPort: this.draftData.loadingPort,
        dischargeCountry: this.draftData.dischargeCountry,
        dischargePort: this.draftData.dischargePort,
        applicableLaw: this.draftData.applicableLaw,
        requirementType:  this.draftData.requirementType,
        commissionScheme: this.draftData.commissionScheme,     
        lcMaturityDate: this.draftData.lcMaturityDate,
        lCIssuingDate:  this.draftData.lCIssuingDate, 
        benchmark: this.draftData.benchmark,
        otherCondition: this.draftData.otherCondition,   
        usanceDays: this.draftData.usanceDays,
        offeredPrice: this.draftData.offeredPrice,
      participationBasis: this.draftData.participationBasis
     
      });
 //  this.lcDetail = this.lcDetailForm.value;

}     
    ,(error) =>{
    }
    )
}

onItemSelect(item) {
  var str = item; 
  var splittedStr =str.split(": ",2)
    this.othersStr=splittedStr[1];
  if(splittedStr[1]=="Others"){
    this.isBankOther=true;      
   // loads();
  }else{
    this.isBankOther=false;
  }
}

//new 
isESGComplaint(Checked){
  console.log(Checked)
if(Checked=='Yes')
this.LcDetail.get('isESGComplaint').setValue(true);
else
this.LcDetail.get('isESGComplaint').setValue(false);

}

selectCountryInfo(e){
  //   let country= this.lcDetailForm.get('lCIssuanceCountry').value;
      const param={
        "lCIssuanceCountry":e
        }
      this.upls.getBankCountForCountry(param).subscribe((response)=>{
  this.selectInfo=   JSON.parse(JSON.stringify(response)).data;
  
      })
  
      }

      portDischargeOnchange(event:any){
        var data;
        if(this.lcDetailForm.get('dischargeCountry').value==""){
           data={
            "countryName":event
            
          } 
        }else{
           data={
            "countryName":this.lcDetailForm.get('dischargeCountry').value
          } 
        }
          
          this.upls.getPortByCountry(data).subscribe(
            (response) => {
              this.portOfDischarge = JSON.parse(JSON.stringify(response)).data;
            });
            
      }
      portLoadingOnchange(event:any){
    var data;
    if(this.lcDetailForm.get('loadingCountry').value==""){
       data={
        "countryName":event
      } 
    }else{
       data={
        "countryName":this.lcDetailForm.get('loadingCountry').value
      } 
    }
    
         
          this.upls.getPortByCountry(data).subscribe(
            (response) => {
              this.portOfLoading = JSON.parse(JSON.stringify(response)).data;
            });
      }

setDateFromApi(inDate){
  if(inDate == undefined){
    inDate = '';
  }
  else{
    inDate = new Date(inDate);
  }
  return inDate;
}

callCloneTransaction(trnsactionID){
  this.transactionID = trnsactionID;
  var data = {
    "transactionId":trnsactionID
    }

    this.upls.custCloneTransaction(data).subscribe(
      (response) => {
        this.cloneData = JSON.parse(JSON.stringify(response)).data;
      console.log(this.cloneData)
      sessionStorage.setItem('userTypeForDraft',this.cloneData.userType);
      sessionStorage.setItem('requirementTypeForDraft',this.cloneData.requirementType)
        if(this.cloneData.goodsType.startsWith('Others')){
          this.isBankOther=true;      
          var str = this.cloneData.goodsType; 
          var splittedStr =str.split(" - ",2)
            this.othersStr=splittedStr[0];
       this.cloneData.goodsType=this.othersStr;
       this.cloneData.otherType=splittedStr[1];

         }else{
           this.isBankOther=false;
         }
         if(this.cloneData.bgType!=null)
         if (this.cloneData.bgType.startsWith('Others')){
          this.isBgOther=true;      
          var str = this.cloneData.bgType; 
          var splittedStr =str.split(" - ",2)
            this.othersStr=splittedStr[0];
         //otherBGType
          this.cloneData.bgType=this.othersStr
          this.cloneData.otherBGType=splittedStr[1];
         }else{
           this.isBankOther=false;
         }

        this.ngOnInit();    

        this.selectCountryInfo(this.cloneData.lCIssuanceCountry)
        // this.ApplicantBeneficiary.onItemChange(this.cloneData.userType,this.cloneData.beneContactPerson ,
        //   this.cloneData.beneContactPersonEmail,
        //   this.cloneData.applicantContactPerson,this.cloneData.applicantContactPersonEmail,this.cloneData.applicantName,this.cloneData.beneName);     
          // this.Others.isESGComplaint(this.cloneData.isESGComplaint)
    
        this.portDischargeOnchange(this.cloneData.dischargeCountry)
        this.portLoadingOnchange(this.cloneData.loadingCountry)
        // this.Others.onItemChange(this.cloneData.chargesType)
       // this.Others.upload(this.cloneData.lcProForma)
        // this.tenor.selectors(this.cloneData.requirementType) 
        // this.tenor.upload(this.cloneData.tenorFile);
        // this.Others.onSelectBG(this.cloneData.requirementType);
    


      // this.lcDetailForm.patchValue({
      //   // otherType:this.cloneData.otherType,
      //   bgType:this.cloneData.bgType,
       
      //   userId: this.cloneData.userId,
      //   selector: this.cloneData.requirementType,
      //   secTransactionType:this.cloneData.secTransactionType,

      //   lCIssuanceBank: this.cloneData.lCIssuanceBank,
      //   lCIssuanceBranch: this.cloneData.lCIssuanceBranch,
      //   swiftCode: this.cloneData.swiftCode,
      //   lCIssuanceCountry: this.cloneData.lCIssuanceCountry,
    
      //   lCValue: this.cloneData.lCValue,
      //   lCCurrency: this.cloneData.lCCurrency,
      //   lCIssuingDate: this.setDateFromApi(this.cloneData.lCIssuingDate),
      //   lastShipmentDate: this.setDateFromApi(this.cloneData.lastShipmentDate),
      //  // bgExpiryDate:this.setDateFromApi(this.draftData.bgExpiryDate),
      //   lCExpiryDate:this.setDateFromApi(this.cloneData.lCExpiryDate),    

      //   claimExpiryDate:this.setDateFromApi(this.cloneData.claimExpiryDate),
      //   negotiationDate: this.setDateFromApi(this.cloneData.negotiationDate),
      //   goodsType:this.cloneData.goodsType,
    
    
      //   // For Confirmation 
      //   confirmationPeriod: this.cloneData.confirmationPeriod,
      //   paymentTerms: this.cloneData.paymentTerms,
      //   startDate:this.cloneData.startDate,
      //   // tenorEndDate: this.cloneData.tenorEndDate,
    
      //   // For Discounting 
      //   discountingPeriod:this.cloneData.discountingPeriod,
      //   remarks:this.cloneData.remarks,
    
      //   //For Refinancing
      //   originalTenorDays:this.cloneData.originalTenorDays,
      //   refinancingPeriod:this.cloneData.refinancingPeriod,
      //   // lcMaturityDate:this.setDateFromApi(this.cloneData.lcMaturityDate),
      //   lcNumber:this.cloneData.lcNumber,
      //             lastBeneBank:this.cloneData.lastBeneBank,
      //   lastBeneSwiftCode:this.cloneData.lastBeneSwiftCode,
      //   lastBankCountry:this.cloneData.lastBankCountry,
    
      //  // tenorFile:this.cloneData.tenorFile,

      //   applicantName:this.cloneData.applicantName,
      //   applicantCountry:this.cloneData.applicantCountry,
    
      //   beneName:this.cloneData.beneName,
      //   beneBankCountry:this.cloneData.beneBankCountry,
      //   beneBankName:this.cloneData.beneBankName,
      //   beneSwiftCode:this.cloneData.beneSwiftCode,
      //   beneCountry:this.cloneData.beneCountry,
        
       
      //   loadingCountry:this.cloneData.loadingCountry,
      //   loadingPort:this.cloneData.loadingPort,
      //   dischargeCountry:this.cloneData.dischargeCountry,
      //   dischargePort:this.cloneData.dischargePort,
    
      //  // chargesType: this.cloneData.chargesType,
      //   // validity:this.setDateFromApi(this.cloneData.validity),
      //  // isESGComplaint:this.cloneData.isESGComplaint,
      //  // lcProForma:this.cloneData.lcProForma,          
      //   insertedDate: this.cloneData.insertedDate,
      //   insertedBy: this.cloneData.insertedBy,
      //   modifiedDate: this.cloneData.modifiedDate,
      //   modifiedBy: this.cloneData.modifiedBy,
      //   transactionflag: this.cloneData.transactionflag,
      //   transactionStatus: this.cloneData.transactionStatus,
      //   userType:this.cloneData.userType,
      //   applicantContactPerson:this.cloneData.applicantContactPerson,
      //   applicantContactPersonEmail:this.cloneData.applicantContactPersonEmail,
      //   beneContactPerson:this.cloneData.beneContactPerson,
      //   beneContactPersonEmail:this.cloneData.beneContactPersonEmail,
      // });
      this.lcDetailForm.patchValue({
      userId: this.cloneData.userId,
      selector: this.cloneData.requirementType,
      secTransactionType: this.cloneData.secTransactionType,
      applicantCountry:this.cloneData.applicantCountry,
      applicantName: this.cloneData.applicantName,
      beneCountry: this.cloneData.beneCountry,
      beneName: this.cloneData.beneName,
      lCIssuanceBank:  this.cloneData.lCIssuanceBank,
      // lCIssuanceBranch:  this.cloneData.lCIssuanceBranch,
      // swiftCode:  this.cloneData.swiftCode,
      lCIssuanceCountry:  this.cloneData.lCIssuanceCountry,
      lCValue:  this.cloneData.lCValue,
      lCCurrency:  this.cloneData.lCCurrency,
      goodsType: this.cloneData.goodsType,
      otherType: this.cloneData.otherType,
      // validity: this.setDateFromApi(this.cloneData.validity),
      minParticipationAmt: this.cloneData.minParticipationAmt,
      isESGComplaint: this.cloneData.isESGComplaint,
      retentionAmt: this.cloneData.retentionAmt,
      loadingCountry: this.cloneData.loadingCountry,
      loadingPort: this.cloneData.loadingPort,
      dischargeCountry: this.cloneData.dischargeCountry,
      dischargePort: this.cloneData.dischargePort,
      // applicableLaw: this.cloneData.applicableLaw,
      requirementType:  this.cloneData.requirementType,
      commissionScheme: this.cloneData.commissionScheme,     
      // lcMaturityDate: this.setDateFromApi(this.cloneData.lcMaturityDate),
      // lCIssuingDate:  this.setDateFromApi(this.cloneData.lCIssuingDate), 
      benchmark: this.cloneData.benchmark,
      otherCondition: this.cloneData.otherCondition,   
      usanceDays: this.cloneData.usanceDays,
      offeredPrice: this.cloneData.offeredPrice,
      participationBasis: this.cloneData.participationBasis
    });
      console.log(this.lcDetailForm.value);
      },
      (err) => {}
  ) 
}
novalidation(val){
  console.log(val);
  console.log(this.lcDetailForm.value.secTransactionType);
  if(val === 'Funded'){
    this.lcDetailForm.controls['benchmark'].setValidators(Validators.required);

    console.log(' im funded')
    // this.lcDetailForm.controls['RBIQuaterlyReporting'].setValidators(Validators.required);
  }else {
   this.lcDetailForm.controls['benchmark'].clearValidators();
  //  this.lcDetailForm.controls['RBIQuaterlyReporting'].clearValidators();
  }
  this.lcDetailForm.controls['benchmark'].updateValueAndValidity();
  // this.lcDetailForm.controls['RBIQuaterlyReporting'].updateValueAndValidity();
}

novalidationunfunded(valnew){
  console.log(valnew);
  this.lcDetailForm.controls['benchmark'].clearValidators();
  this.lcDetailForm.controls['benchmark'].updateValueAndValidity();
}
}