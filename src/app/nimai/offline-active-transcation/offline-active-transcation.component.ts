import { Component, OnInit, ViewChild } from '@angular/core';
import { loads } from '../../../assets/js/commons';
import * as $ from 'src/assets/js/jquery.min';
import { ConfirmationComponent } from '../transaction/transactionTypes/confirmation/confirmation.component';
import { ConfirmAndDiscountComponent } from '../transaction/transactionTypes/confirm-and-discount/confirm-and-discount.component';
import { DiscountingComponent } from '../transaction/transactionTypes/discounting/discounting.component';
import { RefinancingComponent } from '../transaction/transactionTypes/refinancing/refinancing.component';
import { BankGuaranteeComponent } from '../transaction/transactionTypes/bank-guarantee/bank-guarantee.component';
import { BankerComponent } from '../transaction/transactionTypes/banker/banker.component';
import { AvalisationComponent } from '../transaction/transactionTypes/avalisation/avalisation.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { LoginService } from 'src/app/services/login/login.service';
import { ReportsService } from 'src/app/services/reports.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import { Tflag } from 'src/app/beans/Tflag';
import * as FileSaver from 'file-saver';
import { formatDate } from '@angular/common';
import {removeDoubleScroll} from 'src/assets/js/commons';
import { editViewQuotation, PlaceQuote } from 'src/app/beans/BankNewTransaction';

@Component({
  selector: 'app-offline-active-transcation',
  templateUrl: './offline-active-transcation.component.html',
  styleUrls: ['./offline-active-transcation.component.css']
})
export class OfflineActiveTranscationComponent implements OnInit {
  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  @ViewChild(BankGuaranteeComponent, { static: false }) bankGuarantee: BankGuaranteeComponent;
  @ViewChild(AvalisationComponent, { static: false }) avalisation: AvalisationComponent;
  public flag: boolean = false;
  public date: string = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');
  public key: string;
  public parent: string;
  public ntData: any[] = [];
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public detail: any;
  public detailnew: any;
  QRdetail: any = "";
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
  public isFreeze: boolean=false;
  isUploadNoDoc: boolean =false;
  user_ID: any;
  isExpire: boolean=false;
  imgDownload: boolean;
  isDownloadORview: string;
  document: any;
  fileData: any;
  notImgDownload: boolean;
  isDetailActive: boolean=false;
  hasNoRecordQuote: boolean;
  quotationdata: any;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  public dataViewEdit: editViewQuotation;
  public specificDetail: any = "";
  viewDatanew:any
  public data: PlaceQuote;
  newold: any;
  isbillavailastion: boolean=false;
  public isActive: boolean = false;
  public isActiveQuote: boolean = false;
  // public tab = 'tab1';
  CurrentDate: string;
  public tab = 'tab1';
  success: any;
  public title: string = "";
  chargesEdit1: boolean = false;
  confirmandiscount:boolean
  tonegotcheck:boolean = false;
  chargesEdit2: boolean = false;
  charges1: boolean = false;
  charges2: boolean = false;
  public selectNego: string = "";
  public selectMature: String = "";
  public radioid: boolean = true;
  withdrawMsg: any;
  withdrawOK: boolean=false;
  ID: any;
  totalQuote: any;
  viewby: boolean;
  bankgau: boolean;
  discount: boolean;
  confandDiscount: boolean;
  bankerget: boolean;
  refiance: boolean;
  username: any;
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
  tradeName: string;
  negot: boolean;
  matur: boolean;

