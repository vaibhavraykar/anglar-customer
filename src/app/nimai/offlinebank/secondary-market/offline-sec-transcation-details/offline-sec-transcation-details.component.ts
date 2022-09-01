import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import * as $ from 'src/assets/js/jquery.min';
import * as FileSaver from 'file-saver';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-offline-sec-transcation-details',
  templateUrl: './offline-sec-transcation-details.component.html',
  styleUrls: ['./offline-sec-transcation-details.component.css']
})
export class OfflineSecTranscationDetailsComponent implements OnInit {
  public ntData: any[] = [];
  public accepted: boolean = false;
  public rejected: boolean = false;
  public expired: boolean = false;
  public withdrawn :boolean=false;
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public data: any;
  public specificDetail: any = "";
  quotationdata: any;
  public isActive: boolean = false;
  public quotes:any;
  document: any = "";
  selectReason: string='';
  public parentURL: string = "";
  public subURL: string = "";
  acceptedStatus: boolean = true;
  rejectedStatus:boolean=true;
  expiredStatus :boolean=true;
  withdrawStatus :boolean=true;
  forCloseTransactionId: any = "";
  forCloseUserId: any;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  public rejectReason:string="";
  isUploadNoDoc: boolean=false;
  tenor: any;
  imgDownload: boolean=false;
  fileData: any;
  selectedSub: any;
  subsidiaries: any;
  currentStatus: any;
  quotationReqType: string;
  disablesubsi: boolean;
  nimaiCount: any;
  getcountUser: any;
  creditCounts: number;
  creditCount: any;
  user_ID: any;
  closedTranMsg: string;
  isDownloadORview: string;
  rejectedBy: boolean;
  showQuote: boolean;
  currentDateTime: any;
  bankDetails:any =[];
  bankName:any;
  accutalDate: boolean;
  onemonthdate:any;
  updateddata:any =[];
  newdetails:any =[];

