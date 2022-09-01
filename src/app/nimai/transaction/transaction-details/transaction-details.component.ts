import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import * as $ from 'src/assets/js/jquery.min';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import * as FileSaver from 'file-saver';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ReportsService } from 'src/app/services/reports.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent {
    @ViewChild(DashboardComponent, { static: false }) dashboard: DashboardComponent;

  public ntData: any[] = [];
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public data: any=[];
  public specificDetail: any = "";
  quotationdata: any = "";
  document: any = "";
  selectReason: any;
  selectOther:any
  public parentURL: string = "";
  public subURL: string = "";
  dataSourceLength: boolean = false;
  quotationReqType: string;
  onReject: boolean = false;
  NotAllowed: boolean = true;
  forCloseTransactionId: any = "";
  showTransactionStatusCol: boolean = true;
  acceptedStatus: boolean = true;
  rejectedStatus:boolean=true;
  cancelledStatus:boolean=true;
  expiredStatus :boolean=true;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  public detailInfo: any = "";
  public rejectReason:string=""
  isUploadNoDoc: boolean=false;
  imgDownload: boolean=false;
  fileData: any;
  hasNoRecordmain: boolean;
  usercode: any;
  subsidiaries: any;
  selectedSub: any;
  currentStatus: string;
  nimaiCount: any;
  getcountEmail: any="";
  disablesubsi: boolean;
  disableUserCode: boolean;
  accountType: string;
  selectedUCode: string="";
  usersid: string;
  creditCount: any;
  emailid: string;
  creditCounts: any="";
  showOthers: boolean;
  emailId: string;
  user_ID: any;
  isDownloadORview: string;
  rejectedBy: boolean= true;
  currentDateTime: any;
  showQuote: boolean=true;
  showDate: boolean=false;
  afterSevenDates: string;
  CurrentDate: string;
  wrongDate: boolean;
  accutalDate: boolean;

  constructor(public psd: PersonalDetailsService,public report :ReportsService,public getCount: SubscriptionDetailsService,public titleService: TitleService, public nts: NewTransactionService, public activatedRoute: ActivatedRoute, public router: Router, public upls: UploadLcService) {
    this.titleService.quote.next(false);
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
          }

  ngOnInit() {
    this.CurrentDate=  formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.accountType=sessionStorage.getItem('accountType')
    let userid=sessionStorage.getItem('userID')
    this.getAllnewTransactions('Accepted',userid,'All'+userid);
    this.getSubsidiaryData();
    
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
     getNimaiCount(){
      if(sessionStorage.getItem('branchUserEmailId')==null || sessionStorage.getItem('branchUserEmailId')==undefined){
        this.emailid=""
      }else{
        this.emailid=sessionStorage.getItem('branchUserEmailId')
      }
     let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress":this.emailid
    }

    this.getCount.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
      response => {        
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
        this.creditCounts=this.nimaiCount.lc_count-this.nimaiCount.lcutilizedcount;
        this.nts.creditCount.next(this.creditCounts)
        if(this.nimaiCount.accountstatus.toLowerCase()=='inactive'){
          sessionStorage.clear();
          this.router.navigate(['/']);
        }
      })
    }
  public getAllnewTransactions(status,userid,useridOnLoad) {
    console.log(userid, useridOnLoad);
  this.user_ID=useridOnLoad
    if (status == "Rejected") {
      this.onReject = true;
      this.NotAllowed = true;
      this.rejectedStatus=true;
      this.acceptedStatus = false;
      this.expiredStatus=false;
      this.cancelledStatus=false;
    }
    else if(status == "Expired") {
      this.onReject = false;
      this.NotAllowed = false;
      this.expiredStatus=true;
      this.rejectedStatus=false;
      this.acceptedStatus = false;
      this.cancelledStatus=false;
    }
    else if(status == "Accepted") {
      this.onReject = false;
      this.NotAllowed = true;
      this.rejectedStatus=false;
      this.acceptedStatus = true;
      this.expiredStatus=false;
      this.cancelledStatus=false;
    }else if(status=="Cancelled"){
      this.cancelledStatus=true;
      this.onReject = true;
      this.NotAllowed = false;
      this.rejectedStatus=false;
      this.acceptedStatus = false;
      this.expiredStatus=false;
    }
    this.currentStatus=status
    
    var userIdDetail = sessionStorage.getItem('userID');
   // var emailId ="";
    this.emailId = sessionStorage.getItem('branchUserEmailId');
    if (userIdDetail.startsWith('BC')) {
      this.disablesubsi=true;
    }
    if(this.selectedUCode){
  this.emailId=this.selectedUCode
    }
    this.accountType=sessionStorage.getItem('accountType')
    if(this.accountType=='Passcode'){
   this.usersid=""
    }else{
      this.usersid=useridOnLoad
    }
    const data = {
      "userId": this.usersid,
      "transactionStatus": this.currentStatus,
      "branchUserEmail": this.emailId
    }
     this.nts.getTxnForCustomerByUserIdAndStatus(data).subscribe(
      (response) => {
        custTrnsactionDetail();
       this.data=[];

        this.data = JSON.parse(JSON.stringify(response)).data;
        console.log(this.data, ' data');
if(this.data){
  this.hasNoRecord=true;
}       

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
      },
      (error) => {       
        custTrnsactionDetail();
        this.data=[];      }
    )
    this.getUsercodeData(userid);
    this.selectedUCode="";
  }

  rejectedReasons(reason){
    this.rejectReason=reason;
  }
  getDetail(detail,status,transactionId) {
    this.getNimaiCount();
    this.displayDetails(transactionId);
    this.specificDetail = detail;
   console.log(this.specificDetail)
    if(status=='Accepted'){
      $('.activeTab').removeClass('active');
      $('#menu-barnew li:first').addClass('active');
      $('.tab-content #pill111').addClass('active');

    }
    else if(status=='Rejected'){
      $('.activeTab').removeClass('active');
      $('#menubarDetailreject li:first').addClass('active');
      $('.tab-content #pill112').addClass('active');

    }
    else if(status=='Expired'){  
      $('.activeTab').removeClass('active');   
      $('#menubarDetailexpired li:first').addClass('active');
      $('.tab-content #pill131').addClass('active');

    }
     else if(status=='Cancelled'){
      $('.activeTab').removeClass('active');
      $('#menubarDetailcancel li:first').addClass('active');
      $('.tab-content #pill141').addClass('active');

    }
     
  }