  constructor(public titleService: TitleService,public psd: PersonalDetailsService,public Sub:SubscriptionDetailsService, public loginService: LoginService,public report :ReportsService, public nts: NewTransactionService, public bds: BusinessDetailsService, 
    public router: Router, public activatedRoute: ActivatedRoute ) {

      this.activatedRoute.parent.url.subscribe((urlPath) => {
        this.parentURL = urlPath[urlPath.length - 1].path;
        console.log(this.parentURL);
      });
      this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
        this.subURL = urlPath[urlPath.length - 1].path;
        console.log(this.subURL);
      });
      this.CurrentDate=  formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.username = sessionStorage.getItem('username');
     console.log(this.username);
     
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
   }

   public getAllnewTransactions(userid) {
    this.user_ID=userid;
   
    this.titleService.quote.next(true);

    const data = {
      "bankUserId":userid,
      "quotationStatus": "Placed"
    }

    this.nts.getTransQuotationDtlByBankUserIdAndStatus(data).subscribe(
      (response) => {
         console.log(response ,' new response') ;
        // custTrnsactionDetail();
        this.detail=[];
        this.detail = JSON.parse(JSON.stringify(response)).data; 
        console.log(this.detail); 
        let array = this.detail;
        if(array!=null){
        for (var value of array) {
          console.log(value.expiredOn)
          if(value.quotationStatus==="FreezePlaced" || value.quotationStatus==="FreezeRePlaced")
            this.isFreeze=true;
            if(value.expiredOn != "1970-01-01T00:00:00.000+0000"){  
                if(value.expiredOn < value.validity )
                this.isExpire=true;
            }else{
              this.isExpire=false;
            }
        }  
         

      }
      }, (error) => {
        this.hasNoRecord = true;
      }
    )

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
      // chargesType: '',
      chargesType: null,
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

    this.dataViewEdit = {
      termConditionComments:"",
      confirmationPeriod:"",
      lCCurrency:"",
      confChgsIssuanceToClaimExp:'',
      confChgsIssuanceToexp:'',
      acceptedOn: null,
      applicableBenchmark: 0,
      applicantName: "",
      bankUserId: "",
      bankerAcceptCharges: 0,
      beneName: "",
      // chargesType: "",
      chargesType: null,
      commentsBenchmark: "",
      confChgsIssuanceToMatur: "",
      confChgsIssuanceToNegot: "",
      confirmationCharges: 0,
      discountingCharges: 0,
      docHandlingCharges: 0,
      goodsType: "",
      lCIssuanceBank: "",
      secTransactionType: "",
      lCValue: 0,
      minTransactionCharges: 0,
      negotiationChargesFixed: 0,
      negotiationChargesPerct: 0,
      otherCharges: 0,
      quotationId: 0,
      quotationPlaced: "",
      refinancingCharges: 0,
      requirementType: "",
      totalQuoteValue: 0,
      transactionId: "",
      transactionStatus: "",
      userId: "",
      validity: null,
      validityDate: null,
      discountingPeriod: '',
      refinancingPeriod: '',
      quotationStatus:'',
      retentionAmt:'',
      offeredPrice:'',
      benchmark:0,
      isOffered:null,
      participationCommission:0,
      participationAmount:0
    }
  }
  
  usersStat(users) {
    this.Sub.getUserStats()
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
  ngOnInit() {
    loads();
   
    this.accountType=sessionStorage.getItem('accountType')
   
 // this.getUsercodeData();
  
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

public action(flag: boolean, type: Tflag, data: any) {
  console.log(data);
  this.CurrentDate=  formatDate(new Date(), 'yyyy-MM-dd', 'en');
//  this.tab='tab1';
if(this.isActive == true){
  this.tab='tab1';
}
    if(this.dataViewEdit.termConditionComments=='null'){
      this.dataViewEdit.termConditionComments='';
    } if(this.dataViewEdit.chargesType=='null'){
      this.dataViewEdit.chargesType='';
    } if(this.dataViewEdit.commentsBenchmark=='null'){
      this.dataViewEdit.commentsBenchmark='';
    }    
    if (flag) {
      if (type === Tflag.VIEW) {
        this.isActive = flag;
        $('input').attr('readonly', true);
        $('textarea').attr('readonly', true);
        this.title = 'View';
        this.data = data;
        console.log(this.data);
        if (this.dataViewEdit.confChgsIssuanceToClaimExp === 'yes') {
          this.chargesEdit2 = true;
          this.chargesEdit1 = false;
          this.confirmandiscount = false;
          this.tonegotcheck = false;
          this.dataViewEdit.confChgsIssuanceToClaimExp = "";
          this.dataViewEdit.confChgsIssuanceToexp = "";
          this.selectMature = 'yes';
          this.selectNego = 'no';
        } else if (this.dataViewEdit.confChgsIssuanceToexp === 'yes') {
          this.chargesEdit1 = true;
          this.confirmandiscount = true;
          this.tonegotcheck= true;
          this.chargesEdit2 = false;
          this.dataViewEdit.confChgsIssuanceToexp = "";
          this.dataViewEdit.confChgsIssuanceToClaimExp = "";
          this.selectMature = 'no';
          this.selectNego = 'yes';
        }

      } else if (type === Tflag.EDIT) {
        this.isActive = flag;
        this.title = 'Edit';
        this.data = data;
        console.log(this.data);

      } else if (type === Tflag.PLACE_QUOTE) {
        this.isActiveQuote = flag;
        this.title = 'Place Quote';
        this.data = data;
        console.log(this.data);
        
        if (data.confChgsIssuanceToClaimExp === 'yes') {
          this.charges2 = true;
          this.charges1 = false;
          data.confChgsIssuanceToClaimExp = "yes";
          data.confChgsIssuanceToexp = "no";
          this.selectMature = 'yes';
          this.selectNego = 'no';
        } else if (data.confChgsIssuanceToexp === 'yes') {
          this.charges1 = true;
          this.charges2 = false;
          data.confChgsIssuanceToexp = "yes";
          data.confChgsIssuanceToClaimExp = "no";
          this.selectMature = 'no';
          this.selectNego = 'yes';
        }else{
          this.charges1=false;
       this.charges2=false;
       data.confChgsIssuanceToexp = "";
       data.confChgsIssuanceToClaimExp = "";
     


        }
      }
    } else {
      this.isActive = flag;
      this.isActiveQuote = flag
      this.data = data;
      this.title = '';
      $('input').attr('readonly', true);

    }
  }




showProForma(file) {
    

  $('#myModal99').show();
  ///$('#myModalAttach').show();
  var str = file; 
  var splittedStr = str.split(" |", 2); 
  var filename=str.split(" |", 1); 
  var filename=splittedStr[0].toLowerCase();
  var ext = filename.split("."); 
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
 // var extension='.'+ext[1];
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
      var fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
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

            convertbase64toArrayBuffer(base64) {
              var binary_string = window.atob(base64);
              var len = binary_string.length;
              var bytes = new Uint8Array(len);
              for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
              }
              return bytes.buffer;
            }
getDetail(detail:any) {
  this.isDetailActive = true;
  this.hasNoRecordQuote = true;

  if(detail.lcProforma==null || detail.lcProforma=="" || detail.lcProforma==undefined){
    this.noFileDisable=false;
    this.viewDisable=true;

   }else{
    this.viewDisable=false;
    this.noFileDisable=true;
   }
    this.quotationdata = detail;
    console.log(this.quotationdata);
   
    this.specificDetail = detail;
    if(this.quotationdata.termConditionComments=='null'){
      this.quotationdata.termConditionComments='';
    } if(this.quotationdata.chargesType=='null'){
      this.quotationdata.chargesType='';
    } if(this.quotationdata.commentsBenchmark=='null'){
      this.quotationdata.commentsBenchmark='';
    }
if(this.specificDetail.tenorFile){
  this.isUploadNoDoc=false;
}else{
  this.isUploadNoDoc=true;
}

    $('.activeTab').removeClass('active');
    $('#menu-barDetailActive li:first').addClass('active');
    $('.tab-content #pill111').addClass('active');
  
    this.getNegoMature(this.specificDetail)
}

getNegoMature(val){
  const params ={
  
    "quotationId":val.quotationId,
    "transactionId":val.transactionId
  
 }
 this.nts.getTransQuotationDtlByQuotationId(params).subscribe(
  (response) => {
    // console.log(response);
    // let newdata = JSON.parse(JSON.stringify(response)).data[0];
    // console.log(newdata);
    // var type = newdata.requirementType;
    // console.log(type);
    if(JSON.parse(JSON.stringify(response)).data[0].requirementType == 'BankGuarantee'){
      console.log('i m in bg');
      if(JSON.parse(JSON.stringify(response)).data[0].confChgsIssuanceToNegot == 'yes'){
           console.log('this is true');
           this.negot = true;
           this.matur = false;
      }else if(JSON.parse(JSON.stringify(response)).data[0].confChgsIssuanceToMatur == 'yes'){
        console.log('this is nottrue');
        this.negot = false;
        this.matur = true;
      }
    }
    var str = JSON.parse(JSON.stringify(response)).status; 
    var splittedNego = str.split(",", 1); 
    var nego=splittedNego[0].split(":", 2)
    this.quotationdata.confChgsIssuanceToNegot=nego[1];

    var splittedMature = str.split(",", 2); 
    var mature=splittedMature[1].split(":", 2)
    this.quotationdata.confChgsIssuanceToMatur=mature[1];
    
    var splittedtilldate = str.split(",", 3); 
    var td=splittedtilldate[2].split(":", 2)
    this.quotationdata.confChgsIssuanceToexp=td[1];

    var splittedClaimDate = str.split(",", 4); 
    var tcd=splittedClaimDate[3].split(":", 2)
    this.quotationdata.confChgsIssuanceToClaimExp=tcd[1];
  });
}

ngAfterViewInit() {
  this.getAllnewTransactions(sessionStorage.getItem('userID'));
 

}

public transaction(act: string, dataViewEdit: any) {
  this.dataViewEdit.confChgsIssuanceToNegot = this.selectNego;
  this.dataViewEdit.confChgsIssuanceToMatur = this.selectMature;
  this.titleService.quote.next(true);
  switch (act) {
    case 'edit': {
      this.tab = 'tab1'
      this.title = 'Edit';
    
      this.isActive = true;
      this.radioid=false;
      $('input').attr('readonly', false);
      $('textarea').attr('readonly', false);
      if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
        this.chargesEdit2 = true;
        this.chargesEdit1 = false;
        this.confirmandiscount = false;
        this.tonegotcheck= false;
        this.dataViewEdit.confChgsIssuanceToMatur = "";
        this.dataViewEdit.confChgsIssuanceToNegot = "";
        this.selectMature = 'yes';
        this.selectNego = 'no';
      } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
        this.chargesEdit1 = true;
        this.confirmandiscount = true;
        this.chargesEdit2 = false;
        this.tonegotcheck= true;
        this.dataViewEdit.confChgsIssuanceToNegot = "";
        this.dataViewEdit.confChgsIssuanceToMatur = "";
        this.selectMature = 'no';
        this.selectNego = 'yes';
      }
      // if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
      //   this.chargesEdit2 = true;
      //   this.chargesEdit1 = false;
      //   console.log(' i m in edit');
      //   // this.isActive = true;
      //   console.log(this.chargesEdit1);
      //   console.log(this.chargesEdit2);
      //   this.dataViewEdit.confChgsIssuanceToMatur = "";
      //   this.dataViewEdit.confChgsIssuanceToNegot = "";
      //   this.selectMature = 'yes';
      //   this.selectNego = 'no';
      // } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
      //   this.chargesEdit1 = true;
      //   console.log(this.chargesEdit1);
      //   console.log(' i m in edit');
      //   // this.isActive = true;
      //   // this.tonegotcheck = true;
      //   this.chargesEdit2 = false;
      //   this.dataViewEdit.confChgsIssuanceToNegot = "";
      //   this.dataViewEdit.confChgsIssuanceToMatur = "";
      //   this.selectMature = 'no';
      //   this.selectNego = 'yes';
      // }
      this.refiance = true;
      this.bankerget = true;
      // this.isActive = true;
      this.discount = true;
      this.isbillavailastion= true;
      this.confandDiscount = true;
      this.bankgau= true;


    }
      break;

    case 'submit': {
      if(this.dataViewEdit.quotationStatus=="FreezePlaced"){
        const param = {
          "userId": this.dataViewEdit.userId,
          "bankUserId":this.dataViewEdit.bankUserId,
          "transactionId":this.dataViewEdit.transactionId
        }
        this.nts.validateQuote(param).subscribe(
          (response) => {
            this.success = JSON.parse(JSON.stringify(response)).status;
            if(this.success=="Validate Success"){
             // alert("Quote Validated Successfully.")
            // $("#validateSuccessCon").show();

            }else{
              console.log("Someting went wrong.")
            }
          }, (error) => {}
        )
        }

        if(this.dataViewEdit.quotationStatus == "FreezeRePlaced"){
          const param = {
            "userId": this.dataViewEdit.userId,
            "bankUserId":this.dataViewEdit.bankUserId,
            "transactionId":this.dataViewEdit.transactionId
          }
          console.log(param);
          this.nts.validateQuote(param).subscribe(
            (response) => {
              this.success = JSON.parse(JSON.stringify(response)).status;
              console.log(this.detail);
              if(this.success=="Validate Success"){
               // alert("Quote Validated Successfully.")
              // $("#validateSuccessCon").show();
  console.log(' i am here');
              }else{
                console.log("Someting went wrong.")
              }
            }, (error) => {}
          )
          }
      this.nts.updateBankTransaction(this.dataViewEdit).subscribe(
        (response) => {
          console.log(response);
          // this.refiance = false;
          //       this.bankerget= false;
          //       this.confandDiscount = false;
          //       this.bankgau = false;
          //       this.isActive = false;
          //       this.discount = false;
          //       this.isbillavailastion = false;
          this.tab = 'tab3';
        },
        error => {
          console.log(error);
          alert('error')
          // this.closedQuote();
          this.tab = 'tab1';
        }
      )
    }
      break;
      case 'withdraw': {          

        const param={
          "transactionId":this.dataViewEdit.transactionId,
          "userId":sessionStorage.getItem('userID'),
           "quotationId":this.dataViewEdit.quotationId,
        }  
        this.nts.withdrawQuote(param).subscribe(
          (response) => {
           let data = JSON.parse(JSON.stringify(response));
            if(data.status=='Failure'){
              this.withdrawMsg=data.errMessage;
              this.withdrawOK=true;
              $('#withdrawTrasactionConfirm').show();
            }else{
              this.withdrawMsg="Are you sure you want to withdraw this quote?";    
              this.withdrawOK=false;          
              $('#withdrawTrasactionConfirm').show(); 
          //  this.tab = 'tab4';
            }
          })


            
      }
        break;

        case 'withdrawTransaction': {
          const param={
            "transactionId":this.dataViewEdit.transactionId,
            "userId":sessionStorage.getItem('userID'),
             "quotationId":this.dataViewEdit.quotationId,
          }  
          this.nts.withdrawQuote(param).subscribe(
            (response) => {
                  $('#withdrawTrasactionConfirm').hide();
                  this.refiance = false;
                this.bankerget= false;
                this.confandDiscount = false;
                this.bankgau = false;
                this.isActive = false;
                this.discount = false;
                this.isbillavailastion = false;

              this.tab = 'tab4';
            },
            error => {
              alert('error')
            }
          )     
            }
              break;
  
              case 'noWithdrawTransaction': {
                $('#withdrawTrasactionConfirm').hide();      
              }
                break;

    case 'ok': {
      this.closed();
      this.tab = 'tab1';
      
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([`/${this.subURL}/${this.parentURL}/activerequest`]);
        // this.router.navigate(['/offlineactiverequest']);;
    });
    }
      break;
  //   case 'preview': {
  //     this.isActive = true;
  //     if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
  //       this.chargesEdit2 = true;
  //       this.chargesEdit1 = false;
  //       this.selectMature = 'yes';
  //       this.selectNego = 'no';
  //     } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
  //       this.chargesEdit1 = true;
  //       this.chargesEdit2 = false;
  //       this.selectMature = 'no';
  //       this.selectNego = 'yes';
  //     }
  //     this.tab = 'tab2';
  //     // if(this.title=='Edit')
  //    {
  //       this.tab = 'tab2';
  //       console.log(this.dataViewEdit);
  //       this.refiance = false;
  //       this.bankerget= false;
  //       this.confandDiscount = false;
  //       this.bankgau = false;
  //       this.isActive = false;
  //       this.discount = false;
  //       this.isbillavailastion = false;
  //       console.log(' im hera')
  //       // setTimeout(() => {
  //       //   $('input').attr('readonly', true);
  //       //   $('textarea').attr('readonly', true);
  //       // }, 200);
  //       this.nts.updateBankTransaction(this.dataViewEdit).subscribe(
  //         (response) => {
  //           // this.detailnew = JSON.parse(JSON.stringify(response)).data;
  //           // this.detail = JSON.parse(JSON.stringify(response)).data;
  //           // console.log(this.detailnew);
  //           // this.totalQuote = JSON.parse(JSON.stringify(response)).data.TotalQuote;
  //           // this.viewby = true;
  //           this.tab = 'tab3';
  //         },
  //       // this.nts.saveQuotationToDraft(this.data).subscribe(
  //       //   (response) => {
  //       //     this.totalQuote = JSON.parse(JSON.stringify(response)).data.TotalQuote;
  //       //     console.log(this.totalQuote)
  //       //   },
  //         error => {
  //           alert('error')
  //           this.closed();
  //           this.tab = 'tab1';
  //         }
          
  //       )
  //     }

  //     // else
  //     {
  //       this.tab = 'tab2';
  //       setTimeout(() => {
  //         $('input').attr('readonly', true);
  //         $('textarea').attr('readonly', true);
  //       }, 200);
  //     }
     
  //   }
  //     break;
  // }
  case 'preview': {
      
    if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
      this.chargesEdit2 = true;
      this.chargesEdit1 = false;
      this.tonegotcheck= false;
      this.confirmandiscount = false;
    } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
      this.chargesEdit1 = true;
      this.tonegotcheck= true;
      this.confirmandiscount = true;
      this.chargesEdit2 = false;
    }

    if (this.title == 'Edit') {

      this.tab = 'tab2';
      this.refiance = false;
        this.bankerget= false;
        this.confandDiscount = false;
        this.bankgau = false;
        this.isActive = false;
        this.discount = false;
        this.isbillavailastion = false;
        if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
          this.chargesEdit2 = true;
          this.chargesEdit1 = false;
          this.tonegotcheck= false;
          this.confirmandiscount = false;
        } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
          this.chargesEdit1 = true;
          this.tonegotcheck= true;
          this.confirmandiscount = true;
          this.chargesEdit2 = false;
        }
      setTimeout(() => {
        $('input').attr('readonly', true);
        $('textarea').attr('readonly', true);
      }, 200);
    
      this.nts.updateBankTransaction(this.dataViewEdit).subscribe(
        (response) => {
          this.titleService.quote.next(false);
          this.detailnew = JSON.parse(JSON.stringify(response)).data;
          console.log("this.detail--",this.detailnew)
          console.log(this.detailnew.confChgsNegot);
          this.totalQuote = JSON.parse(JSON.stringify(response)).data.TotalQuote;             
        },
        error => {
          alert('error')
          this.closed();
          this.tab = 'tab1';
        }

      )

    } else {
      this.tab = 'tab2';
      setTimeout(() => {
        $('input').attr('readonly', true);
      }, 200);
    }

  }
    break;
}
}


