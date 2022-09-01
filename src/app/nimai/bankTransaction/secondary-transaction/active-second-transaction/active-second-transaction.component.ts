import { Compiler, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { Tflag } from 'src/app/beans/Tflag';
import { custTrnsactionDetail } from 'src/assets/js/commons';

import * as $ from 'src/assets/js/jquery.min';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { ReportsService } from 'src/app/services/reports.service';
import { SortPipe } from 'src/app/pipe/sort-pipe.pipe';
import { LoginService } from 'src/app/services/login/login.service';
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { ConfirmationPlacementComponent } from '../product-type/confirmation-placement/confirmation-placement.component';
import { ConfirmDiscountPlacementComponent } from '../product-type/confirm-discount-placement/confirm-discount-placement.component';
import { DiscountingPlacementComponent } from '../product-type/discounting-placement/discounting-placement.component';
import { RefinancingPlacementComponent } from '../product-type/refinancing-placement/refinancing-placement.component';
import { BankerPlacementComponent } from '../product-type/banker-placement/banker-placement.component';
import { BankGuaranteePlacementComponent } from '../product-type/bank-guarantee-placement/bank-guarantee-placement.component';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-active-second-transaction',
  templateUrl: './active-second-transaction.component.html',
  styleUrls: ['./active-second-transaction.component.css']
})
export class ActiveSecondTransactionComponent implements OnInit {

   @ViewChild(ConfirmationPlacementComponent, { static: true }) confirmation: ConfirmationPlacementComponent;
   @ViewChild(DiscountingPlacementComponent, { static: false }) discounting: DiscountingPlacementComponent;
  @ViewChild(ConfirmDiscountPlacementComponent, { static: false }) confirmAndDiscount: ConfirmDiscountPlacementComponent;
  @ViewChild(RefinancingPlacementComponent, { static: false }) refinancing: RefinancingPlacementComponent;
  @ViewChild(BankerPlacementComponent, { static: false }) banker: BankerPlacementComponent;
  @ViewChild(BankGuaranteePlacementComponent,{static:false}) bankGuarantee: BankGuaranteePlacementComponent;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  public ntData: any[] = [];
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public detail: any;
  QRdetail: any = "";
  QRdetailnew:any ="";
  noQRdetail: boolean = false;
  getSpecificDetail: any = "";
  quotationReqType: string;
  lCCurrencyReq:string;
  acceptedDetails: any = "";
  public parentURL: string = "";
  public subURL: string = "";
  acceptedErrorDetail: any;
  acceptedQuoteMessage:any;
  detailInfo: any;
  detailInfonew: any;
  detailnew: any;
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
  trnAmount: number=0.0;
  newAmount:number =0.0;
  rentAmount:number=0.0;
  partReceived:number=0.0;
  partReceivedredirect:number=0.0;
  newvalue:number=0.0;
  participaion: number=0.0;
  charges: any;
  TxnId: any;
  acceptedstatus:any;
  ObligorBank: any;
  applicablevalue: any;
  riskmargin:any;
  participationcomm: any;
  currentDateTime: any;
  isExperied: boolean = true;
  notExperied: boolean;
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


