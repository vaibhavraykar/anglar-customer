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
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { ReportsService } from 'src/app/services/reports.service';
import { formatDate } from '@angular/common';
// import { time } from 'console';
@Component({
  selector: 'app-second-transaction-details',
  templateUrl: './second-transaction-details.component.html',
  styleUrls: ['./second-transaction-details.component.css']
})
export class SecondTransactionDetailsComponent  {
  @ViewChild(DashboardComponent, { static: true }) dashboard: DashboardComponent;

  public ntData: any[] = [];
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public data: any=[];
  public specificDetail: any = "";
  quotationdata: any = "";
  quotationdataold: any[]=[];
  quotationdatanew:any[] = [];
  quotationdatanewindex:any = [];
  quotationdataoldindex:any = [];
  // quotationdataarray: any =[];
  rejectedarray:any ;
  expiredarray:any ="";
  acceptedarray:any ;
  // quotationdatas: any ="";
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
  public detailInfonew: any = "";
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
  record: any;
  quotes:boolean;
  newquotes = true;
  bankDetails:any =[];
  bankName:any;
  wrongDate: boolean;
  accutalDate: boolean;
  newArray: any = [];
  isrejected: boolean = true;
  isExpired: boolean;
  isExpiredno: number;
  isRejectedno: number;
  notExpiredno: number;
  notRejectedno: number;
  notAcceptedno: number;

