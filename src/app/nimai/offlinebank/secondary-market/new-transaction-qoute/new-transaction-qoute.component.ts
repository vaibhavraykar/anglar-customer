import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { bankNewTransaction ,custTrnsactionDetail} from 'src/assets/js/commons'
import { FormBuilder, FormControl } from '@angular/forms';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Tflag } from 'src/app/beans/Tflag';
import { newTransactionBean } from 'src/app/beans/BankNewTransaction';
import { formatDate } from '@angular/common';
import * as $ from 'src/assets/js/jquery.min';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {removeDoubleScroll} from 'src/assets/js/commons'
import * as FileSaver from 'file-saver';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { environment } from 'src/environments/environment';
import { OfllineConfirmationQuotesComponent } from '../oflline-confirmation-quotes/oflline-confirmation-quotes.component';
import { LoaderServiceService } from 'src/app/services/LoaderService/loader-service.service';
@Component({
  selector: 'app-new-transaction-qoute',
  templateUrl: './new-transaction-qoute.component.html',
  styleUrls: ['./new-transaction-qoute.component.css']
})
export class NewTransactionQouteComponent implements OnInit {
  bankDetail: any;
  public data: newTransactionBean;
  displayedColumns: string[] = ['id', 'beneficiary', 'bcountry', 'applicant', 'acountry', 'txnID', 'dateTime', 'validity', 'ib', 'amount', 'ccy', 'goodsTypes', 'requirement', 'receivedQuotes', 'star'];
  dataSource: MatTableDataSource<any>;
  public ntData: any[] = [];
  public isActive: boolean = false;
  document: any;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  viewData:any;

  @ViewChild(OfllineConfirmationQuotesComponent, { static: true }) offlineconfirmation: OfllineConfirmationQuotesComponent;
  public date: string = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');

  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public detail: any;
  public parentURL: string = "";
  public subURL: string = "";
  public detailInfo: string = "";
  public imgDownload:boolean=false;
  public notImgDownload:boolean=false;
  fileData: any;
  nimaiCount: any;
  chkPlaceQuote: any="";
  trnxMsg: string="";
  tradeSupport: string;
  isDownloadORview: string;
  selectedSub: string;
  countries: { code: string; name: string; }[];
  creditCounts: number;
  comment:string;
  commentList: { name: string; }[];
  

