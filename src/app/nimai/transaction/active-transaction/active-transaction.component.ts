import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationComponent } from '../transactionTypes/confirmation/confirmation.component';
import { DiscountingComponent } from '../transactionTypes/discounting/discounting.component';
import { ConfirmAndDiscountComponent } from '../transactionTypes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from '../transactionTypes/refinancing/refinancing.component';
import { BankerComponent } from '../transactionTypes/banker/banker.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from '../../../../assets/js/jquery.min'
import { Tflag } from 'src/app/beans/Tflag';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { ReportsService } from 'src/app/services/reports.service';
import { BankGuaranteeComponent } from '../transactionTypes/bank-guarantee/bank-guarantee.component';
import { SortPipe } from 'src/app/pipe/sort-pipe.pipe';
import { AvalisationComponent } from '../transactionTypes/avalisation/avalisation.component';


@Component({
  selector: 'app-active-transaction',
  templateUrl: './active-transaction.component.html',
  styleUrls: ['./active-transaction.component.css']
})
export class ActiveTransactionComponent implements OnInit { 
  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  @ViewChild(BankGuaranteeComponent, { static: false }) bankGuarantee: BankGuaranteeComponent;
  @ViewChild(AvalisationComponent, { static: false }) avalisation: AvalisationComponent;

  public ntData: any[] = [];
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public newday:any ="";
  public detail: any;
  QRdetail: any = "";
  noQRdetail: boolean = false;
  getSpecificDetail: any = "";
  detailInfocal: any ="";
  quotationReqType: string;
  lCCurrencyReq:string;
  acceptedDetails: any = "";
  public parentURL: string = "";
  public subURL: string = "";
  acceptedErrorDetail: any;
  acceptedQuoteMessage:any;
  detailInfo: any;
  // detailInfocal:any;
  public unlock :string="";
  noOfQR: any;  
  goodsArray: any;
  subsidiaries: any;
  usercode: any;
  selectedSub: any;
  disablesubsi: boolean=false;
  disableForBC: boolean=true;
  disableUserCode: boolean=false;
  accountType: string;
  selectedUCode: string="";
  usersid: string;
  emailId: string;
  emailid: string;
  nimaiCount: any;
  creditCounts: number;
  creditCount: boolean=false;
  trnxMsg: string;
  changeText: boolean;
  lcAmount: any;
  public calday: any;
  applicablevalue: any;
  confirmcomssion:any;
  discountinginterest:any;
  negtoInterest:any;
  negot: boolean;
  matur: boolean;


  constructor(private sortPipe: SortPipe,public titleService: TitleService,public psd: PersonalDetailsService,public Sub:SubscriptionDetailsService, public loginService: LoginService,public report :ReportsService, public nts: NewTransactionService, public bds: BusinessDetailsService, public router: Router, public activatedRoute: ActivatedRoute) {
    //this.titleService.quote.next(false);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });
    this.titleService.quote.next(false);

  }

  public getAllnewTransactions(userid,userIdOnLoad) {
    this.getUsercodeData(userid)

    this.titleService.quote.next(true);
    var userIdDetail = sessionStorage.getItem('userID');
  
   // var emailId = "";
    this.emailId = sessionStorage.getItem('branchUserEmailId');

    if(userIdDetail.startsWith('BC')){
      this.disablesubsi=true;
    }
    if(this.selectedUCode){
      this.emailId=this.selectedUCode;
    }
    this.accountType=sessionStorage.getItem('accountType')

    
    if(this.accountType=='Passcode'){
   this.usersid=""
    }else if(this.accountType=='SUBSIDIARY'){
      this.usersid=sessionStorage.getItem('userID')
    }
    else{
      this.usersid=userIdOnLoad
    }

  const data ={
    "branchUserEmail": this.emailId,
    "transactionStatus": "Active",
    "userId": this.usersid
  }

    this.nts.getTxnForCustomerByUserIdAndStatus(data).subscribe(
      (response) => {
        custTrnsactionDetail();
        this.detail=[];
        this.detail = JSON.parse(JSON.stringify(response)).data;
      if(this.accountType=='MASTER' && userIdDetail.startsWith('CU')){
        this.disablesubsi=true
        this.disableUserCode=true
      }     
      else  if (this.accountType=='MASTER' && userIdDetail.startsWith('BC')){
        this.disablesubsi=false
        this.disableUserCode=true
      }
      else if(this.accountType=='SUBSIDIARY' && userIdDetail.startsWith('CU')){
        this.disablesubsi=false
        this.disableUserCode=true
      } 
       else{
        this.disablesubsi=false
        this.disableUserCode=false
      }
     
      },(error) =>{
        this.hasNoRecord = true;
      }
    )
    
this.selectedUCode="";
this.selectedSub='';

  }