  backBtn(){
    this.changeText=false;
    this.trnAmount=0.0;
    this.rentAmount=0.0;
    this.newAmount =0.0;
    this.newvalue=0.0;
    this.partReceived=0.0;
    this.partReceivedredirect=0.0;
    this.participaion=0.0;
  }
  ngAfterViewInit() {
    this.selectedSub=sessionStorage.getItem('userID');

    this.getAllnewTransactions(this.selectedSub,'All'+this.selectedSub);
    // this.confirmation.isActive = false;
    // this.discounting.isActive = false;
    // this.confirmAndDiscount.isActive = false;
    // this.refinancing.isActive = false;
    // this.banker.isActive = false;
    // this.bankGuarantee.isActive=false;
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
        console.log(this.detailInfo);       
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    if (pagename === 'confirmation' || pagename === 'Confirmation' ) {
      this.confirmation.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
     this.banker.isActive = false;
      document.getElementById("menu-bar-con").style.width = "520px"; 
    } 
    else  if (pagename === 'bankGuarantee' || pagename === 'BankGuarantee' ) {
      this.bankGuarantee.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      this.confirmation.isActive=false;
      document.getElementById("menu-bar-bg").style.width = "520px"; 
    } 
    else if (pagename === 'discounting' || pagename === 'Discounting') {
      this.confirmation.isActive = false;
      this.discounting.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menu-bar-dis").style.width = "520px"; 
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
      // this.confirmation.isActive = false;
      // this.discounting.isActive = false;
     this.confirmAndDiscount.action(true,action,this.detailInfo, this.goodsArray,val.validity,val.transactionStatus);
      // this.refinancing.isActive = false;
      // this.banker.isActive = false;
     document.getElementById("menu-bar-conAndDis").style.width = "520px"; 
    }
    else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.action(true,action,this.detailInfo, this.goodsArray,val.validity,val.transactionStatus);
      this.banker.isActive = false;
      document.getElementById("menu-bar-ref").style.width = "520px"; 
    } else if (pagename === 'Banker’s Acceptance' || pagename === 'Banker' || pagename === 'banker') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      document.getElementById("menu-bar-bank").style.width = "520px";  
    }
    else  if (pagename === 'BillAvalisation' || pagename === 'BillAvalisation' ) {
      this.bankGuarantee.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      this.confirmation.isActive=false;
      document.getElementById("menu-bar-bg").style.width = "520px"; 
    }
    if (pagename === 'TradeLoan' || pagename === 'TradeLoan' ) {
      this.confirmation.action(true,action,this.detailInfo,this.goodsArray,val.validity,val.transactionStatus);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
     this.banker.isActive = false;
      document.getElementById("menu-bar-con").style.width = "520px"; 
    } 
  },
  (error) => { }
)
  }

  closed_div(){
//$('#menu-barnew').hide();
// document.getElementById("menubarConfirmQuote").style.width="0%";
document.getElementById("menu-barnewold").style.width = "0%";
document.getElementById("menu-barnew").style.width = "0%"; 
document.getElementById("myCanvasNav").style.width = "0%";
document.getElementById("myCanvasNav").style.opacity = "0"; 
  }

  inactiveOk(){
    $('#pop-up').hide();
  }

  showQuoteDetail(userId,transactionId,requirementType,lCCurrency){
    debugger
    this.getCount();
    // console.log(userId, transactionId,requirementType, lCCurrency);
    this.disablesubsi=false;
    this.disableUserCode=false;
  
   

    let data = {
      "userId": userId,
      "transactionId": transactionId
    }
    
    
    let data1 = {
      "transactionId": transactionId,
    }
    this.nts.getSpecificTxnDetailByTxnId(data1).subscribe(
      (response) => {
        this.detailnew = JSON.parse(JSON.stringify(response)).data;
        console.log(this.detailnew)
        // this.ObligorBank=  this.detailInfonew.lCIssuanceBank;
        // this.rentAmount = this.detailInfo.retentionAmt;
        // console.log(this.ObligorBank);
        // console.log(this.rentAmount);
       });

    this.nts.getAllQuotationDetails(data).subscribe(
      (response) => {
      
        if(JSON.parse(JSON.stringify(response)).status=="Failure"){
          if(0> this.creditCounts || this.nimaiCount.status.toLowerCase()=='inactive'){
           this.trnxMsg=JSON.parse(JSON.stringify(response)).errMessage;
           $('#pop-up').show();
           return
         } 
        }
        this.QRdetail = JSON.parse(JSON.stringify(response)).data;
  console.log(this.QRdetail);
console.log(this.QRdetail.validityDate); 
  
          this.QRdetail.forEach(element => {
          //  this.trnAmount= element.lcValue+this.trnAmount
          this.trnAmount= element.lcValue
          console.log(this.trnAmount);
          this.TxnId = element.transactionId
           this.partReceived=element.participationAmount+this.partReceived
           console.log(this.partReceived);
           this.acceptedstatus = element.quotationStatus;
           console.log(this.acceptedstatus);
           // date validity
           console.log(element.validityDate.split('T',2));
           var olddate = element.validityDate.split('T',2);
          //  console.log(olddate); 
           this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US');
          //  console.log(this.currentDateTime);  
           if(olddate[0] > this.currentDateTime ){
            console.log('i m not experied')
            this.isExperied = false;
            this.notExperied = false;
            return;
           } else if(olddate[0] < this.currentDateTime ){
            console.log('i m experied');
            this.isExperied = true;
            this.notExperied = true;

           }
              if (this.acceptedstatus === 'Accepted'){
                this.newvalue = element.participationAmount+this.newvalue;

                console.log(this.newvalue);
                if(this.newvalue == ((this.trnAmount-this.rentAmount) || (this.partReceived) )){
                  console.log('i m fulfill')
                }else if(this.newvalue < (this.trnAmount-this.rentAmount)){
                  console.log('i m not fullfill')
                }
              }
                 
           this.participaion=(this.partReceived/this.trnAmount)*100
           if(element.secTransactionType=='Unfunded')
           this.charges='Participation Commission'
           else
           this.charges='Discounting Interest p.a.(spread over benchmark)'
          })
          if (this.acceptedstatus === 'Accepted'){
          if(this.newvalue == ((this.trnAmount-this.rentAmount) || (this.partReceived) )){
            console.log('i m fulfill outside')
          }else if(this.newvalue < (this.trnAmount-this.rentAmount)){
            console.log('i m not fullfill oustside')
          }
        }
        if(JSON.parse(JSON.stringify(response)).status=="Failure"){
         if(0> this.creditCounts || this.nimaiCount.status.toLowerCase()=='inactive'){
          this.trnxMsg=JSON.parse(JSON.stringify(response)).errMessage;
          $('#pop-up').show();
          return
        } 
        }else{
          this.changeText=true

          $('#changetext').html('Bank Quotes');
          $('#transactionID').slideUp();
          $('#TransactionDetailDiv').slideDown();
          $('#transactionFilter').hide();
          $('#backbtn').fadeIn();
          this.noQRdetail = false;

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
  }

  // new function for cal part
  getvalue(vale, newvalue){
   
    this.applicablevalue = (((newvalue.participationAmount)*(newvalue.applicableBenchmark/100)*(vale.usanceDays))/(360)).toFixed(2)

this.riskmargin = (((newvalue.participationAmount)*(newvalue.discountingCharges/100)*(vale.usanceDays))/(360)).toFixed(2)

this.participationcomm = (((newvalue.participationAmount)*(newvalue.participationCommission/100)*(vale.usanceDays))/(360)).toFixed(2)
 console.log(this.participationcomm);
// participationCommission
  }
  closed_QA(){
     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/active-secondary-transaction`]);
  });
  }
  openOffcanvas(act) {
    if(act=='quote'){
      document.getElementById("menu-barnew").style.width = "500px";
    }else if(act =='accepted'){
      document.getElementById("menu-barnewold").style.width = "500px";
    }
    }
   
 openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";  
 }
 closeOffcanvas() {
  // document.getElementById("menubarConfirmQuote").style.width="0%";
    document.getElementById("menu-barnew").style.width = "0%"; 
    document.getElementById("menu-barnewold").style.width = "0%";
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
   console.log(this.getSpecificDetail);
    let param = {
      "userId": sessionStorage.getItem('userID'),
      "transactionId": detail.transactionId,
      "quotationId":detail.quotationId
    }
    this.nts.getConfChargesForQuoteAmount(param).subscribe((response)=>{
  
      var str = JSON.parse(JSON.stringify(response)).status; 
      console.log(str);
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
  
 }

//  showAcceptedDetails(index,qId, tId, quotationDetails){
  showAcceptedDetails(qId, tId, quotationDetails){
    $('#closePopup').show(); // new
    let req = {
      "quotationId": qId,
      "transactionId": tId,
      "userId":sessionStorage.getItem("userID"),
      "acceptanceReason":$("#closeReason").val() // new
    }
    this.acceptedDetails = quotationDetails;
    console.log(this.acceptedDetails);
    console.log(req);
 }

 onSubmit() {
  $("#selectReason").val(null);
}
// new function
closedTransaction(qId, tId, quotationDetails,acceptanceReason){

  console.log(acceptanceReason);
  console.log(acceptanceReason.title);
  let req = {
  "quotationId": qId,
  "transactionId": tId,
  "userId":sessionStorage.getItem("userID"),
  "acceptanceReason": acceptanceReason // new
}
console.log(req);
// index = index + 1;

    this.acceptedDetails = quotationDetails;
    console.log(this.acceptedDetails);
    this.nts.acceptBankQuote(req).subscribe(
      (response) => {          
        var acceptQuoteResp = JSON.parse(JSON.stringify(response));
        this.acceptedQuoteMessage=acceptQuoteResp.status
        if(acceptQuoteResp.status.toLowerCase() == "failure"){
          //new
          document.getElementById("menu-barnewold").style.width = "0%";
          document.getElementById("myCanvasNav").style.width = "100%";
          document.getElementById("myCanvasNav").style.opacity = "0";  
          // end
          $('.acceptedErrorDetails').show();
          $('#closePopup').hide();
          this.acceptedErrorDetail = acceptQuoteResp.errMessage;
        }
        else{
          $('#closePopup').hide();
          $('.acceptedPopupDetails').show();
          document.getElementById("menu-barnewold").style.width = "0%";
          document.getElementById("myCanvasNav").style.width = "100%";
          document.getElementById("myCanvasNav").style.opacity = "0";  
         
          $('#menu-barnewold').hide();
          $('#TransactionDetailDiv tr:eq(' +  +') td:eq(2)').html(this.acceptedDetails.bankName + ' - ' + this.acceptedDetails.branchName + ', '+ this.acceptedDetails.countryName);
          $('#TransactionDetailDiv tr:eq(' +  +') td:eq(6)').html("Accepted");
        }
      },
      (err) => {
        console.log("Failure");
      }
      
    )
    $('#closePopup').hide();
}


 redirectAsAccepted(transactionId){
  console.log(transactionId);

   $('#myModal4').hide();
 
  //  this.showQuoteDetail();
  //  console.log(this.showQuoteDetail);
{
  let data = {
    "userId": sessionStorage.getItem("userID"),
    "transactionId": transactionId
  }
  
  
  let data1 = {
    "transactionId": transactionId,
  }
  this.nts.getSpecificTxnDetailByTxnId(data).subscribe(
    (response) => {
      this.detailInfo = JSON.parse(JSON.stringify(response)).data;
      this.ObligorBank=  this.detailInfo.lCIssuanceBank;
      this.rentAmount = this.detailInfo.retentionAmt;
      console.log(this.ObligorBank);
      console.log(this.rentAmount);
     });

  this.nts.getAllQuotationDetails(data).subscribe(
    (response) => {
    
      if(JSON.parse(JSON.stringify(response)).status=="Failure"){
        if(0> this.creditCounts || this.nimaiCount.status.toLowerCase()=='inactive'){
         this.trnxMsg=JSON.parse(JSON.stringify(response)).errMessage;
         $('#pop-up').show();
         return
       } 
      }
      this.QRdetail = JSON.parse(JSON.stringify(response)).data;
console.log(this.QRdetail);


        this.QRdetail.forEach(element => {
        //  this.trnAmount= element.lcValue+this.trnAmount
        this.trnAmount= element.lcValue
        
        this.TxnId = element.transactionId
         this.partReceivedredirect=element.participationAmount+this.partReceivedredirect
         console.log(this.partReceivedredirect);
         this.acceptedstatus = element.quotationStatus;
         console.log(this.acceptedstatus);
            if (this.acceptedstatus === 'Accepted'){
              this.newvalue = element.participationAmount+this.newvalue;

              console.log(this.newvalue);
              if(this.newvalue == ((this.trnAmount-this.rentAmount) || (this.partReceivedredirect) )){
                console.log('i m fulfill outside')
                this.refreshPage();
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/secondary-transaction-details"])
                });
              }else if(this.newvalue < (this.trnAmount-this.rentAmount)){
                console.log('i m not fullfill oustside')
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                  this.router.navigate([`/${this.subURL}/${this.parentURL}/active-secondary-transaction`])
                });
              }
            }
            
         this.participaion=(this.partReceivedredirect/this.trnAmount)*100
         if(element.secTransactionType=='Unfunded')
         this.charges='Participation Commission'
         else
         this.charges='Discounting Interest p.a.(spread over benchmark)'
        })

        // if (this.acceptedstatus === 'Accepted'){
        //   if(this.newvalue == ((this.trnAmount-this.rentAmount) || (this.partReceivedredirect) )){
        //     console.log('i m fulfill outside')
        //     this.refreshPage();
        //     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        //   this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/secondary-transaction-details"])
        //     });
        //   }else if(this.newvalue < (this.trnAmount-this.rentAmount)){
        //     console.log('i m not fullfill oustside')
        //     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        //       this.router.navigate([`/${this.subURL}/${this.parentURL}/active-secondary-transaction`])
        //     });
        //   }
        // }

      if(JSON.parse(JSON.stringify(response)).status=="Failure"){
       if(0> this.creditCounts || this.nimaiCount.status.toLowerCase()=='inactive'){
        this.trnxMsg=JSON.parse(JSON.stringify(response)).errMessage;
        $('#pop-up').show();
        return
      } 
      }else{
        this.changeText=true

        $('#changetext').html('Bank Quotes');
        $('#transactionID').slideUp();
        $('#TransactionDetailDiv').slideDown();
        $('#transactionFilter').hide();
        $('#backbtn').fadeIn();
        this.noQRdetail = false;

// this.QRdetail  = this.sortPipe.transform(this.QRdetail, "desc", "name");
      // this.quotationReqType =requirementType;
      // this.lCCurrencyReq=lCCurrency;
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
}
//// ened

//    let data = {
//     "userId": sessionStorage.getItem("userID"),
//     "transactionId": transactionId
//   }
//   console.log(data);

//   this.nts.getSpecificTxnDetailByTxnId(data).subscribe(
//     (response) => {
//       this.detailInfonew = JSON.parse(JSON.stringify(response)).data;
//       this.ObligorBank=  this.detailInfonew.lCIssuanceBank;
//       this.rentAmount = this.detailInfonew.retentionAmt;
//       console.log(this.ObligorBank);
//       console.log(this.rentAmount);
//      });

//   this.nts.getAllQuotationDetails(data).subscribe(
//     (response) => {
    
//       if(JSON.parse(JSON.stringify(response)).status=="Failure"){
//         if(0> this.creditCounts || this.nimaiCount.status.toLowerCase()=='inactive'){
//          this.trnxMsg=JSON.parse(JSON.stringify(response)).errMessage;
//          $('#pop-up').show();
//          return
//        } 
//       }
//       this.QRdetailnew = JSON.parse(JSON.stringify(response)).data;
// console.log(this.QRdetailnew);


//         this.QRdetailnew.forEach(element => {
//         //  this.trnAmount= element.lcValue+this.trnAmount
//         this.trnAmount= element.lcValue
        
//         this.TxnId = element.transactionId
//         //  this.partReceived=element.participationAmount+this.partReceived
//          console.log(this.partReceived);
//          this.acceptedstatus = element.quotationStatus;
//          console.log(this.acceptedstatus);
//             if (this.acceptedstatus === 'Accepted'){
//               this.newvalue = element.participationAmount+this.newvalue;
//               // this.partReceived=element.participationAmount+this.partReceived
//               console.log(this.newvalue);
//               console.log(this.partReceived);
//             }
            
//          this.participaion=(this.partReceived/this.trnAmount)*100
//          if(element.secTransactionType=='Unfunded')
//          this.charges='Participation Commission'
//          else
//          this.charges='Discounting Interest p.a.(spread over benchmark)'
//         })
//         if(this.acceptedstatus === 'Accepted' ){
//         if(this.newvalue = (this.trnAmount-this.rentAmount || (this.partReceived)) )
//         {
//           console.log('i m here')
//           this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
//             this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/secondary-transaction-details"]);
//         });
//         }else

//         if (this.newvalue = this.partReceived)
       
//         {
//           this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
//                           this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/secondary-transaction-details"]);
//                       });
//           console.log(' im ok')
//           // return;
//         }
//          else
//         if(this.newvalue < (this.trnAmount-this.rentAmount))
//         {
//            console.log('this new is equal to part recv amt');
//            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
//                           this.router.navigate([`/${this.subURL}/${this.parentURL}/active-secondary-transaction`]);
//                       });

//         }
//       }
//       // window.location.reload();
//       if(JSON.parse(JSON.stringify(response)).status=="Failure"){
//        if(0> this.creditCounts || this.nimaiCount.status.toLowerCase()=='inactive'){
//         this.trnxMsg=JSON.parse(JSON.stringify(response)).errMessage;
//         $('#pop-up').show();
//         return
//       } 
//       }else{
//         this.changeText=true

//         $('#changetext').html('Bank Quotes');
//         $('#transactionID').slideUp();
//         $('#TransactionDetailDiv').slideDown();
//         $('#transactionFilter').hide();
//         $('#backbtn').fadeIn();
//         this.noQRdetail = false;

// // this.QRdetail  = this.sortPipe.transform(this.QRdetail, "desc", "name");
//       // this.quotationReqType =requirementType;
//       // this.lCCurrencyReq=lCCurrency;
//         this.QRdetail = this.QRdetail.map(item => ({
//         ...item,
//         isSelected: false
//       }));
//       if(!this.QRdetail){
//         this.noQRdetail = true;
//       }
//     }
//     },(error) =>{
//     }
//   )

  // this.nts.getSpecificTxnDetailByTxnId(data).subscribe(
  //   (response) => {
  //     this.detailInfonew = JSON.parse(JSON.stringify(response)).data;
     
  //     this.rentAmount = this.detailInfonew.retentionAmt;
  //     console.log(this.rentAmount);
  //    });

  //    this.nts.getAllQuotationDetails(data).subscribe(
  //     (response) => {
      
  //       if(JSON.parse(JSON.stringify(response)).status=="Failure"){
  //         if(0> this.creditCounts || this.nimaiCount.status.toLowerCase()=='inactive'){
  //          this.trnxMsg=JSON.parse(JSON.stringify(response)).errMessage;
  //          $('#pop-up').show();
  //          return
  //        } 
  //       }
  //       this.QRdetail = JSON.parse(JSON.stringify(response)).data;
  // console.log(this.QRdetail);

  
  //         this.QRdetail.forEach(element => {
  //           this.partReceived=element.participationAmount+this.partReceived
  //           console.log(this.partReceived);
  //         this.trnAmount= element.lcValue
  //        this.newAmount =this.trnAmount-this.rentAmount;
  //        console.log(this.newAmount);
  //          this.acceptedstatus = element.quotationStatus;
  //          console.log(this.acceptedstatus);
  //             if (this.acceptedstatus === 'Accepted'){
  //               this.newvalue = element.participationAmount+this.newvalue;
                
  //               console.log(this.newvalue);
  //             }
  //          if(element.secTransactionType=='Unfunded')
  //          this.charges='Participation Commission'
  //          else
  //          this.charges='Discounting Interest p.a.(spread over benchmark)'
  //         });
         
  //         if(this.acceptedstatus === 'Accepted' ){
  //           if(Number(this.newvalue) == (Number(this.newAmount) || Number(this.partReceived)) )
  //           {
  //             console.log('i m here')
  //             this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //               this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/secondary-transaction-details"]);
  //           });
  //           // return;
  //           }else 
  //           if (this.newvalue == this.partReceived) 
  //           {
  //             console.log(' im ok')
  //             this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //               this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/secondary-transaction-details"]);
  //           });
  //             // return;
  //           }
  //            else
  //           if(Number(this.newvalue) < Number(this.newAmount))
  //           {
  //              console.log('this new is equal to part recv amt');
  //              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //               this.router.navigate([`/${this.subURL}/${this.parentURL}/active-secondary-transaction`]);
  //           });
  //           }
  //         }
  //         if (this.acceptedstatus === 'Placed'){
  //           this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //             this.router.navigate([`/${this.subURL}/${this.parentURL}/active-secondary-transaction`]);
  //         });
  //         console.log(' im theri on places')
  //         }
         
  //         // return;
  //     },(error) =>{
  //     }
  //   ) 

// this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/secondary-transaction-details"]);
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
    this.router.navigate([`/${this.subURL}/${this.parentURL}/active-secondary-transaction`]);
});
// this.ngOnInit();
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
onClosePopDismiss(){
  $("#closePopup").hide();
  // this.closeOffcanvas();
  // $('#closedTrans'+this.forCloseTransactionId).val("Open").change();
}
}