onNegotChange(value) {
  console.log(value);
  this.data.confChgsIssuanceToMatur='no';
  this.data.confChgsIssuanceToNegot='yes';
  this.selectMature = 'no';
  this.selectNego = 'yes';
}

onMatureChange(value) {
  console.log(value, ' i m mature');
  this.data.confChgsIssuanceToMatur='yes';
  this.data.confChgsIssuanceToNegot='no';
  this.selectMature = 'yes';
  this.selectNego = 'no';
}

closed_div(){
    this.isActive = false;
    this.radioid = true;
     document.getElementById("menubarRefinancing").style.width = "0%"; 
    document.getElementById("menubar-con").style.width = "0%"; 
  document.getElementById("menubarAvalising_bg").style.width= "0%";
  document.getElementById("menubar-bg").style.width = "0%"; 
  document.getElementById("menubarConfDis").style.width = "0%"; 
  document.getElementById("menubarBanker").style.width = "0%"; 
  document.getElementById("menubarDiscounting").style.width = "0%"; 
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0"; 
   }


close(){
  $('#myModal99').hide();
}
public closed() {
  this.isActive = false;
  
  this.titleService.quote.next(false);
}

openOffcanvas() {   
  document.getElementById("menu-barDetailActive").style.width = "560px";

}
openOffcanvasnew(val){
console.log(val);
if (val.requirementType == 'BillAvalisation'){
  this.isbillavailastion = true;
  document.getElementById("menubarAvalising_bg").style.width = "560px";
  this.dataViewEdit = val;
  if(this.dataViewEdit.termConditionComments=='null'){
    this.dataViewEdit.termConditionComments='';
  } if(this.dataViewEdit.chargesType=='null'){
    this.dataViewEdit.chargesType='';
  } if(this.dataViewEdit.commentsBenchmark=='null'){
    this.dataViewEdit.commentsBenchmark='';
  }    
  $('input').attr('readonly', true);
  $('textarea').attr('readonly', true);
  this.title = 'View';

  console.log(this.dataViewEdit);
}else if(val.requirementType == 'Confirmation'){
  
  document.getElementById("menubar-con").style.width = "560px";
  this.dataViewEdit = val;
  if(this.dataViewEdit.termConditionComments=='null'){
    this.dataViewEdit.termConditionComments='';
  } if(this.dataViewEdit.chargesType=='null'){
    this.dataViewEdit.chargesType='';
  } if(this.dataViewEdit.commentsBenchmark=='null'){
    this.dataViewEdit.commentsBenchmark='';
  }    
  if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
    this.chargesEdit2 = true;

    this.chargesEdit1 = false;
    this.tonegotcheck= false;
    this.confirmandiscount = false;
    this.dataViewEdit.confChgsIssuanceToClaimExp = "";
    this.dataViewEdit.confChgsIssuanceToexp = "";
    this.selectMature = 'yes';
    this.selectNego = 'no';
  } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
    this.chargesEdit1 = true;
    this.confirmandiscount = true;
    this.tonegotcheck= true;
    this.chargesEdit2 = false;
    this.dataViewEdit.confChgsIssuanceToexp = "";
    this.dataViewEdit.confChgsIssuanceToClaimExp = "";
    this.selectMature = 'no';
    this.selectNego = 'yes';
  }
  console.log(this.dataViewEdit);
  this.isActive = true;
  $('input').attr('readonly', true);
  $('textarea').attr('readonly', true);
  this.title = 'View';
}else if(val.requirementType == 'BankGuarantee'){
  this.bankgau = true;
  this.dataViewEdit = val;
  if(this.dataViewEdit.termConditionComments=='null'){
    this.dataViewEdit.termConditionComments='';
  } if(this.dataViewEdit.chargesType=='null'){
    this.dataViewEdit.chargesType='';
  } if(this.dataViewEdit.commentsBenchmark=='null'){
    this.dataViewEdit.commentsBenchmark='';
  }    
  if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
    this.chargesEdit2 = true;
    this.chargesEdit1 = false;
    this.confirmandiscount = false;
    this.tonegotcheck= false;
    this.dataViewEdit.confChgsIssuanceToClaimExp = "";
    this.dataViewEdit.confChgsIssuanceToexp = "";
    this.selectMature = 'yes';
    this.selectNego = 'no';
  } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
    this.chargesEdit1 = true;
    this.chargesEdit2 = false;
    this.confirmandiscount = true;
    this.tonegotcheck= true;
    this.dataViewEdit.confChgsIssuanceToexp = "";
    this.dataViewEdit.confChgsIssuanceToClaimExp = "";
    this.selectMature = 'no';
    this.selectNego = 'yes';
  }
  this.title = 'View';
  document.getElementById("menubar-bg").style.width = "560px";
}
else if(val.requirementType == 'Discounting'){
  this.discount = true;
  this.title = 'View';
  document.getElementById("menubarDiscounting").style.width = "560px";
  this.dataViewEdit = val;
  if(this.dataViewEdit.termConditionComments=='null'){
    this.dataViewEdit.termConditionComments='';
  } if(this.dataViewEdit.chargesType=='null'){
    this.dataViewEdit.chargesType='';
  } if(this.dataViewEdit.commentsBenchmark=='null'){
    this.dataViewEdit.commentsBenchmark='';
  }    
}
else if(val.requirementType =='ConfirmAndDiscount'){

  document.getElementById("menubarConfDis").style.width = "560px"; 
  this.dataViewEdit = val;
  if(this.dataViewEdit.termConditionComments=='null'){
    this.dataViewEdit.termConditionComments='';
  } if(this.dataViewEdit.chargesType=='null'){
    this.dataViewEdit.chargesType='';
  } if(this.dataViewEdit.commentsBenchmark=='null'){
    this.dataViewEdit.commentsBenchmark='';
  }    
  console.log(this.dataViewEdit);
  if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
    this.chargesEdit2 = true;
    this.chargesEdit1 = false;
    this.tonegotcheck= false;
    this.confirmandiscount = false;
    this.dataViewEdit.confChgsIssuanceToMatur = "";
    this.dataViewEdit.confChgsIssuanceToNegot = "";
    this.selectMature = 'yes';
    this.selectNego = 'no';
    
  } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
    this.chargesEdit1 = true;
    this.tonegotcheck= true;
    this.chargesEdit2 = false;
    this.confirmandiscount = true;
    this.dataViewEdit.confChgsIssuanceToMatur = "";
    this.dataViewEdit.confChgsIssuanceToNegot = "";
    this.selectMature = 'no';
    this.selectNego = 'yes';
    console.log(this.dataViewEdit);
  }
  this.title = 'View';
  this.confandDiscount = true;
}
else if(val.requirementType =='Banker' || val.requirementType =='Banker’s Acceptance'){
  document.getElementById("menubarBanker").style.width = "560px";
  this.bankerget = true;
  this.dataViewEdit = val;
  if(this.dataViewEdit.termConditionComments=='null'){
    this.dataViewEdit.termConditionComments='';
  } if(this.dataViewEdit.chargesType=='null'){
    this.dataViewEdit.chargesType='';
  } if(this.dataViewEdit.commentsBenchmark=='null'){
    this.dataViewEdit.commentsBenchmark='';
  }    
  this.title = 'View';
}
else if(val.requirementType =='Refinance'){
  this.refiance = true;
  document.getElementById("menubarRefinancing").style.width = "560px";
  this.dataViewEdit = val; 
  if(this.dataViewEdit.termConditionComments=='null'){
    this.dataViewEdit.termConditionComments='';
  } if(this.dataViewEdit.chargesType=='null'){
    this.dataViewEdit.chargesType='';
  } if(this.dataViewEdit.commentsBenchmark=='null'){
    this.dataViewEdit.commentsBenchmark='';
  }    
  this.title = 'View';
}

}