  ngOnInit() {     
    
    this.getCount()
    this.accountType=sessionStorage.getItem('accountType')
     this.goodsService();
 // this.getUsercodeData();
  this.getSubsidiaryData();
  $('#TransactionDetailDiv').hide();
  $('.acceptedPopupDetails').hide();
  $('.acceptedErrorDetails').hide();
  $('#backbtn').hide();

  $('#backbtn').click(function () {
    
      $('#changetext').html('Active Transactions');
      $('#TransactionDetailDiv').slideUp();
      $('#transactionID').slideDown();
      $('#TransactionDetailDiv').hide();
      $('#transactionFilter').show();
      $('#backbtn').fadeOut();
});

  }

 getCount(){
  if(sessionStorage.getItem('branchUserEmailId')==null || sessionStorage.getItem('branchUserEmailId')==undefined || sessionStorage.getItem('branchUserEmailId')=="undefined"){
    this.emailid=""
  }else{
    this.emailid=sessionStorage.getItem('branchUserEmailId')
  }
  let data = {
    "userid": sessionStorage.getItem('userID'),
    "emailAddress":this.emailid
  }
  this.Sub.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
    response => {        
      this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
      this.creditCounts=this.nimaiCount.lc_count-this.nimaiCount.lcutilizedcount
      if(this.creditCounts<=0)
      this.creditCount=true;
      else
      this.creditCount=false
      if(this.nimaiCount.accountstatus.toLowerCase()=='inactive'){
        sessionStorage.clear();
        this.router.navigate(['/']);
      }

    });
 }


  getSubsidiaryData(){
    const data = {
      "userId": sessionStorage.getItem('userID'),
    }
    this.psd.getSubUserList(data).
      subscribe(
        (response) => {
          this.subsidiaries = JSON.parse(JSON.stringify(response)).list;
        
        },
        (error) => {}
      )
  }
  getUsercodeData(userid){

    const data={
      "userId": userid,
      "branchUserEmail":this.selectedUCode
    }
    this.psd.getbranchUserList(data).
      subscribe(
        (response) => {
          this.usercode = JSON.parse(JSON.stringify(response)).list;
               

        },
        (error) => {}
      )
  }

  ngAfterViewInit() {
    this.selectedSub=sessionStorage.getItem('userID');

    this.getAllnewTransactions(this.selectedSub,'All'+this.selectedSub);
    this.confirmation.isActive = false;
    this.discounting.isActive = false;
    this.confirmAndDiscount.isActive = false;
    this.refinancing.isActive = false;
    this.banker.isActive = false;
    this.bankGuarantee.isActive=false;
    this.avalisation.isActive=false;

  }
  goodsService() {
    this.loginService.getGoodsData().
      subscribe(
        (response) => {
          this.goodsArray = JSON.parse(JSON.stringify(response));
        },
        (error) => {}
      )
}

   showQuotePage(pagename: string,action:Tflag,val:any) {
    
     this.getCount();
    let data = {
      "transactionId": val.transactionId,
    }
    this.nts.getSpecificTxnDetailByTxnId(data).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response)).data;        
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    if (pagename === 'confirmation' || pagename === 'Confirmation' ) {
      this.confirmation.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      this.avalisation.isActive = false;
      document.getElementById("menu-bar-con").style.width = "520px"; 
    } 
    else  if (pagename === 'bankGuarantee' || pagename === 'BankGuarantee' ) {
      this.bankGuarantee.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      this.confirmation.isActive=false;
      this.avalisation.isActive = false;
      document.getElementById("menu-bar-bg").style.width = "520px"; 
    } 
    else if (pagename === 'discounting' || pagename === 'Discounting') {
      this.confirmation.isActive = false;
      this.discounting.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.avalisation.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menu-bar-dis").style.width = "520px"; 
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.action(true,action,this.detailInfo, this.goodsArray,val.validity,val.transactionStatus);
      this.refinancing.isActive = false;
      this.avalisation.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menu-bar-conAndDis").style.width = "520px"; 
    } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.action(true,action,this.detailInfo, this.goodsArray,val.validity,val.transactionStatus);
      this.banker.isActive = false;
      this.avalisation.isActive = false;
      document.getElementById("menu-bar-ref").style.width = "520px"; 
    } else if (pagename === 'Banker’s Acceptance' || pagename === 'Banker' || pagename === 'banker') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.avalisation.isActive = false;
      this.banker.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      document.getElementById("menu-bar-bank").style.width = "520px";  
    }
    else if (pagename === 'BillAvalisation') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.avalisation.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      document.getElementById("menu-bar-av").style.width = "520px";  
    }
  },
  (error) => { }
)
  }