  constructor(public titleService: TitleService, public report:ReportsService ,public getCount: SubscriptionDetailsService,public nts: NewTransactionService,public psd: PersonalDetailsService,
    public activatedRoute: ActivatedRoute, public router: Router) {
      this.activatedRoute.parent.url.subscribe((urlPath) => {
        this.parentURL = urlPath[urlPath.length - 1].path;
      });
      this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
        this.subURL = urlPath[urlPath.length - 1].path;
      });
    this.titleService.quote.next(false);
    this.nts.creditCount.subscribe(ccredit=>{
      this.creditCount=ccredit;
          });

          
          var d = new Date();
          console.log(d.toLocaleDateString());
          var newdate =d.setMonth(d.getMonth() - 1);
          console.log(newdate, ' new date');
          console.log(d.toLocaleDateString());
          this.onemonthdate = formatDate(d.toLocaleDateString(),'yyyy-MM-dd', 'en');
          
           console.log(this.onemonthdate);
  }

  ngOnInit() {
    this.getAllnewTransactions('Accepted',sessionStorage.getItem('userID'));
 

  }
 

  refreshPage(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/transaction-detail-qoute`]);
  });
  }

  rejectedReasons(reason){
    this.rejectReason=reason;
  }

  public getAllnewTransactions(status,userid) {
    this.user_ID=userid;
    
    if(status == "Accepted") {
      this.rejectedStatus=false;
      this.acceptedStatus = true;
      this.expiredStatus=false;
      this.withdrawStatus=false;
    }
    else  if (status == "Rejected") {
      this.rejectedStatus=true;
      this.acceptedStatus = false;
      this.expiredStatus=false;
      this.withdrawStatus=false;
    }
    else if(status == "Expired") {
      this.expiredStatus=true;
      this.rejectedStatus=false;
      this.acceptedStatus = false;
      this.withdrawStatus=false;
    }
    else if(status == "Withdrawn") {
      this.expiredStatus=false;
      this.rejectedStatus=false;
      this.acceptedStatus = false;
      this.withdrawStatus=true;
    }

    this.currentStatus=status;
    const data = {
      "bankUserId": userid,
      "quotationStatus": this.currentStatus

    }
    

    this.nts.getSecTransQuotationDtlByBankUserIdAndStatus(data).subscribe(
      (response) => {
        custTrnsactionDetail();
        this.data =[];
        this.data = JSON.parse(JSON.stringify(response)).data;
          //new code
          this.newdetails =[];
          this.updateddata = [];
          if(this.data){
      this.data.forEach( element => {
    
        var ne = formatDate(element.insertedDate,'yyyy-MM-dd', 'en');
    
        if( ne >= this.onemonthdate ){
         
          this.updateddata = element;
          console.log(this.updateddata);
         this.newdetails.push(this.updateddata);
         console.log(this.newdetails, 'old ');
        
        }
      })
    }
         if (this.data) {
         this.hasNoRecord=true;
         this.getDetail(this.data,status,this.data.transactionID);
       
      }

      },
      (error) => {
        this.data = null;
       this.hasNoRecord = false;

      }
    )
  }
  

  getDetail(detail,status,trnxId) {
    console.log(trnxId)

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
      this.getDistributionBank(this.specificDetail.userId);
      this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US')     

      var strsplit=this.specificDetail.validity.split('T',2)
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
      if(strsplit[0]>=this.currentDateTime){
        console.log(' im here');
        this.accutalDate = true;
      }else{
        this.accutalDate = false;
        console.log(' i m not here');
      }
      console.log(this.specificDetail.rejectedBy.toLowerCase())
      if(this.specificDetail.rejectedBy.toLowerCase() =='customer' ||this.specificDetail.rejectedBy.toLowerCase() =='bank'
       ||this.specificDetail.rejectedBy.toLowerCase() == null )
        {
          this.showQuote=true;
          if(strsplit[0]>=this.currentDateTime ){
         
            this.rejectedBy=true;
            }else{
              this.rejectedBy=false;
            
            }
        }else {
        
            this.rejectedBy=false;
            this.showQuote=false;
        }

    if(status=='Accepted'){
      $('.activeTab').removeClass('active');
      $('#menu-barDetailnew li:first').addClass('active');
      $('.tab-content #pill111').addClass('active');
    }
    else if(status=='Rejected'){
      $('.activeTab').removeClass('active');
      $('#menubarDetailrejected li:first').addClass('active');
      $('.tab-content #pill112').addClass('active');
    }
    else if(status=='Expired'){  
      $('.activeTab').removeClass('active');   
      $('#menuDetailsExpired li:first').addClass('active');
      $('.tab-content #pill1131').addClass('active');
    }
    else if(status=='Withdrawn'){  
      $('.activeTab').removeClass('active');   
      $('#menuDetailsWithdrawn li:first').addClass('active');
      $('.tab-content #pill1151').addClass('active');
    }
   
  }

getNegoMature(val){
  const params ={
  
    "quotationId":val.quotationId,
    "transactionId":val.transactionId
  
 }
 this.nts.getTransQuotationDtlByQuotationId(params).subscribe(
  (response) => {
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

  getQuotes(val){
const data = {
  "transactionId": val.transactionId,
 }

 const params ={
  
    "quotationId":val.quotationId,
    "transactionId":val.transactionId
  
 }
 this.nts.getTransQuotationDtlByQuotationId(params).subscribe(
  (response) => {
    var str = JSON.parse(JSON.stringify(response)).status; 
    console.log(str)

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
    this.nts.getQuotationOfAcceptedQuote(data).subscribe(
      (response) => {
          if(JSON.parse(JSON.stringify(response)).data==null){
          this.quotes="";    
            }else{
              this.quotes=JSON.parse(JSON.stringify(response)).data;
              var str = JSON.parse(JSON.stringify(response)).status; 
              console.log(str)
    var splittedNego = str.split(",", 1); 
    var nego=splittedNego[0].split(":", 2)
    this.quotes.confChgsIssuanceToNegot=nego[1];

    var splittedMature = str.split(",", 2); 
    var mature=splittedMature[1].split(":", 2)
    this.quotes.confChgsIssuanceToMatur=mature[1];

    var splittedtilldate = str.split(",", 3); 
    var td=splittedtilldate[2].split(":", 2)
    this.quotationdata.confChgsIssuanceToexp=td[1];

    var splittedClaimDate = str.split(",", 4); 
    var tcd=splittedClaimDate[3].split(":", 2)
    this.quotationdata.confChgsIssuanceToClaimExp=tcd[1];
          }
         
      },
      (error) => {
            }
    )
    
  }

  changeStatusCall(status) {
    this.getAllnewTransactions(status,sessionStorage.getItem('userID'));

  }

  
  openOffcanvas(status) {

    if (status === "Accepted") {
        document.getElementById("menu-barDetailnew").style.width = "510px";
    }else if (status === "Expired") {
      document.getElementById("menuDetailsExpired").style.width = "520px";
    } else if (status === "Rejected") {
      document.getElementById("menubarDetailrejected").style.width = "510px";
    }  else if (status === "Withdrawn") {
      document.getElementById("menuDetailsWithdrawn").style.width = "510px";
    } 

  }
  openNav3() {

    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";
  }
  closeOffcanvas() {
    document.getElementById("menu-barDetailnew").style.width = "0%";
    document.getElementById("menuDetailsExpired").style.width = "0%";
    document.getElementById("menubarDetailrejected").style.width = "0%";
    document.getElementById("menuDetailsWithdrawn").style.width = "0%";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  }
  showProForma(file) {
    $('#myModal91').show();
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
          convertbase64toArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
              bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
          }
  download(){
    var str = this.fileData; 
    var splittedStr = str.split(" |", 2); 
    var data=splittedStr[1];
    var  base64string = data;
    
    var filename=splittedStr[0].toLowerCase();
    var ext = filename.split("."); 
    //var extension='.'+ext[1];
    var extension='.'+ext[ext.length-1];
    if(extension=='.xlsx'){
    var  base64string= base64string.replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      FileSaver.saveAs(blob, filename);
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
      this.imgDownload=false;

    }  
     else if(extension=='.docx'){
        base64string= base64string.replace('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        FileSaver.saveAs(blob,filename);
        this.imgDownload=false;

    }
     else if(extension=='.csv'){
            base64string= base64string.replace('data:application/vnd.ms-excel;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'application/vnd.ms-excel' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=false;

          }
          else if(extension=='.jpeg' || extension=='.jpg' || extension=='.png' || extension=='.svg'){
            base64string= base64string.replace('data:image/jpeg;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/jpeg' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=true;

          }               
          else if(extension=='.tiff'){
            base64string= base64string.replace('data:image/tiff;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/tiff' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=true;

          }  
              }
              
  openDocument(file){
    $('#myModal91').show();
    this.document = file;
  }
  close() {
    $('#myModal91').hide();
  }

  onSubmit() {
    $("#selectReason").val(null);
  }

  rejectBankQuote(quoteId,statusReason) {

    $('#myModalReject').hide();
    $('.modal-backdrop').hide();
    let data = {
       "userId": sessionStorage.getItem('userID'),
      "statusReason": statusReason
    }
   
    this.nts.custRejectBankQuote(data, quoteId).subscribe(
      (response) => {
        // this.closeOffcanvas();
        $("#confirmRejection").show(); // new
        // this.getAllnewTransactions('Rejected',sessionStorage.getItem('userID'));
        // $('#addOptions select').val('Rejected').change();

      },
      (err) => { }
    )
  }

  closeRejected(){  
    this.quotes = false;  
    $("#confirmRejection").hide();
    this.closeOffcanvas();
    // $("#")
    this.getAllnewTransactions('Rejected',sessionStorage.getItem('userID'));
    $('#addOptions select').val('Rejected').change();
   
    let userid=sessionStorage.getItem('userID')
    this.getAllnewTransactions('Rejected',userid);
    custTrnsactionDetail();
    this.closeOffcanvas();
    $('#addOptions select').val('Rejected').change();
  }

  onCloseTransactionPopup(record,val){
    if(val == "Close"){
      $("#closeReasonForQuote").val("");
      $("#closePopupForQuote").show();
      this.openNav3();
      this.forCloseTransactionId = record.transactionId;
      this.forCloseUserId=record.userId;
    }
  }

  onClosePopDismiss(){
    $("#closePopupForQuote").hide();
    this.closeOffcanvas();
    $('#closedStatus'+this.forCloseTransactionId).val("Open").change();
  }


  onClickOk(){
    this.closeOffcanvas();
    $("#closePopupForQuote").hide();
    $("#closeTranx").hide();        
    this.getAllnewTransactions('Accepted',sessionStorage.getItem('userID'));
    custTrnsactionDetail();
  }
  closedTransaction() {
      var request = {
        "transactionId":this.forCloseTransactionId,
        "userId":this.forCloseUserId,
        "statusReason":$("#closeReasonForQuote").val()
      }
      this.nts.custCloseTransaction(request).subscribe(
        (response) => {
        // this.closeOffcanvas();
         $("#closePopupForQuote").hide();
        this.closedTranMsg="Transaction closed successfully"
        $("#closeTranx").show();
        
        // this.getAllnewTransactions('Accepted',sessionStorage.getItem('userID'));
        // custTrnsactionDetail();
        },
        (err) => { }
      )
  }
  selectSubsidiaries(val: any) {
  
    this.selectedSub=val;
    this.getAllnewTransactions(this.currentStatus,this.selectedSub)
}

downloadExcel(){

  const data= {
    "bankUserId":this.user_ID,
    "quotationStatus": this.currentStatus
  }

  this.report.downloadExcelReportForBankTransaction(data).subscribe((response)=>{
console.log()
  })
  }

// new
  displayQuoteDetails(transactionId, reqType) {
    
    let data = {
      "userId": sessionStorage.getItem('userID'),
      "transactionId": transactionId,
      "quotationStatus": $('#addOptions select').val()
    }

    this.nts.getQuotationDetails(data).subscribe(
      (response) => {
       
       // this.quotationdata = "";
        console.log(JSON.parse(JSON.stringify(response)).data[0])
        if(JSON.parse(JSON.stringify(response)).data[0])
        this.quotationdata = JSON.parse(JSON.stringify(response)).data[0];   
        // else 
        // this.quotationdata = null;
        
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

        this.quotationReqType = reqType;
        if(this.quotationdata.termConditionComments=='null'){
          this.quotationdata.termConditionComments='';
        } if(this.quotationdata.chargesType=='null'){
          this.quotationdata.chargesType='';
        } if(this.quotationdata.commentsBenchmark=='null'){
          this.quotationdata.commentsBenchmark='';
        }

    

      },
      (error) => { }
    )
  }
  getDistributionBank(data){
    this.nts.getDistributingBank(data).subscribe(
      (response) => {
        this.bankDetails = JSON.parse(JSON.stringify(response)).data;
        this.bankName= this.bankDetails[0].bankName;
        console.log(this.bankName);
      },
      error => {
        alert('error')
      }
    )
  }
} 