openNav3() {
document.getElementById("myCanvasNav").style.width = "100%";
document.getElementById("myCanvasNav").style.opacity = "0.6";  

}
closeOffcanvas() {
document.getElementById("menu-barDetailActive").style.width = "0%"; 
document.getElementById("menubar-con").style.width = "0%"; 
document.getElementById("menubar-bg").style.width= "0%";
document.getElementById("menubarDiscounting").style.width = "0%"; 
document.getElementById("menubarConfDis").style.width = "0%"; 
document.getElementById("menubarRefinancing").style.width = "0%"; 
document.getElementById("menubarBanker").style.width = "0%";  
document.getElementById("myCanvasNav").style.width = "0%";
document.getElementById("myCanvasNav").style.opacity = "0"; 
} 

showQuotePage(pagename: string, action: Tflag, data1: any) {
  //  let data = data1;
  //  console.log(data);
   setTimeout(() => {
          $('input').attr('readonly', true);
          $('textarea').attr('readonly', true);
        }, 200);
   this.data = this.data;
  const transactionId = {
    "transactionId": data1.transactionId
  }
  
    
      // this.detailInfo = JSON.parse(JSON.stringify(response)).data;
      // console.log(this.detailInfo);
      // this.viewDatanew=this.detailInfo;
      // console.log(this.detailInfo);
      // var newold = this.viewDatanew.billType;
      // console.log(newold);
     
      
      // const data1 = {
      //   "bankUserId": 'BA30490',
      //   "userId": sessionStorage.getItem('userID'),
      //   "transactionId": this.viewDatanew.transactionId,
      //   "requirementType": this.viewDatanew.requirementType,
      //   "lCIssuanceBank": this.viewDatanew.lCIssuanceBank,
      //   "lCValue": this.viewDatanew.lCValue,
      //   "lCCurrency": this.viewDatanew.lCCurrency,
      //   "usanceDays": this.viewDatanew.usanceDays,
      //   "insertedDate": this.date,
      //   "insertedBy": sessionStorage.getItem('userID'),
      //   "modifiedDate": this.viewDatanew.date,
      //   "modifiedBy": sessionStorage.getItem('userID'),
      //   "quotationId": this.viewDatanew.quotationId,
      //   "confirmationPeriod": this.viewDatanew.confirmationPeriod,
      //   "discountingPeriod": this.viewDatanew.discountingPeriod,
      //   "refinancingPeriod": this.viewDatanew.refinancingPeriod,
      
      //   "billType" : this.viewDatanew.billType,
  
      // }


      this.titleService.quote.next(true);
      this.whoIsActive = pagename;
      removeDoubleScroll()
     
    //  console.log(this.viewDatanew);
    //   console.log(this.newold);
    //  let data = this.viewDatanew;
    //   console.log(data);
    //   const req = {
       
    //     "transactionId":this.viewDatanew.transactionId,
    //   "bankUserId":sessionStorage.getItem('userID')
    //   // "bankUserId":'BA30490'
    //   }
       
 
  this.titleService.quote.next(true);
  this.whoIsActive = pagename;
  if (pagename === 'confirmation' || pagename === 'Confirmation') {
    this.isActive = true;
    // document.getElementById("menubar-con").style.width = "560px"; 
     

  }
  if (pagename === 'BankGuarantee' ) {
    document.getElementById("menubar-bg").style.width = "560px"; 
   

  }
   else if (pagename === 'discounting' || pagename === 'Discounting') {


  } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {


  } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
 

  } else if (pagename === 'banker' || pagename === 'Banker' || pagename === 'Banker’s Acceptance') {
  

  } 
  else if(pagename === 'BillAvalisation' ) {
    this.isbillavailastion = true;
    this.data = this.data
    // document.getElementById("menubarAvalising_bg").style.width = "560px"; 
    // $('#menubarAvalising_bg li:first').addClass('active');
    // $('#menubarAvalising_bg').show();
    // this.data = this.viewDatanew;
   
    // console.log(data);
  }

}


selectSubsidiaries(val: any) {  
  if(val=='All'){
    this.selectedSub=sessionStorage.getItem('userID');
    this.getAllnewTransactions(this.selectedSub)
  }else{
    this.selectedSub=val;
    this.getAllnewTransactions(this.selectedSub)
  }
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
refreshPage(){

this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>{
  this.router.navigate([`/${this.subURL}/${this.parentURL}/activerequest`]);
// this.router.navigate(['/offlineactiverequest']);
});
}


downloadExcel(){

const data= {
  "bankUserId":this.user_ID,
  "quotationStatus": "Placed"
}

this.report.downloadExcelReportForBankTransaction(data).subscribe((response)=>{
console.log()
})
}
}
 