  notExpired: boolean;
  notRejected: boolean = true;
  notAccepted: boolean;

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
        console.log(this.nimaiCount.accountstatus);
        if(this.nimaiCount.accountstatus.toLowerCase()=='inactive'){
          sessionStorage.clear();
          this.router.navigate(['/']);
        }
      })
    }
  public getAllnewTransactions(status,userid,useridOnLoad) {
    
    console.log(userid)
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
       console.log(this.data);
        this.data = JSON.parse(JSON.stringify(response)).data;
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
    debugger
    this.getNimaiCount();
    this.displayDetails(transactionId);
    this.specificDetail = detail;
   console.log(this.specificDetail);

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
    this.newquotes = false;
    this.nts.getSpecificTxnDetailByTxnId(data).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response)).data;
        console.log(this.detailInfo);
        this.getDistributionBank(this.detailInfo.userId);
        var strsplit=this.detailInfo.validity.split('T',2)
        console.log(strsplit);
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
  //  for check time
              if(strsplit[0]>=this.currentDateTime){
                console.log(' im here');
                this.accutalDate = true;
              }else{
                this.accutalDate = false;
                console.log(' i m not here');
              }
        if(this.detailInfo.rejectedBy == null || this.detailInfo.rejectedBy.toLowerCase() == 'customer' ||this.detailInfo.rejectedBy.toLowerCase() == 'bank'
       )
        //  || this.detailInfo.rejectedBy.toLowerCase() == null
        {
          this.showQuote=true;
          if(strsplit[0]>=this.currentDateTime ){
         console.log(' im here');
            this.rejectedBy=true;
            }else{
              console.log(' i m rejected')
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

  // displayQuoteDetails(transactionId, reqType) {
  //   let data = {
  //     "userId": sessionStorage.getItem('userID'),
  //     "transactionId": transactionId,
  //     "quotationStatus": $('#addOptions select').val()
  //   }

  //   this.nts.getAcceptedQuoteId(data).subscribe(
  //     (response) => {
       
  //      // this.quotationdata = "";
  //       console.log(JSON.parse(JSON.stringify(response)).data[0])
  //       if(JSON.parse(JSON.stringify(response)).data[0])
  //       this.quotationdata = JSON.parse(JSON.stringify(response)).data[0];   
  //       console.log(this.quotationdata);
  //       // else 
  //       // this.quotationdata = null;
  //       var str = JSON.parse(JSON.stringify(response)).status; 
  //       var splittedNego = str.split(",", 1); 
  //       var nego=splittedNego[0].split(":", 2)
  //       this.quotationdata.confChgsIssuanceToNegot=nego[1];

  //       var splittedMature = str.split(",", 2); 
  //       var mature=splittedMature[1].split(":", 2)
  //       this.quotationdata.confChgsIssuanceToMatur=mature[1];

  //       var splittedtilldate = str.split(",", 3); 
  //       var td=splittedtilldate[2].split(":", 2)
  //       this.quotationdata.confChgsIssuanceToexp=td[1];
    
  //       var splittedClaimDate = str.split(",", 4); 
  //       var tcd=splittedClaimDate[3].split(":", 2)
  //       this.quotationdata.confChgsIssuanceToClaimExp=tcd[1];

  //       this.quotationReqType = reqType;
  //       if(this.quotationdata.termConditionComments=='null'){
  //         this.quotationdata.termConditionComments='';
  //       } if(this.quotationdata.chargesType=='null'){
  //         this.quotationdata.chargesType='';
  //       } if(this.quotationdata.commentsBenchmark=='null'){
  //         this.quotationdata.commentsBenchmark='';
  //       }

    

  //     },
  //     (error) => { }
  //   )
  // }
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
    this.quotes = false;
    document.getElementById("menubarDetailexpired").style.width = "0%";
    document.getElementById("menubarDetailreject").style.width = "0%";
    document.getElementById("menubarDetailcancel").style.width = "0%";
    document.getElementById("menu-barnew").style.width = "0%";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
    $('.modal-backdrop').hide();
    this.wrongDate = false;
    // this.isrejected = false;
    // this.isExpired = false;
    // this.notExpired = false;
    // this.notRejected = false;
    // this.notAccepted = false;
    // this.isRejectedno = 1;
    // this.isExpiredno = 1;
    // this.notAcceptedno =1 ;
    // this.notExpiredno = 0;
    // this.notRejectedno = 0;
    this.newArray = [];
  this.closeofQuotes();
  }

closeofQuotes(){
  this.isrejected = true;
  this.isExpired = false;
  this.notExpired = false;
  this.notRejected = true;
  this.notAccepted = false;
  this.isRejectedno = 1;
  this.isExpiredno = 1;
  this.notAcceptedno =1 ;
  this.notExpiredno = 0;
  this.notRejectedno = 0;
  console.log( this.notRejectedno,this.notAcceptedno,this.isRejectedno); 
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
    this.quotes = false;
    $('#myModal9').hide();
 
    //$('#confirmRejection').hide();


  }
  closeReject(){
    this.quotes = false;
    $('#myModal5').hide();
  }
  closeRejected(){  
    this.quotes = false;  
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
      this.router.navigate([`/${this.subURL}/${this.parentURL}/secondary-transaction-details`]);
  });
  // this.router.navigate([`/${this.subURL}/${this.parentURL}/secondary-transaction-details`]);
  // this.ngOnInit();
  // async reload(url: string): Promise<boolean> {
  //    this.router.navigateByUrl('/', { skipLocationChange: true });
  //   return this.router.navigate([`/${this.subURL}/${this.parentURL}/secondary-transaction-details`]);
  // // }
 
  
  }

  
  cloneTransaction(transactionId) {
    this.getNimaiCount();
    const navigationExtras: NavigationExtras = {
      state: {
        redirectedFrom: "cloneTransaction",
        trnsactionID: transactionId
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}/new-secondary-transaction`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
  }

updatedDateOK(){
  
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    // this.router.navigate([`/${this.subURL}/${this.parentURL}/secondary-transaction-details`]);
    this.router.navigate([`/${this.subURL}/${this.parentURL}/active-secondary-transaction`]);
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
            this.router.navigate([`/${this.subURL}/${this.parentURL}/secondary-transaction-details`]);
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


// new api
displayQuoteDetails(transactionId, reqType) {
  this.newquotes = true;
  if ($('#addOptions select').val() === 'Accepted')
  {
    console.log(' im in accepted section');
    // var newArray=[];
  // var rejectedarray: any = "";
  // var expiredarray: any = "";
  // var acceptedarray: any = "";
  console.log( this.notRejectedno,this.notAcceptedno,this.isRejectedno); 
  let data2 = {
    "userId": sessionStorage.getItem('userID'),
    "transactionId": transactionId,
    // "quotationStatus": $('#addOptions select').val()
    "quotationStatus": "Rejected"
  }

  this.nts.getAcceptedQuoteId(data2).subscribe(
    (response) => {
     
     // this.quotationdata = "";
      console.log(JSON.parse(JSON.stringify(response)).data)
      if(JSON.parse(JSON.stringify(response)).data === null){
        console.log(' i m null');
        this.isrejected = false;
        this.isRejectedno = 0;
      }
      if(JSON.parse(JSON.stringify(response)).data != null){
      this.rejectedarray = JSON.parse(JSON.stringify(response)).data; 
      // rejectedarray = JSON.parse(JSON.stringify(response)).data; 
        this.notRejected = false;
        this.notRejectedno = 1;
      console.log("i m not null ",this.rejectedarray);
      }
    },
    (error) => { }
  )


  // let data1 = {
  //   "userId": sessionStorage.getItem('userID'),
  //   "transactionId": transactionId,
  //   "quotationStatus": "Expired"
  //   // "quotationStatus": $('#addOptions select').val()
    
  // }

  // this.nts.getAcceptedQuoteId(data1).subscribe(
  //   (response) => {
     
  //    // this.quotationdata = "";
  //     console.log(JSON.parse(JSON.stringify(response)).data)
  //     if(JSON.parse(JSON.stringify(response)).data === null){
  //       console.log(' i m null');
  //       this.isExpired = true;
  //       this.isExpiredno = 0;
  //     }
  //     if(JSON.parse(JSON.stringify(response)).data != null){
  //     // this.quotationdata = JSON.parse(JSON.stringify(response)).data;
  //        this.expiredarray = JSON.parse(JSON.stringify(response)).data;  
  //       // expiredarray = JSON.parse(JSON.stringify(response)).data; 
  //       // console.log(expiredarray); 
  //       console.log(this.expiredarray); 
  //       this.notExpired = true;
  //       this.notExpiredno = 1;  
  //   }
  // },
  //   (error) => { }
  // )
 
  let data = {
    "userId": sessionStorage.getItem('userID'),
    "transactionId": transactionId,
    // "quotationStatus": "Rejected"
    "quotationStatus": $('#addOptions select').val()
  }

  this.nts.getAcceptedQuoteId(data).subscribe(
    (response) => {
     
     // this.quotationdata = "";
      console.log(JSON.parse(JSON.stringify(response)).data)
      if(JSON.parse(JSON.stringify(response)).data)
      // this.notAccepted= true;
      // this.notAcceptedno = 0;
      // this.quotationdata = JSON.parse(JSON.stringify(response)).data;
      this.acceptedarray = JSON.parse(JSON.stringify(response)).data;
      // acceptedarray = JSON.parse(JSON.stringify(response)).data;
      //  console.log(acceptedarray);
      console.log(this.acceptedarray);
      // let quotationdatareject = this.quotationdatanew[0];   
      // console.log(this.quotationdatanew[0]);
      
      // console.log(this.quotationdataarray.push(this.quotationdatanew));
      // console.log(this.quotationdataarray);
      // this.quotationdataarray.push(this.quotationdatanew);
      // quotationdataarray.push(quotationdatareject);
      // quotationdataarray.concat(this.quotationdatanew);
      // console.log(quotationdataarray);


      // for(var i = 1; i <= this.quotationdatanew.length ; i++){
      //   this.quotationdataarray.push(this.quotationdatanew[i]);
      // }
      // // else 
      // this.quotationdata = null;
// if(this.isrejected = true && this.notExpired == true)
// if(this.notAcceptedno == 0 && this.notExpiredno == 1 && this.isRejectedno == 0)
// {
//   this.newArray = this.acceptedarray.concat(this.expiredarray);
//   // this.newArray = acceptedarray.concat(expiredarray);
//   console.log(this.newArray);
//   console.log( ' i m in rejeted section array')
//    this.quotationdata= this.newArray; 
//   console.log(this.quotationdata);
// } 
if (this.isrejected == false)
// if (this.isRejectedno == 0 && this.notAcceptedno == 0)
{
  this.quotationdata =   this.acceptedarray;
  // this.quotationdata =   acceptedarray;
  console.log(this.newArray);
  console.log(' i m in accpeted section in new array')
  // console.log(this.expiredarray);
  //  this.quotationdata= this.newArray; 
  console.log(this.quotationdata);
}
if(this.notRejected != true)
// if(this.notRejectedno == 1 && this.notAcceptedno == 0 )
{
  console.log('All data is present')
  this.newArray =  this.acceptedarray.concat(this.rejectedarray);
  // this.newArray =  acceptedarray.concat(rejectedarray);
  console.log(this.newArray);
  // console.log(this.expiredarray);
   this.quotationdata= this.newArray; 
  console.log(this.quotationdata); 
}
      
      // this.newArray = this.expiredarray.concat(this.rejectedarray, this.acceptedarray);
      // console.log(this.newArray);
      //  this.quotationdata= this.newArray; 
      // console.log(this.quotationdata);

  

    },
    (error) => { }
  )
  console.log( this.notRejectedno,this.notAcceptedno,this.isRejectedno); 
  // if(this.rejectedarray != 5678){

  // newArray = this.expiredarray.concat(this.rejectedarray, this.acceptedarray);
  // console.log(newArray);
  //  this.quotationdata= newArray; 
  // console.log(this.quotationdata);
  // }
  }

  

// for experied Section

  if ($('#addOptions select').val() === 'Expired'){
 console.log(' im experied')
 let data = {
  "userId": sessionStorage.getItem('userID'),
  "transactionId": transactionId,
  // "quotationStatus": "Rejected"
  "quotationStatus": $('#addOptions select').val()
}

this.nts.getAcceptedQuoteId(data).subscribe(
  (response) => {
   
   // this.quotationdata = "";
    console.log(JSON.parse(JSON.stringify(response)).data)
    if(JSON.parse(JSON.stringify(response)).data)
    this.quotationdata = JSON.parse(JSON.stringify(response)).data;
    
    
    console.log(this.quotationdata);
  },
  (error) => { }
)
  }
 //  for Rejected section
 if ($('#addOptions select').val() === 'Rejected'){
  console.log(' im rejected')
  let data = {
   "userId": sessionStorage.getItem('userID'),
   "transactionId": transactionId,
   // "quotationStatus": "Rejected"
   "quotationStatus": $('#addOptions select').val()
 }
 
 this.nts.getAcceptedQuoteId(data).subscribe(
   (response) => {
    
    // this.quotationdata = "";
     console.log(JSON.parse(JSON.stringify(response)).data)
     if(JSON.parse(JSON.stringify(response)).data)
     this.quotationdata = JSON.parse(JSON.stringify(response)).data;
     
     
     console.log(this.quotationdata);
   },
   (error) => { }
 )
   }

  //  for cancelled Section
  if ($('#addOptions select').val() === 'Cancelled'){
    console.log(' im Cancelled')
    let data = {
     "userId": sessionStorage.getItem('userID'),
     "transactionId": transactionId,
     // "quotationStatus": "Rejected"
     "quotationStatus": $('#addOptions select').val()
   }
   
   this.nts.getAcceptedQuoteId(data).subscribe(
     (response) => {
      
      // this.quotationdata = "";
       console.log(JSON.parse(JSON.stringify(response)).data)
       if(JSON.parse(JSON.stringify(response)).data)
       this.quotationdata = JSON.parse(JSON.stringify(response)).data;
       
       
       console.log(this.quotationdata);
     },
     (error) => { }
   )
     }

    //  if ($('#addOptions select').val() === 'Accepted'){
    //   // var newArray =[];
    //   this.newArray = this.expiredarray.concat(this.rejectedarray, this.acceptedarray);
    //   console.log(this.newArray);
    //    this.quotationdata= this.newArray; 
    //   console.log(this.quotationdata);
    // }
}

getDetailbyQuates(detail,status,transactionId) {
  debugger
  this.getNimaiCount();
  this.displayDetails(transactionId);
  this.specificDetail = detail;
 console.log(this.specificDetail);
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

displayDetailsbyQutes( record,transactionId){
  console.log(record);
  // console.log(record[0]);
  // var newrecord = record[0];
  // console.log(newrecord),
  this.quotes = !this.quotes;
  this.newquotes = false;
  var transactionIDnew = transactionId
    console.log(transactionIDnew);
  let data = {
    "userId": sessionStorage.getItem('userID'),
    "transactionId": transactionIDnew,
    "quotationStatus": $('#addOptions select').val(),
    "quotationId": record,
    // "quotationId": newrecord,
  }
  this.nts.getSecQuoteByUserIdTxnIdStatus(data).subscribe(
    (response) => {
      this.detailInfonew = JSON.parse(JSON.stringify(response)).data[0];
      
      console.log(this.detailInfonew.transactionId);
      var strsplit=this.detailInfonew.validity.split('T',2)
      this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US')            
        var futureDate = new Date(this.detailInfonew.validity);
futureDate.setDate(futureDate.getDate() + 7);
this.afterSevenDates =formatDate(futureDate, "yyyy-MM-dd", 'en-US')   
console.log(this.afterSevenDates+" kjkjk "+this.currentDateTime)
      if( this.currentDateTime > this.afterSevenDates){
        this.showDate=true;
      }else{
        this.showDate=false;
      }

      if( this.detailInfonew.lcProForma==null ||  this.detailInfonew.lcProForma=="" ||  this.detailInfonew.lcProForma==undefined){
        this.noFileDisable=false;
        this.viewDisable=true;
  
       }else{    
        this.viewDisable=false;
        this.noFileDisable=true;
       }
       if(this.detailInfonew.tenorFile){
        this.isUploadNoDoc=false;
      }else{
        this.isUploadNoDoc=true;
      }
 console.log('this.rejectedBy',this.rejectedBy)

      if(this.detailInfonew.rejectedBy.toLowerCase() == 'customer' ||this.detailInfonew.rejectedBy.toLowerCase() == 'bank'
       ||this.detailInfonew.rejectedBy.toLowerCase() == null )
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
  
  let data1 = {
    "userId": sessionStorage.getItem('userID'),
    "transactionId": transactionIDnew,
    "quotationStatus": "Rejected",
    // "quotationStatus": $('#addOptions select').val(),
    "quotationId": record,
    // "quotationId": newrecord,
  }
  this.nts.getSecQuoteByUserIdTxnIdStatus(data1).subscribe(
    (response) => {
      this.detailInfonew = JSON.parse(JSON.stringify(response)).data[0];
      
      console.log(this.detailInfonew.transactionId);
      var strsplit=this.detailInfonew.validity.split('T',2)
      this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US')            
        var futureDate = new Date(this.detailInfonew.validity);
futureDate.setDate(futureDate.getDate() + 7);
this.afterSevenDates =formatDate(futureDate, "yyyy-MM-dd", 'en-US')   
console.log(this.afterSevenDates+" kjkjk "+this.currentDateTime)
      if( this.currentDateTime > this.afterSevenDates){
        this.showDate=true;
      }else{
        this.showDate=false;
      }

      if( this.detailInfonew.lcProForma==null ||  this.detailInfonew.lcProForma=="" ||  this.detailInfonew.lcProForma==undefined){
        this.noFileDisable=false;
        this.viewDisable=true;
  
       }else{    
        this.viewDisable=false;
        this.noFileDisable=true;
       }
       if(this.detailInfonew.tenorFile){
        this.isUploadNoDoc=false;
      }else{
        this.isUploadNoDoc=true;
      }
 console.log('this.rejectedBy',this.rejectedBy)

      if(this.detailInfonew.rejectedBy.toLowerCase() == 'customer' ||this.detailInfonew.rejectedBy.toLowerCase() == 'bank'
       ||this.detailInfonew.rejectedBy.toLowerCase() == null )
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

  // for experied
  let data2 = {
    "userId": sessionStorage.getItem('userID'),
    "transactionId": transactionIDnew,
    "quotationStatus": "Expired",
    // "quotationStatus":$('#addOptions select').val(),
    "quotationId": record,
    // "quotationId": newrecord,
  }
  this.nts.getSecQuoteByUserIdTxnIdStatus(data2).subscribe(
    (response) => {
      this.detailInfonew = JSON.parse(JSON.stringify(response)).data[0];
      
      console.log(this.detailInfonew.transactionId);
      var strsplit=this.detailInfonew.validity.split('T',2)
      this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US')            
        var futureDate = new Date(this.detailInfonew.validity);
futureDate.setDate(futureDate.getDate() + 7);
this.afterSevenDates =formatDate(futureDate, "yyyy-MM-dd", 'en-US')   
console.log(this.afterSevenDates+" kjkjk "+this.currentDateTime)
      if( this.currentDateTime > this.afterSevenDates){
        this.showDate=true;
      }else{
        this.showDate=false;
      }

      if( this.detailInfonew.lcProForma==null ||  this.detailInfonew.lcProForma=="" ||  this.detailInfonew.lcProForma==undefined){
        this.noFileDisable=false;
        this.viewDisable=true;
  
       }else{    
        this.viewDisable=false;
        this.noFileDisable=true;
       }
       if(this.detailInfonew.tenorFile){
        this.isUploadNoDoc=false;
      }else{
        this.isUploadNoDoc=true;
      }
 console.log('this.rejectedBy',this.rejectedBy)

      if(this.detailInfonew.rejectedBy.toLowerCase() == 'customer' ||this.detailInfonew.rejectedBy.toLowerCase() == 'bank'
       ||this.detailInfonew.rejectedBy.toLowerCase() == null )
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
Quotes(){
  this.quotes= false;
  this.newquotes = true;
}

// new
rejectBanksecQuote(quoteId, transactionID,statusReason) {
  $('#myModal5').hide();
  $('.modal-backdrop').hide();

  let data = {
    "userId": sessionStorage.getItem('userID'),
    "statusReason": statusReason
  }
  let emailBody = {
    "transactionid": transactionID,
    "userId": sessionStorage.getItem('userID'),
    "event": "LC_REJECT"
  }
  this.nts.custRejectsecBankQuote(data, quoteId).subscribe(
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