isOther(selected){
if(selected=="Others"){
 this.showOthers=true;
}else{
  this.showOthers=false;
}

}
 
  changeStatusCall(status) {
let userid="All"+ sessionStorage.getItem('userID')
    this.getAllnewTransactions(status,this.selectedSub,userid);
    
  }

  displayDetails(transactionId){
    let data = {
      "transactionId": transactionId,
    }
    this.nts.getSpecificTxnDetailByTxnId(data).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response)).data;
        var strsplit=this.detailInfo.validity.split('T',2)
        this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US')            
          var futureDate = new Date(this.detailInfo.validity);
  futureDate.setDate(futureDate.getDate() + 7);
  this.afterSevenDates =formatDate(futureDate, "yyyy-MM-dd", 'en-US')   
  console.log(this.afterSevenDates+" kjkjk "+this.currentDateTime)
        if( this.currentDateTime > this.afterSevenDates){
          this.showDate=true;
        }else{
          this.showDate=false;
        }

        if( this.detailInfo.lcProForma==null ||  this.detailInfo.lcProForma=="" ||  this.detailInfo.lcProForma==undefined){
          this.noFileDisable=false;
          this.viewDisable=true;
    
         }else{    
          this.viewDisable=false;
          this.noFileDisable=true;
         }
         if(this.detailInfo.tenorFile){
          this.isUploadNoDoc=false;
        }else{
          this.isUploadNoDoc=true;
        }
   console.log('this.rejectedBy',this.rejectedBy)
   if(strsplit[0]>=this.currentDateTime ){
         
    this.accutalDate=true;
    }else{
      this.accutalDate=false;
    
    }

        if(this.detailInfo.rejectedBy == null ||this.detailInfo.rejectedBy.toLowerCase() == 'customer' ||this.detailInfo.rejectedBy.toLowerCase() == 'bank'
          )
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
      },
      (error) => { }
    )
    
  }

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
  openDocument(file){
    $('#myModal9').show();
    this.document = file;
  }

  openOffcanvas(status) {
    if (status === "Accepted") {
      document.getElementById("menu-barnew").style.width = "600px";
  }else if (status === "Expired") {
    document.getElementById("menubarDetailexpired").style.width = "600px";
  } else if (status === "Rejected") {
    document.getElementById("menubarDetailreject").style.width = "600px";
  } else if (status === "Cancelled") {
    document.getElementById("menubarDetailcancel").style.width = "600px";
  } 

  }
  
  openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";
  }
  closeOffcanvas() {
    document.getElementById("menubarDetailexpired").style.width = "0%";
    document.getElementById("menubarDetailreject").style.width = "0%";
    document.getElementById("menubarDetailcancel").style.width = "0%";
    document.getElementById("menu-barnew").style.width = "0%";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
    $('.modal-backdrop').hide();
    this.wrongDate = false;

  }
  showProForma(file) {
    $('#myModal9').show();
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
  close() {
    $('#myModal9').hide();
 
    //$('#confirmRejection').hide();


  }
  closeReject(){
    $('#myModal5').hide();
  }
  closeRejected(){    
    $("#confirmRejection").hide();

    this.getNimaiCount();
    let userid=sessionStorage.getItem('userID')
    this.getAllnewTransactions('Rejected',userid,userid);
    custTrnsactionDetail();
    this.closeOffcanvas();
    $('#addOptions select').val('Rejected').change();
  }
  
  onSubmit() {
    $("#selectReason").val(null);
   
  }

  rejectBankQuote(quoteId, transactionID,statusReason) {
    $('#myModal5').hide();
    $('.modal-backdrop').hide();
//     alert(this.selectOther)
//     console.log(  $("#selectOther").val())

// if(this.showOthers){
//   statusReason=this.selectOther
// }
    //var statusReason = $("#rejectReason option:selected").text();
    let data = {
      "userId": sessionStorage.getItem('userID'),
      "statusReason": statusReason
    }
    let emailBody = {
      "transactionid": transactionID,
      "userId": sessionStorage.getItem('userID'),
      "event": "LC_REJECT"
    }
    this.nts.custRejectBankQuote(data, quoteId).subscribe(
      (response) => {
        $("#confirmRejection").show();

        //       this.getNimaiCount();
        // let userid=sessionStorage.getItem('userID')
        // this.getAllnewTransactions('Rejected',userid,userid);
        // custTrnsactionDetail();
        // this.closeOffcanvas();
        // $('#addOptions select').val('Rejected').change();
      },
      (err) => { }
    )
  }
  refreshPage(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/transaction-details`]);
  });
  }

  
  cloneTransaction(transactionId) {
    this.getNimaiCount();
    const navigationExtras: NavigationExtras = {
      state: {
        redirectedFrom: "cloneTransaction",
        trnsactionID: transactionId
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
  }

updatedDateOK(){
  
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
});
}

  reOpenTransaction(transactionId) {
    if ($('#addOptions select').val() == "Rejected") {
      var data = {
        "transactionId": transactionId,
        "userId": sessionStorage.getItem('userID'),
      }

      this.nts.custReopenTransaction(data).subscribe(
        (response) => {
          $('#reOpenPopup').hide();
          $('.modal-backdrop').hide();
          this.closeOffcanvas();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
        });
        },
        (err) => { }
      )
    }
  }
  

  onCloseTransactionPopup(record,val){
    console.log(val)
    if(val == "Close"){
      $("#closeReason").val("");
      $("#closePopup").show();
      this.openNav3();
      this.forCloseTransactionId = record.transactionId;
    }
  }



  onClosePopDismiss(){
    $("#closePopup").hide();
    this.closeOffcanvas();
    $('#closedTrans'+this.forCloseTransactionId).val("Open").change();
  }

  closedTransaction() {
      var request = {
        "transactionId":this.forCloseTransactionId,
        "userId":sessionStorage.getItem('userID'),
        "statusReason":$("#closeReason").val()
      }
      this.nts.custCloseTransaction(request).subscribe(
        (response) => {
        this.closeOffcanvas();
        $("#closePopup").hide();
let userid=sessionStorage.getItem('userID')
        this.getAllnewTransactions('Accepted',userid,userid);
        custTrnsactionDetail();
        },
        (err) => { }
      )
  }
  selectSubsidiaries(val: any) {
    this.selectedSub=val;
    this.getAllnewTransactions(this.currentStatus,this.selectedSub,this.selectedSub);
}
selectUsercode(val: any) {
  console.log(val);
  console.log(this.currentStatus, this.selectedSub);
  this.selectedUCode=val;
  this.selectedSub=""
  this.getAllnewTransactions(this.currentStatus,this.selectedSub,this.selectedSub)
}

downloadExcel(){

  const data= {
    "bankUserId":this.user_ID,
    "quotationStatus": "Placed"
  }

  this.report.downloadExcelReportForBankTransaction(data).subscribe((response)=>{
console.log(response)
  })
  }


  updateValidityDate(val_date,transaction_id){
    console.log(val_date);
    let newdate = formatDate(val_date,"yyyy-MM-dd", 'en-US');
    console.log(newdate);
    console.log(this.CurrentDate);
    if( newdate < this.CurrentDate ) {
      this.wrongDate =true;
      console.log(' im wrong');
    }else{
      this.wrongDate = false;
      console.log(' im correct');
    const data={
      "transactionId":transaction_id,
      "validity":val_date
    }
this.nts.updateTransactionValidity(data).subscribe((res)=>{
$('#updateValidityDate').show();
})

  }
}

}