import { Compiler, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { LoginService } from 'src/app/services/login/login.service';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { loads } from '../../../assets/js/commons';
import * as $ from 'src/assets/js/jquery.min';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import { AvalisationComponent } from '../bankTransaction/newTransaction/quotes/avalisation/avalisation.component';
import { BankGuaranteeComponent } from '../bankTransaction/newTransaction/quotes/bank-guarantee/bank-guarantee.component';
import { BankerComponent } from '../bankTransaction/newTransaction/quotes/banker/banker.component';
import { ConfirmAndDiscountComponent } from '../bankTransaction/newTransaction/quotes/confirm-and-discount/confirm-and-discount.component';
import { ConfirmationComponent } from '../bankTransaction/newTransaction/quotes/confirmation/confirmation.component';
import { DiscountingComponent } from '../bankTransaction/newTransaction/quotes/discounting/discounting.component';
import { RefinancingComponent } from '../bankTransaction/newTransaction/quotes/refinancing/refinancing.component';
import * as FileSaver from 'file-saver';
import { Tflag } from 'src/app/beans/Tflag';
import { editViewQuotation, newTransactionBean, PlaceQuote } from 'src/app/beans/BankNewTransaction';
import {removeDoubleScroll} from 'src/assets/js/commons'
import { formatDate } from '@angular/common';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { Subscription } from 'rxjs';
import { UserIdService } from 'src/app/services/UserId/user-id.service';
import { element } from 'protractor';
import { LoaderServiceService } from 'src/app/services/LoaderService/loader-service.service';
@Component({
  selector: 'app-offline-new-transcation',
  templateUrl: './offline-new-transcation.component.html',
  styleUrls: ['./offline-new-transcation.component.css']
})
export class OfflineNewTranscationComponent implements OnInit {
  public flag: boolean = false;
  public key: string;
  public parent: string;
  public userID: string = "";
  submitted: boolean = false;
  isTextFieldType: boolean;
  isreTextFieldType: boolean;
  tradeName: string;
 
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  public date: string = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');
  public ntData: any[] = [];
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public hasNoRecordQuote:boolean=false;
  public detail: any;
  public detailnew: any;
  public details: any;
  public data1: PlaceQuote;
  public dataViewEdit: editViewQuotation;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  public specificDetail: any = "";
  quotationdata: any;
  isDetailActive: boolean=false;
  document: any;
  public parentURL: string = "";
  public subURL: string = "";
  public isFreeze: boolean=false;
  isUploadNoDoc: boolean =false;
  selectedSub: string="";
  subsidiaries: any="";
  currentDetails: any;
  disablesubsi: boolean;
  nimaiCount: any;
  getcountUser: any="";
  imgDownload: boolean;
  fileData: any;
  notImgDownload: boolean;
  user_ID: any;
  isDownloadORview: string;
  isExpire: boolean=false;
  bankDetails:any =[];
  bankName:any;
  commentList: { name: string; }[];
  // public data: newTransactionBean;
  public data: PlaceQuote;
  trnxMsg: string="";
  tradeSupport: string;
  creditCounts: number;
  isActive: boolean;
  isActivenew: boolean;
  isActiverefiance: boolean;
  public detailInfo: string = "";
  public detailInfo7: string = "";
  viewData:any;
  viewDatanew:any
  public newold: any;
  chkPlaceQuote: any="";
  refinance: boolean;
  // public dataViewEdit: editViewQuotation;
  public title: string = "";
  public tab = 'tab1';
  // public isActive: boolean = false;
  public isActiveQuote: boolean = false;
  totalQuote: any;
  public errmessage: string = "";
  ID:any;
  datanew:any;
  subscription: Subscription;
  public username: string = "";
  chargesEdit1: boolean = false;
  chargesEdit2: boolean = false;
  public selectNego: string = "";
  public selectMature: string = "";
  public confNegot:boolean=false;
  public confMature:boolean=false;
  public radioid: boolean = true;
  charges1: boolean = false;
  charges2: boolean = false;
  refiance: boolean;
  bankerget: boolean;
  confirmpage: boolean;
  dicount: boolean;
  confirmdiscount: boolean
  confandDiscount: boolean;
  discount: boolean;
  bankgau: boolean;
  isbillavailastion: boolean;
  bankaccepted: boolean;
  cofirm: boolean;
  cofirmation: boolean;
  isActiveQuoteok: boolean;
  isActivediscounting: boolean
  isActiveBankGT:boolean;
  cofirmationok: boolean;
  userType:any;
  isReferrer: boolean;
  isCustomer: boolean;
  isBank: boolean;
  hideSubAccount: boolean;
  hideManageUser: boolean;
  hideRefer: boolean;
  hideCreditTransaction: boolean;
  userStat: any;
  enableuserStat: boolean;
  CurrentDate: string;
  onemonthdate:any;
  updateddata:any =[];
  newdetails:any =[];
  constructor(public router: ActivatedRoute, public route: Router, public lgsc: LoginService, public rsc: ForgetPasswordService, public fb: FormBuilder,public ts: NewTransactionService,
    private newloader: LoaderServiceService,public newId:  UserIdService,public upls: UploadLcService,public getCount: SubscriptionDetailsService, public report:ReportsService ,private comp:Compiler, public psd: PersonalDetailsService,public titleService: TitleService, public nts: NewTransactionService) {

      this.router.parent.url.subscribe((urlPath) => {
        this.parentURL = urlPath[urlPath.length - 1].path;
        console.log(this.parentURL);
      });
      this.router.parent.parent.url.subscribe((urlPath) => {
        this.subURL = urlPath[urlPath.length - 1].path;
        console.log(this.subURL);
      });
  

      this.CurrentDate=  formatDate(new Date(), 'yyyy-MM-dd', 'en');
  this.username = sessionStorage.getItem('username');
 console.log(this.CurrentDate);
 var d = new Date();
console.log(d.toLocaleDateString());
var newdate =d.setMonth(d.getMonth() - 1);
console.log(newdate, ' new date');
console.log(d.toLocaleDateString());
this.onemonthdate = formatDate(d.toLocaleDateString(),'yyyy-MM-dd', 'en');

 console.log(this.onemonthdate);

   let userId = sessionStorage.getItem('userID')
   console.log(userId);
  if (userId.startsWith('RE')) {
  this.isReferrer = true;
} else if (userId.startsWith('CU')) {
  this.isReferrer = false;
  this.isCustomer = true;
  this.isBank = false;
  
}   else if (userId.startsWith('BC')) {
  this.isReferrer = false;
  this.isCustomer = true;
  this.isBank = false;
 

}else {
  this.isReferrer = false;
  this.isCustomer = false;
  this.isBank = true;
}

if (userId.startsWith('RE')) {
  this.userType = "Referrer";
  this.hideSubAccount=true;

  this.usersStat('RE');
} else if (userId.startsWith('BC')) {
  this.userType = "Bank as a Customer";
  this.hideManageUser=true;
  this.hideRefer=false;
  this.hideCreditTransaction=true;
  this.usersStat('BC');
} else if (userId.startsWith('CU')) {
  this.userType = "Customer";
  this.usersStat('CU');
}  else if (userId.startsWith('BA')) {
  this.userType = "Bank as an Underwriter";

  this.usersStat('BA');
}  else {
  this.userType = "";
}


    
 
    this.titleService.quote.next(false);
    if(sessionStorage.getItem('accountType')=='MASTER')
    // this.getSubsidiaryData();
    this.commentList = [{'name': 'Currently Lines for this bank are full' },  { 'name': 'Currently lines for this country are full' }, 
    { 'name': 'No lines for this bank but have for other banks' },
   { 'name': 'No lines for this country' },  { 'name': 'Applicant profile is not satisfactory/comfortable' },  
   { 'name': 'Bank profile is not satisfactory' },  { 'name': 'Goods are from not compliant category' },
   { 'name': 'Goods are not of our preferred category' },
   { 'name': 'Others & free text field' }];

 

  

  this.data = {
    transactionId: "",
    userId: "",
    bankUserId: "",
    quotationId: "",
    confirmationCharges: 0,
    confChgsIssuanceToNegot: "",
    confChgsIssuanceToexp: "",
    confChgsIssuanceToMatur: "",
    discountingCharges: 0,
    refinancingCharges: "",
    bankAcceptCharges: "",
    applicableBenchmark: 0,
    commentsBenchmark: "",
    negotiationChargesFixed: 0,
    negotiationChargesPerct: 0,
    docHandlingCharges: 0,
    otherCharges: 0,
    minTransactionCharges: 0,
    insertedBy: "",
    modifiedBy: "",
    insertedDate: null,
    modifiedDate: null,
    validityDate: null,
    TotalQuote: 0,
    expiryDays: 0,
    maturityDays: 0,
    negotiationDays: 0,
    sumOfQuote: 0,
    confChgsMatur: 0,
    confChgsNegot: 0,
    OtherChargesComments: "",
    termConditionComments: "",
    //added by sanjeev
    requirementType: '',
    secTransactionType:'',
    lCIssuanceBank: '',
    lCIssuanceBranch: '',
    swiftCode: '',
    lCIssuanceCountry: '',
    lCIssuingDate: '',
    lCExpiryDate: '',
    lCValue: '',
    lCCurrency: '',
    lastShipmentDate: '',
    negotiationDate: '',
    paymentPeriod: '',
    paymentTerms: '',
    tenorEndDate: '',
    applicantName: '',
    applicantCountry: '',
    beneName: '',
    beneBankCountry: '',
    beneBankName: '',
    beneSwiftCode: '',
    beneCountry: '',
    loadingCountry: '',
    loadingPort: '',
    dischargeCountry: '',
    dischargePort: '',
    chargesType: '',
    validity: '',
    transactionflag: '',
    transactionStatus: '',
    confirmedFlag: '',
    goodsType: '',
    quotationReceived: '',
    discountingPeriod: '',
    confirmationPeriod: '',
    refinancingPeriod: '',
    quotationStatus:'',
    confChgsIssuanceToClaimExp:'',
    participationAmount:0,
    retentionAmt:'',
    offeredPrice:'',
    benchmark:0,
    billType:''

  }
  }
 
  usersStat(users) {
    this.getCount.getUserStats()
    .subscribe(
      (response) => {
        this.userStat = JSON.parse(JSON.stringify(response)).data;
        var str = this.userStat; 
        var splittedStr = str.split(", ", 2); 
        if(users=='BA'){
         var colonSplit = splittedStr[1]
          var arrsplit = colonSplit.split(": ", 2); 
          this.userStat=arrsplit[1]+" banks placed quote on "+this.tradeName+" in last 24 hours";
        }else if(users=='CU' || users=='BC'){
        var colonSplit = splittedStr[0]
        var arrsplit = colonSplit.split(": ", 2); 
        this.userStat=arrsplit[1]+" customers placed transaction on "+this.tradeName+" in last 24 hours";
        }else if(users=='RE'){
           this.enableuserStat=true;
        }
  
      })
  }
openDocument(file){
  $('#myModal99').show();
  this.document = file;
}
public getAllnewTransactions(BA30490) {
  // this.user_ID=userid;
  this.user_ID = sessionStorage.getItem('userID')
  // this.getNimaiCount();
  this.titleService.quote.next(true);


  const data = {
    "bankUserId":sessionStorage.getItem('userID'),
    // "bankUserId":'BA30490',
    "quotationStatus": "Placed"
  }

  // this.nts.getTransQuotationDtlByBankUserIdAndStatus(data).subscribe(
  //   (response) => {

  //     custTrnsactionDetail();
  //     this.detail=[];
  //     this.detail = JSON.parse(JSON.stringify(response)).data;  
  //     console.log(this.detail);
  //     let array = this.detail;
  //     if(array!=null){
  //     for (var value of array) {
  //       console.log(value.expiredOn)
  //       if(value.quotationStatus==="FreezePlaced" || value.quotationStatus==="FreezeRePlaced")
  //         this.isFreeze=true;
  //         if(value.expiredOn != "1970-01-01T00:00:00.000+0000"){  
  //             if(value.expiredOn < value.validity )
  //             this.isExpire=true;
  //         }else{
  //           this.isExpire=false;
  //         }
  //     }  
       

  //   }

  //   if(this.getcountUser=='MASTER'){
     
  //     this.disablesubsi=true
  //   }else{
  //     this.disablesubsi=false
      
  //   }
  //   }, (error) => {
  //     this.hasNoRecord = true;
  //   }
  // )

}
 ngOnInit() {
  this.newloader.hide();
    loads();
    $('.slide-reveal-overlay').hide();
    this.getAllnewTransactions('BA30490');
     
    // this. getNimaiCount();
    // this.subscription = this.newId.currentvalue.subscribe(key => this.key = key);
    
    // console.log(this.subscription);
  }


  togglePasswordFieldType(){
    this.isTextFieldType = !this.isTextFieldType;
  }
  togglerePasswordFieldType(){
    this.isreTextFieldType = !this.isreTextFieldType;
  }
  returntologin(){
    this.route.navigate(['/login']);
  }
 
  inactiveOk(){
  
     
    this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          // this.route.navigate([`/${this.subURL+"/"+this.parentURL }/dashboard-details`]);
           
      });
    
  }
  
  
  refreshPage(){
    this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.route.navigate([`/${this.subURL}/${this.parentURL}/newrequest`]);
      // this.route.navigate(['/offlinenewrequest']);
  });
  }

  public getNewRequestsForBank(value) {
    // this.getNimaiCount();

    this.titleService.quote.next(true);


  const  data = {
    "userId": sessionStorage.getItem('userID'),
    "requirementType":value
  }

    this.nts.getAllNewBankRequest(data).subscribe(
      (response) => {   
        custTrnsactionDetail();
        this.detail=[];
        this.detail = JSON.parse(JSON.stringify(response)).data;
      // console.log(this.detail);

      //new code
   
      // this.detail.forEach( element => {
    
      //   var ne = formatDate(element.insertedDate,'yyyy-MM-dd', 'en');
    
      //   if( ne >= this.onemonthdate ){
         
      //     this.updateddata = element;
      //     console.log(this.updateddata);
      //    this.newdetails.push(this.updateddata);
      //    console.log(this.newdetails, 'old ');
        
      //   }
      // })
    
   
    console.log(this.detail, ' im details');
      
      }, (error) => {
       
      }
    )
  }

  convertbase64toArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  showProForma(file) {
    $('#myModalAttach').show();
    var str = file; 
    var splittedStr = str.split(" |", 2); 
    var filename=str.split(" |", 1); 
    var filename=splittedStr[0].toLowerCase();
    var ext = filename.split("."); 
    //  if(ext[1]=='jpeg' || ext[1]=='jpg' || ext[1]=='png' || ext[1]=='svg'){
    //   this.imgDownload=true;
    //  }else{
    //   this.imgDownload=false;
    //  }
    if(ext[ext.length-1]=='jpeg' || ext[ext.length-1]=='jpg' || ext[ext.length-1]=='png' || ext[ext.length-1]=='svg'){
      this.imgDownload=true;
      this.isDownloadORview="Download"
     }else{
      this.imgDownload=false;
      if( ext[ext.length-1]=='pdf'){
        this.isDownloadORview="View"
           }else{
              this.isDownloadORview="Download"
       }     
     }
    var data=splittedStr[1];
    this.document = data;
    this.fileData=file;
          }

  download(){
    var str = this.fileData; 
    var splittedStr = str.split(" |", 2); 
    var data=splittedStr[1];
    var  base64string = data;
    
    var filename=splittedStr[0].toLowerCase();
    var ext = filename.split("."); 
    var extension='.'+ext[ext.length-1];

    if(extension=='.xlsx'){
    var  base64string= base64string.replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      FileSaver.saveAs(blob, filename);
      this.notImgDownload=true;
      this.imgDownload=false;
    } 
    else if(extension=='.xls'){
      var  base64string= base64string.replace('data:application/vnd.ms-excel;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type:'application/vnd.ms-excel'});
        FileSaver.saveAs(blob, filename);
        this.imgDownload=false;
      } 
      else if(extension=='.doc'){
        base64string= base64string.replace('data:application/msword;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/msword' });
        FileSaver.saveAs(blob,filename);
        this.imgDownload=false;

    }
    else if(extension=='.pdf'){
      base64string= base64string.replace('data:application/pdf;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(blob);
          window.open(fileURL);
      this.notImgDownload=true;
      this.imgDownload=false;

    }  
     else if(extension=='.docx'){
        base64string= base64string.replace('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        FileSaver.saveAs(blob,filename);
        this.notImgDownload=true;
        this.imgDownload=false;

    }
     else if(extension=='.csv'){
            base64string= base64string.replace('data:application/vnd.ms-excel;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'application/vnd.ms-excel' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=false;
            this.notImgDownload=true;

          }
          else if(extension=='.jpeg' || extension=='.jpg' || extension=='.png' || extension=='.svg'){
            base64string= base64string.replace('data:image/jpeg;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/jpeg' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=true;
            this.notImgDownload=false;

          }     
           
          else if(extension=='.tiff'){
            base64string= base64string.replace('data:image/tiff;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/tiff' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=true;

          }        
              }

  ngAfterViewInit() {
    this.getNewRequestsForBank("Issuance");

  }
  showDetail(data: any) {
    this.isActive = true;
    this.data = data;
    this.titleService.quote.next(true);
    removeDoubleScroll()
    const transactionId = {
      "transactionId": data.transactionId
    }

    this.nts.getSpecificTxnDetailByTxnId(transactionId).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response)).data;
        this.viewData=this.detailInfo;
        console.log(this.detailInfo);
        if(this.viewData.lcProForma==null || this.viewData.lcProForma=="" || this.viewData.lcProForma==undefined){
          this.noFileDisable=false;
          this.viewDisable=true;
    
         }else{
          this.viewDisable=false;
          this.noFileDisable=true;
         }
      }, (error) => {
        this.hasNoRecord = true;
      }
    )

  }

 
  
   openOffcanvas() {   
    document.getElementById("menubarDetail").style.width = "560px";
  
  }
  openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";  
    
  }

  openOffcanvasnew(val){
    console.log(val);
    if (val == 'BillAvalisation'){
      
      document.getElementById("menubarAvalisationQuote").style.width = "560px";
      this.isbillavailastion = true;
     
      this.title = 'Place Quote';
      console.log(this.dataViewEdit);
    }else if(val == 'Confirmation'){
      document.getElementById("menubarConfirmQuote").style.width = "560px";
      this.confirmpage = true;
      this.cofirm = true;
      this.cofirmationok = true;
      this.title = 'Place Quote'
     
     
      this.isActivenew = true;
     
      this.title = 'Place Quote';
    }else if(val == 'BankGuarantee'){
      // this.bankgau = true;
      this.isActiveBankGT = true;
      this.title = 'Place Quote';
      document.getElementById("menubarBankGuarantee").style.width = "560px";
      this.bankgau = true;
    }
    else if(val == 'Discounting'){
      this.dicount = true;
      this.title = 'Place Quote';
      this.isActivediscounting = true;
      document.getElementById("menubarDiscountQuote").style.width = "560px";
     
    }
    else if(val =='ConfirmAndDiscount'){
    
      document.getElementById("menubarConDisQuote").style.width = "560px"; 
      this.isActiveQuoteok = true;
      this.confirmdiscount = true;
      this.title = 'Place Quote';
      this.confandDiscount = true;
    }
    else if(val =='Banker' || val =='Banker’s Acceptance'){
      document.getElementById("menubarBankerQuote").style.width = "560px";
      this.bankerget = true;
     
      this.title = 'Place Quote';
    }
    else if(val =='Refinance'){
      this.refiance = true;
      document.getElementById("menubarRefinanceQuote").style.width = "560px";
      this.isActiverefiance = true;
      this.title = 'Place Quote';
    }
  }