// new function
getvalue(detail,vale,applicableBenchmark,confirmationCharges,discountingCharges,negotiationChargesPerct){
console.log(detail, vale,applicableBenchmark,confirmationCharges,discountingCharges,negotiationChargesPerct);

console.log(vale);
this.getSpecificDetail = detail; 

console.log(this.getSpecificDetail);
this.lcAmount = this.getSpecificDetail.lcValue;

if (vale.requirementType == 'ConfirmAndDiscount' || vale.requirementType == 'BankGuarantee' || vale.requirementType == 'Confirmation'){
this.applicablevalue = (((this.lcAmount)*(applicableBenchmark/100)*(vale.confirmationPeriod))/(360)).toFixed(2)
console.log(this.applicablevalue);
// this.confirmcomssion = (confirmationCharges*100).toFixed(2);
// console.log(this.confirmcomssion);

this.discountinginterest = (((this.lcAmount)*(discountingCharges/100)*(vale.confirmationPeriod))/(360)).toFixed(2)
console.log(this.discountinginterest);

this.negtoInterest = (this.lcAmount*(negotiationChargesPerct/100)).toFixed(2);
console.log(this.negtoInterest);
}
// discountin
if(vale.requirementType == 'Discounting' ){
  this.applicablevalue = (((this.lcAmount)*(applicableBenchmark/100)*(vale.discountingPeriod))/(360)).toFixed(2)
  console.log(this.applicablevalue);
  // this.confirmcomssion = (confirmationCharges*100).toFixed(2);
  // console.log(this.confirmcomssion);
  
  this.discountinginterest = (((this.lcAmount)*(discountingCharges/100)*(vale.discountingPeriod))/(360)).toFixed(2)
  console.log(this.discountinginterest);
  this.negtoInterest = (this.lcAmount*(negotiationChargesPerct/100)).toFixed(2);
console.log(this.negtoInterest);
}
 

// for billavalisation
if(vale.requirementType == 'BillAvalisation'){
  this.applicablevalue = (((this.lcAmount)*(applicableBenchmark/100)*(vale.discountingPeriod))/(360)).toFixed(2)
console.log(this.applicablevalue);
  this.discountinginterest = (((this.lcAmount)*(discountingCharges/100)*(vale.discountingPeriod))/(360)).toFixed(2)
  console.log(this.discountinginterest);
}


// for bankga
if(vale.requirementType == 'Banker'){
  this.applicablevalue = (((this.lcAmount)*(applicableBenchmark/100)*(vale.discountingPeriod))/(360)).toFixed(2)
  console.log(this.applicablevalue);
  // this.confirmcomssion = (confirmationCharges*100).toFixed(2);
 
  
  this.discountinginterest = (((this.lcAmount)*(this.getSpecificDetail.bankerAcceptCharges/100)*(vale.discountingPeriod))/(360)).toFixed(2)
  console.log(this.discountinginterest);
  
  this.negtoInterest = (this.lcAmount*(negotiationChargesPerct/100)).toFixed(2);
  console.log(this.negtoInterest);
}


// for refianace
if (vale.requirementType == 'Refinance'){
  this.applicablevalue = (((this.lcAmount)*(applicableBenchmark/100)*(vale.refinancingPeriod))/(360)).toFixed(2)
  console.log(this.applicablevalue);
  this.discountinginterest = (((this.lcAmount)*(this.getSpecificDetail.refinancingCharges/100)*(vale.refinancingPeriod))/(360)).toFixed(2)
console.log(this.discountinginterest);
}


}