  constructor(public titleService: TitleService,public getCount: SubscriptionDetailsService, public nts: NewTransactionService, private formBuilder: FormBuilder,
    private newloader: LoaderServiceService,  public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });

    this.commentList = [{'name': 'Currently Lines for this bank are full' },  { 'name': 'Currently lines for this country are full' }, 
     { 'name': 'No lines for this bank but have for other banks' },
    { 'name': 'No lines for this country' },  { 'name': 'Applicant profile is not satisfactory/comfortable' },  
    { 'name': 'Bank profile is not satisfactory' },  { 'name': 'Goods are from not compliant category' },
    { 'name': 'Goods are not of our preferred category' },
    { 'name': 'Others & free text field' }];



    this.data = {
      transactionId: "",
      userId: "",
      requirementType: "",
      lCIssuanceBank: "",
      lCIssuanceBranch: "",
      swiftCode: 0,
      lCIssuanceCountry: "",
      lCIssuingDate: null,
      lCExpiryDate: null,
      lCValue: null,
      lCCurrency: "",
      lastShipmentDate: null,
      negotiationDate: null,
      paymentPeriod: 0,
      paymentTerms: "",
      tenorEndDate: null,
      applicantName: "",
      applicantCountry: "",
      beneName: "",
      beneBankCountry: "",
      billType:"",
      beneBankName: "",
      beneSwiftCode: "",
      beneCountry: "",
      loadingCountry: "",
      loadingPort: "",
      dischargeCountry: "",
      dischargePort: null,
      chargesType: "",
      validity: null,
      insertedDate: null,
      insertedBy: "",
      modifiedDate: null,
      modifiedBy: "",
      transactionflag: null,
      transactionStatus: "",
      branchUserId: null,
      branchUserEmail: null,
      goodsType: "",
      usanceDays: null,
      startDate: null,
      endDate: null,
      originalTenorDays: null,
      refinancingPeriod: "",
      lcMaturityDate: null,
      lcNumber: '',
      lastBeneBank: "",
      lastBeneSwiftCode: "",
      lastBankCountry: "",
      remarks: "",
      discountingPeriod: "",
      confirmationPeriod: null,
      financingPeriod: null,
      lcProForma: "",
      tenorFile: null,
      lccountry: [],
      lcgoods: [],
      lcbanks: [],
      lcbranch: [],
      applicantContactPersonEmail: "",
      beneContactPerson: '',
      beneContactPersonEmail: '',
      userType: '',
      applicantContactPerson: "",
      closedQuote: '',
      quotationStatus:''
    }
  }
  ngOnInit() {
    this.countries = [{ 'code': 'Issuance', 'name': 'Issuance Countries Interested' }, { 'code': 'Bene', 'name': 'Beneficiary Country' }];

    $('.slide-reveal-overlay').hide();

    this.tradeSupport=environment.support;
    this.newloader.hide();
  }


  
  inactiveOk(){
  
     
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL+"/"+this.parentURL }/dashboard-details`]);
           
      });
    
  }
  
  
  refreshPage(){ 
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction-qoute`]);
  });
  }

  public getNewRequestsForBank(value) {
   

    this.titleService.quote.next(true);


  const  data = {
    "userId": sessionStorage.getItem('userID'),
  //  "requirementType":value
  }


    this.nts.getNewRequestsForBankSecondary(data).subscribe(
      (response) => {   
        custTrnsactionDetail();
        this.detail=[];
        this.detail = JSON.parse(JSON.stringify(response)).data;
        console.log(this.detail);
     
        // if (!this.detail) {
        //   this.hasNoRecord = true;
        // }
      }, (error) => {
        console.log(error)
        //this.hasNoRecord = true;
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

  closed_div(){
    this.isActive = false;
    // document.getElementById("menubarDetail").style.width = "0%"; 
    // document.getElementById("myCanvasNav").style.width = "0%";
    // document.getElementById("myCanvasNav").style.opacity = "0"; 
   }
  
   openOffcanvas() {   
    document.getElementById("menubarDetail").style.width = "560px";
  
  }
 
openNav3() {
  document.getElementById("myCanvasNav").style.width = "100%";
  document.getElementById("myCanvasNav").style.opacity = "0.6";  
  
}
closeOffcanvas() {
  document.getElementById("menubarDetail").style.width = "0%"; 
  // this.offlineconfirmation. = false
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
    debugger
    console.log(action)
     this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    removeDoubleScroll()
    const data = {
      "bankUserId": sessionStorage.getItem('userID'),
      "userId": val.userId,
      "transactionId": val.transactionId,
      "requirementType": val.requirementType,
      "lCIssuanceBank": val.lCIssuanceBank,
      "lCValue": val.lCValue,
      "lCCurrency": val.lCCurrency,
      "usanceDays": val.usanceDays,
      "insertedDate": this.date,
      "insertedBy": sessionStorage.getItem('userID'),
      "modifiedDate": this.date,
      "modifiedBy": sessionStorage.getItem('userID'),
      "quotationId": val.quotationId,
      "confirmationPeriod": val.confirmationPeriod,
      "discountingPeriod": val.discountingPeriod,
      "refinancingPeriod": val.refinancingPeriod,
      "secTransactionType":val.secTransactionType,
      "participationAmount":val.minParticipationAmt,
      "retentionAmt": val.retentionAmt,
      "offeredPrice": val.offeredPrice,
      "benchmark": val.benchmark
      //  "participationAmount": val

    }
    const req = {
     
      "transactionId":val.transactionId,
    "bankUserId":sessionStorage.getItem('userID')
    }

    this.nts.getcheckQuotationPlaced(req).subscribe(
      (response) => {
        this.chkPlaceQuote = JSON.parse(JSON.stringify(response)).status;
        console.log(this.chkPlaceQuote)
if(this.chkPlaceQuote=='Success'){
  document.getElementById("menubarConfirmQuote").style.width = "560px";
  debugger 
  this.offlineconfirmation.action(true, action, data);
  
}else{
  $('#myModalDup').show();
console.log(JSON.parse(JSON.stringify(response)).status)
} 
       
});
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

}