closeOffcanvas() {
  // this.refinance = false;
  document.getElementById("menubarDetail").style.width = "0%"; 
  document.getElementById("menubarConfirmQuote").style.width = "0%"; 
  document.getElementById("menubarBankGuarantee").style.width= "0%";
  document.getElementById("menubarDiscountQuote").style.width = "0%"; 
  document.getElementById("menubarConDisQuote").style.width = "0%"; 
  document.getElementById("menubarRefinanceQuote").style.width = "0%"; 
  document.getElementById("menubarBankerQuote").style.width = "0%";  
  document.getElementById("menubarAvalisationQuote").style.width = "0%";
  document.getElementById("myCanvasNav").style.width = "0%";
  document.getElementById("myCanvasNav").style.opacity = "0"; 
} 

  
  close() {
    $('#myModalAttach').hide();
   

  }
  closeDup() {
    $('#myModalDup').hide();
    this.refreshPage()

  }
  showQuotePage(pagename: string, action: Tflag, val: any) {
    const transactionId = {
      "transactionId": val.transactionId
    }
    
    this.nts.getSpecificTxnDetailByTxnId(transactionId).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response)).data;
        console.log(this.detailInfo);
        this.viewDatanew=this.detailInfo;
        console.log(this.detailInfo);
       this.viewDatanew.chargesType = '';
       console.log(this.viewDatanew.chargesType);
        var newold = this.viewDatanew.billType;
        console.log(newold);
       
        
        const data1 = {
          "bankUserId": sessionStorage.getItem('userID'),
          "userId":  this.viewDatanew.userId,
          "transactionId": this.viewDatanew.transactionId,
          "requirementType": this.viewDatanew.requirementType,
          "lCIssuanceBank": this.viewDatanew.lCIssuanceBank,
          "lCValue": this.viewDatanew.lCValue,
          "lCCurrency": this.viewDatanew.lCCurrency,
          "usanceDays": this.viewDatanew.usanceDays,
          "insertedDate": this.date,
          "insertedBy": sessionStorage.getItem('userID'),
          "modifiedDate": this.viewDatanew.date,
          "modifiedBy": sessionStorage.getItem('userID'),
          "quotationId": this.viewDatanew.quotationId,
          "confirmationPeriod": this.viewDatanew.confirmationPeriod,
          "discountingPeriod": this.viewDatanew.discountingPeriod,
          "refinancingPeriod": this.viewDatanew.refinancingPeriod,
        
          "billType" : this.viewDatanew.billType,
    
        }
        this.titleService.quote.next(true);
        this.whoIsActive = pagename;
        removeDoubleScroll()
       
       console.log(this.viewDatanew);
        console.log(this.newold);
       let data = this.viewDatanew;
        this.data.chargesType = "";
        console.log(this.data.chargesType);
        console.log(data);
        const req = {
         
          "transactionId":this.viewDatanew.transactionId,
        "bankUserId":sessionStorage.getItem('userID')
        // "bankUserId":'BA30490'
        }
         
        
        this.nts.getcheckQuotationPlaced(req).subscribe(
          (response) => {
            this.chkPlaceQuote = JSON.parse(JSON.stringify(response)).status;
            console.log(this.chkPlaceQuote)
    if(this.chkPlaceQuote=='Success'){
      if (pagename == 'confirmation' || pagename === 'Confirmation') {
      
        this.data = this.viewDatanew;
        this.isActive = true;
        this.confirmpage = true;
        this.cofirmationok = true;
        this.title = 'Place Quote'
        this.cofirm = true;
        console.log(' im here');
     
    
     }
     else if (pagename == 'BankGuarantee' ) {
      this.isActiveBankGT = true;
    this.data = this.viewDatanew;
    
    
    }
     else if (pagename === 'discounting' || pagename === 'Discounting') {
    
       this.data = this.viewDatanew;
       this.isActivediscounting = true;
       this.dicount = true;
    
     } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
     this.confirmdiscount = true;
      this.data = this.viewDatanew;
      this.isActiveQuoteok = true;
     
     } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      
       this.refinance = true;
      //  this.isActive = true;
       this.data = this.viewDatanew;
       this.isActiverefiance = true;
       console.log(this.data);

     } else if (pagename === 'banker' || pagename === "Banker" || pagename === 'Banker’s Acceptance') {
      // document.getElementById("menubarBankerQuote").style.width = "560px"; 
      this.data = this.viewDatanew;
     
     }
     else if (pagename === 'BillAvalisation') {
      // document.getElementById("menubarAvalisationQuote").style.width = "560px";
      this.isbillavailastion = true;
      this.data = this.viewDatanew;
      this.isActivenew = true;
      this.title = 'Place Quote';
     
     
      
     }
    }else{
      $('#myModalDup').show();
    console.log(JSON.parse(JSON.stringify(response)).status)
    } 
           
    });

       }
    )
    console.log(action)
    console.log(val);
    
}

  selectViewBy(val){  
    
       this.getNewRequestsForBank(val);

}