newdetails(val){
  console.log(val);
}
  closed_div(){
//$('#menu-barnew').hide();
document.getElementById("menu-barnew").style.width = "0%"; 
document.getElementById("myCanvasNav").style.width = "0%";
document.getElementById("myCanvasNav").style.opacity = "0"; 
  }

  inactiveOk(){
    $('#pop-up').hide();
  }

  showQuoteDetail(userId,transactionId,requirementType,lCCurrency){

    this.getCount();
    
    this.disablesubsi=false;
    this.disableUserCode=false;
   
   
   
    
    let data = {
      "userId": userId,
      "transactionId": transactionId
    }
    
    this.nts.getAllQuotationDetails(data).subscribe(
      (response) => {
      
        this.QRdetail = JSON.parse(JSON.stringify(response)).data;
        if(JSON.parse(JSON.stringify(response)).status=="Failure"){
         if(0> this.creditCounts || this.nimaiCount.status.toLowerCase()=='inactive'){
          this.trnxMsg=JSON.parse(JSON.stringify(response)).errMessage;
          $('#pop-up').show();
          return
        } 
        }else{
          $('#changetext').html('Bank Quotes');
          $('#transactionID').slideUp();
          $('#TransactionDetailDiv').slideDown();
          $('#transactionFilter').hide();
          $('#backbtn').fadeIn();
          this.noQRdetail = false;
          console.log(this.QRdetail.applicableBenchmark, this.QRdetail.confirmationCharges , this.QRdetail.discountingCharges,this.QRdetail.negotiationChargesPerct);
// this.QRdetail  = this.sortPipe.transform(this.QRdetail, "desc", "name");
        this.quotationReqType =requirementType;
        this.lCCurrencyReq=lCCurrency;
          this.QRdetail = this.QRdetail.map(item => ({
          ...item,
          isSelected: false
        }));
        if(!this.QRdetail){
          this.noQRdetail = true;
        }
      }
      },(error) =>{
      }
    )

    let data1 = {
      "transactionId": transactionId,
    }
    this.nts.getSpecificTxnDetailByTxnId(data1).subscribe(
      (response) => {
        console.log(response);
        this.detailInfocal = JSON.parse(JSON.stringify(response)).data;
        console.log(this.detailInfocal);
        this.calday = JSON.parse(JSON.stringify(response)).data.confirmationPeriod;
        this.newday = this.calday;
        console.log(this.calday, this.lcAmount);
      } 
    )
    console.log(this.QRdetail.applicableBenchmark, this.QRdetail.confirmationCharges , this.QRdetail.discountingCharges,this.QRdetail.negotiationChargesPerct)
  }
  closed_QA(){
     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
  });
  }
  openOffcanvas(act) {
    if(act=='quote'){
      document.getElementById("menu-barnew").style.width = "500px";
    }
    }
   
 openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";  
 }
 closeOffcanvas() {
    document.getElementById("menu-barnew").style.width = "0%"; 
    document.getElementById("menu-bar-con").style.width = "0%"; 
    document.getElementById("menu-bar-bg").style.width = "0%"; 
    document.getElementById("menu-bar-dis").style.width = "0%"; 
    document.getElementById("menu-bar-conAndDis").style.width = "0%"; 
    document.getElementById("menu-bar-ref").style.width = "0%"; 
    document.getElementById("menu-bar-bank").style.width = "0%";  
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0"; 
 } 

  getQRDetail(detail,requirementType,lCCurrency){
    this.getSpecificDetail = detail;    
  // console.log(this.getSpecificDetail);
    let param = {
      "userId": sessionStorage.getItem('userID'),
      "transactionId": detail.transactionId,
      "quotationId":detail.quotationId
    }
    if(requirementType =='BankGuarantee'){
    this.nts.getConfChargesForQuoteAmount(param).subscribe((response)=>{
      console.log(response);
      console.log(JSON.parse(JSON.stringify(response)).data[0]);
      // if(JSON.parse(JSON.stringify(response)).data[0].requirementType == 'BankGuarantee')
      {
        console.log('i m in bg');
        if(JSON.parse(JSON.stringify(response)).data[0].confChgsIssuanceToexp == 'yes'){
             console.log('this is true');
             this.negot = true;
             this.matur = false;
        }else if(JSON.parse(JSON.stringify(response)).data[0].confChgsIssuanceToClaimExp == 'yes'){
          console.log('this is nottrue');
          this.negot = false;
          this.matur = true;
        }
      }
      var str = JSON.parse(JSON.stringify(response)).status; 
      var splittedNego = str.split(",", 1); 
      var nego=splittedNego[0].split(":", 2)
      this.getSpecificDetail.confChgsIssuanceToNegot=nego[1];

      var splittedMature = str.split(",", 2); 
      var mature=splittedMature[1].split(":", 2)
      this.getSpecificDetail.confChgsIssuanceToMatur=mature[1];

      var splittedtilldate = str.split(",", 3); 
      var td=splittedtilldate[2].split(":", 2)
      this.getSpecificDetail.confChgsIssuanceToexp=td[1];
  
      var splittedClaimDate = str.split(",", 4); 
      var tcd=splittedClaimDate[3].split(":", 2)
      this.getSpecificDetail.confChgsIssuanceToClaimExp=tcd[1];
    });
  }
  // old
  this.nts.getConfChargesForQuoteAmount(param).subscribe((response)=>{
    console.log(response);
    console.log(JSON.parse(JSON.stringify(response)).data[0]);
   
    var str = JSON.parse(JSON.stringify(response)).status; 
    var splittedNego = str.split(",", 1); 
    var nego=splittedNego[0].split(":", 2)
    this.getSpecificDetail.confChgsIssuanceToNegot=nego[1];

    var splittedMature = str.split(",", 2); 
    var mature=splittedMature[1].split(":", 2)
    this.getSpecificDetail.confChgsIssuanceToMatur=mature[1];

    var splittedtilldate = str.split(",", 3); 
    var td=splittedtilldate[2].split(":", 2)
    this.getSpecificDetail.confChgsIssuanceToexp=td[1];

    var splittedClaimDate = str.split(",", 4); 
    var tcd=splittedClaimDate[3].split(":", 2)
    this.getSpecificDetail.confChgsIssuanceToClaimExp=tcd[1];
  });
  
    this.getSpecificDetail.confChgsIssuanceToNegot
    this.quotationReqType = requirementType;
    this.lCCurrencyReq=lCCurrency;

    let data1 = {
      "transactionId": detail.transactionId,
    }
    this.nts.getSpecificTxnDetailByTxnId(data1).subscribe(
      (response) => {
        this.detailInfocal = JSON.parse(JSON.stringify(response)).data;
        console.log(this.detailInfocal);
        this.lcAmount = this.detailInfocal.lCValue;
        var  calday1 = JSON.parse(JSON.stringify(response)).data.confirmationPeriod;
        // console.log(this.calday);
        // console.log(calday1, this.lcAmount);
      } 
    )
   
 }

 showAcceptedDetails(index,qId, tId, quotationDetails){
// if(this.creditCount){
//   this.acceptedErrorDetail = "You cannot accept the quote. Please renew the Subscription Plan.";

//   $('.acceptedErrorDetails').show();
//   return
  
// }


    let req = {
    "quotationId": qId,
	  "transactionId": tId,
    "userId":sessionStorage.getItem("userID")
  }

  index = index + 1;

      this.acceptedDetails = quotationDetails;
      
      this.nts.acceptBankQuote(req).subscribe(
        (response) => {          
          var acceptQuoteResp = JSON.parse(JSON.stringify(response));
          this.acceptedQuoteMessage=acceptQuoteResp.status
          if(acceptQuoteResp.status.toLowerCase() == "failure"){
            $('.acceptedErrorDetails').show();
            this.acceptedErrorDetail = acceptQuoteResp.errMessage;
          }
          else{
            $('.acceptedPopupDetails').show();
            $('#TransactionDetailDiv tr:eq(' + index +') td:eq(2)').html(this.acceptedDetails.bankName + ' - ' + this.acceptedDetails.branchName + ', '+ this.acceptedDetails.countryName);
            $('#TransactionDetailDiv tr:eq(' + index +') td:eq(6)').html("Accepted");
          }
        },
        (err) => {
          console.log("Failure");
        }
      )
    
 }

 redirectAsAccepted(){
  this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/transaction-details"]);
 }