saveComment(comment){
  console.log(comment)
  this.nts.saveComments("h").subscribe(
    (response) => {


    })
}




public closed() {
  $('input').attr('readonly', true);
  $('textarea').attr('readonly', true);
  this.isActive = false;
  this.titleService.quote.next(false);
}
public closedQuote() {
  this.isActiveQuote = false;
  this.titleService.quote.next(false);
}


closeValidate(){
  $("#validateSuccessRef").hide();
}

redirectToactive() {
  const navigationExtras: NavigationExtras = {
    state: {
      redirectedFrom: "confirmation",
      trnsactionID: "data.transactionId"
    }
  };
  this.route.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`], navigationExtras)
    .then(success => console.log('navigation success?', success))
    .catch(console.error);
}

closed_div(){
  this.isActive = false;
  this.refinance = false;
  this.confirmdiscount = false;
  this.confirmpage = false;
  this.cofirmationok = false;
  this.dicount= false;
  this.refiance = false;
  document.getElementById("menubarConfirmQuote").style.width = "0%"; 
  document.getElementById("menubarBankGuarantee").style.width= "0%";
  document.getElementById("menubarDiscountQuote").style.width = "0%"; 
  document.getElementById("menubarConDisQuote").style.width = "0%"; 
  document.getElementById("menubarRefinanceQuote").style.width = "0%"; 
  document.getElementById("menubarBankerQuote").style.width = "0%";  
  document.getElementById("menubarAvalisationQuote").style.width = "0%";
  document.getElementById("myCanvasNav").style.width = "0%";
  document.getElementById("myCanvasNav").style.opacity = "0"; 
 }

 onNegotChange(value) {
  console.log(value);
  this.selectMature = 'no';
  this.selectNego = 'yes';
  this.data.confChgsIssuanceToMatur='no';
  this.data.confChgsIssuanceToNegot='yes';
}

onMatureChange(value) {
  console.log(value);
  this.selectMature = 'yes';
  this.selectNego = 'no';
  this.data.confChgsIssuanceToMatur='yes';
  this.data.confChgsIssuanceToNegot='no';

}

 public transactionForQuotes(act: string, data: any, detail: any) {
    
  

  switch (act) {
    case 'edit': {
      this.tab = 'tab1'
      this.title = 'Edit';
      this.refiance = true;
      this.bankerget= true;
      this.confirmpage = true;
      this.dicount = true;
      
      this.confirmdiscount = true;
      this.confandDiscount = true;
      this.bankgau = true;
      this.isActivenew = true;
      this.isActiverefiance = true;
      this.isActiveQuoteok = true;
      this.isActivediscounting = true;
      this.isActiveBankGT = true;
      this.cofirmationok = true;
      this.discount = true;
      this.isbillavailastion = true;
      if (data.confChgsIssuanceToMatur === 'yes') {
        this.charges2 = true;
        this.charges1 = false;
        data.confChgsIssuanceToMatur = "yes";
        data.confChgsIssuanceToNegot = "no";
        this.selectMature = 'yes';
        this.selectNego = 'no';
      } else if (data.confChgsIssuanceToNegot === 'yes') {
        this.charges1 = true;
        this.charges2 = false;
        data.confChgsIssuanceToNegot = "yes";
        data.confChgsIssuanceToMatur = "no";
        this.selectMature = 'no';
        this.selectNego = 'yes';
      }
    }
      break;

    case 'confirm': {
      const param = {
        "quotationId": detail.quotationId,
        "transactionId": data.transactionId,
        "userId": data.userId
      }
      console.log(param);

      this.tab = 'tab3';
      //this.title = '';
      this.ts.confirmQuotation(param).subscribe(
        (response) => {

          let emailBodyUpdate = {
            "transactionid": data.transactionId,
            "userId": data.userId,
            "event": "QUOTE_ACCEPT"
          }
          let emailBankBody = {

            "event": "QUOTE_ACCEPT_ALERT_ToBanks",
            "quotationId": detail.quotationId,
            "transactionId": data.transactionId,
            "bankEmail": sessionStorage.getItem('custUserEmailId')
          }
        
        },
        error => {
          alert('error')
          this.closedQuote();
          this.tab = 'tab1';
        }
      )
    }
      break;
    case 'ok': {
      this.closedQuote();
      this.tab = 'tab1';
     
      this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.route.navigate([`/${this.subURL}/${this.parentURL}/activerequest`]);
    });
    }
      break;
    case 'preview': {

      this.tab = 'tab2';
      setTimeout(() => {
        $('input').attr('readonly', true);
      }, 200);
    }
      break;


    case 'calculateQuote': {        
      this.ts.saveQuotationToDraft(this.data,this.ID).subscribe(
        (response) => {
          this.detail = JSON.parse(JSON.stringify(response)).data;
          console.log(this.detail);
          this.data = data;
          this.data.TotalQuote = this.detail.TotalQuote;
        },
        error => {
          alert('error')
          this.closedQuote();
          this.tab = 'tab1';
        }
      )
    } break;
    case 'generateQuote': {    
      
      this.radioid = true;   
      this.tab = 'tab2';
     this.isActive = true;
      this.ID='new';
      this.data.confChgsIssuanceToNegot = this.selectNego;
      this.data.confChgsIssuanceToMatur = this.selectMature;
      console.log(this.data);
      if(data.confChgsIssuanceToNegot=='no'){
        this.confNegot=true;
        this.confMature=false;
      }if(data.confChgsIssuanceToMatur=='no'){
        this.confMature=true;
        this.confNegot=false;
      }
      this.data.bankUserId = sessionStorage.getItem('userID');
        this.ts.saveQuotationToDraft(this.data, this.ID).subscribe(
        (response) => {
          if (JSON.parse(JSON.stringify(response)).status === 'Failure') {
            this.errmessage = `Quotation has already Accepted by the Customer for the transaction : ${this.data.transactionId}`
            $("#labConfirm").text(this.errmessage);
            document.getElementById("myModalConfirm").style.display = "block";
          }
          else {
            this.detailnew = JSON.parse(JSON.stringify(response)).data;
            console.log(this.detailnew);
            this.data = data;
            this.data.TotalQuote = this.detailnew.TotalQuote;
            this.data.confChgsMatur = this.detailnew.confChgsMatur;
            this.data.confChgsNegot = this.detailnew.confChgsNegot;
            this.refiance = false;
            this.bankerget= false;
            this.confirmpage = false;
            this.dicount = false;
            this.confirmdiscount = false;
            this.confandDiscount = false;
            this.bankgau = false;
            this.isActivenew = true;
            this.isActiverefiance = true;
            this.isActiveQuoteok = true;
            this.isActivediscounting = true;
            this.isActiveBankGT = true;
            this.cofirmationok = true;
            this.discount = false;
            this.isbillavailastion = false;
          }
        },
        error => {
          alert('error')
          this.closedQuote();
          this.tab = 'tab1';
        }
      )
    }
  }

}

public action(flag: boolean, type: Tflag, data: any) {
  console.log(flag, type, data);
  this.CurrentDate=  formatDate(new Date(), 'yyyy-MM-dd', 'en');
//  this.tab='tab1';
//     if(data.termConditionComments=='null'){
//       data.termConditionComments='';
//     } if(data.chargesType=='null'){
//       data.chargesType='';
//     } if(data.commentsBenchmark=='null'){
//       data.commentsBenchmark='';
//     }    
//     if (flag) {
//       console.log('okkkk')
//       if (type === Tflag.VIEW) {
//         this.isActive = flag;
//         $('input').attr('readonly', true);
//         $('textarea').attr('readonly', true);
//         this.title = 'View';
//         this.dataViewEdit = data;
//         if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
//           this.chargesEdit2 = true;
//           this.chargesEdit1 = false;
//           this.dataViewEdit.confChgsIssuanceToMatur = "";
//           this.dataViewEdit.confChgsIssuanceToNegot = "";
//           this.selectMature = 'yes';
//           this.selectNego = 'no';
//         } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
//           this.chargesEdit1 = true;
//           this.chargesEdit2 = false;
//           this.dataViewEdit.confChgsIssuanceToNegot = "";
//           this.dataViewEdit.confChgsIssuanceToMatur = "";
//           this.selectMature = 'no';
//           this.selectNego = 'yes';
//         }

//       } else if (type === Tflag.EDIT) {
//         this.isActive = flag;
//         this.title = 'Edit';
//         this.dataViewEdit = data;

//       } else if (type === Tflag.PLACE_QUOTE) {
//         this.isActiveQuote = flag;
//         this.title = 'Place Quote';
//         this.data = data;
//         if (data.confChgsIssuanceToMatur === 'yes') {
//           this.charges2 = true;
//           this.charges1 = false;
//           data.confChgsIssuanceToMatur = "yes";
//           data.confChgsIssuanceToNegot = "no";
//           this.selectMature = 'yes';
//           this.selectNego = 'no';
//         } else if (data.confChgsIssuanceToNegot === 'yes') {
//           this.charges1 = true;
//           this.charges2 = false;
//           data.confChgsIssuanceToNegot = "yes";
//           data.confChgsIssuanceToMatur = "no";
//           this.selectMature = 'no';
//           this.selectNego = 'yes';
//         }else{
//           this.charges1=false;
//        this.charges2=false;
//        data.confChgsIssuanceToNegot = "";
//        data.confChgsIssuanceToMatur = "";
     


//         }
//       }
//     } else {
//       this.isActive = flag;
//       this.isActiveQuote = flag
//       this.data = data;
//       this.title = '';
//       $('input').attr('readonly', true);

//     }
  }

}