// selectSubsidiaries(val){
//     if(val!="none"){
//       this.selectedSub=val;
//     }
// }

selectSubsidiaries(val: any) {
  this.selectedSub='';

      this.selectedSub=val;

      var userid= val.replace('All' , '')
   
      this.getAllnewTransactions(userid,this.selectedSub)
  }
  selectUsercode(val: any) {
    if(val=='All'){
      this.selectedUCode=val;
      this.selectedSub=sessionStorage.getItem('userID')
      this.getAllnewTransactions(this.selectedSub,this.selectedSub)
    }else{
      this.selectedUCode=val;
      this.selectedSub=""
      this.getAllnewTransactions(this.selectedSub,this.selectedSub)
    }
   
}
refreshPage(){
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
});
}
downloadPDF(){

  const data= {
    "userId": sessionStorage.getItem('userID'),
    "transactionStatus":"Active",
    "branchUserEmail":sessionStorage.getItem('branchUserEmailId')
  }

  this.report.downloadPDFReportForTransaction(data).subscribe((response)=>{
console.log(response)
  })
  
}
downloadExcel(){

  const data= {
    // "userId": "All"+sessionStorage.getItem('userID'),
    // "transactionStatus":"Active",
    // "branchUserEmail" :sessionStorage.getItem('branchUserEmailId')
    "branchUserEmail": this.emailId,
    "transactionStatus": "Active",
    "userId": this.usersid

  }

  this.report.downloadExcelReportForTransaction(data).subscribe((response)=>{
console.log(response)
  })
  
}
}