import { Compiler, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { Tflag } from 'src/app/beans/Tflag';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import { ConfirmationComponent } from '../newTransaction/quotes/confirmation/confirmation.component';
import { ConfirmAndDiscountComponent } from '../newTransaction/quotes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from '../newTransaction/quotes/refinancing/refinancing.component';
import { DiscountingComponent } from '../newTransaction/quotes/discounting/discounting.component';
import { BankerComponent } from '../newTransaction/quotes/banker/banker.component';
import * as $ from 'src/assets/js/jquery.min';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { ReportsService } from 'src/app/services/reports.service';
import { BankGuaranteeComponent } from '../newTransaction/quotes/bank-guarantee/bank-guarantee.component';
import { AvalisationComponent } from '../newTransaction/quotes/avalisation/avalisation.component';
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
  @ViewChild(BankGuaranteeComponent,{static:false}) bankGuarantee: BankGuaranteeComponent;
  @ViewChild(AvalisationComponent, {static: false}) billAvalisation: AvalisationComponent;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  public ntData: any[] = [];
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public hasNoRecordQuote:boolean=false;
  public detail: any;
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

  constructor(public activatedRoute: ActivatedRoute,public getCount: SubscriptionDetailsService, public report:ReportsService ,private comp:Compiler, public psd: PersonalDetailsService,public titleService: TitleService, public nts: NewTransactionService,public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.titleService.quote.next(false);
    if(sessionStorage.getItem('accountType')=='MASTER')
    this.getSubsidiaryData();

  }
  openDocument(file){
    $('#myModal99').show();
    this.document = file;
  }
  public getAllnewTransactions(userid) {
    this.user_ID=userid;
    this.getNimaiCount();
    this.titleService.quote.next(true);
// if(sessionStorage.getItem('accountType')=='MASTER'){
//   userid='All'+userid;  

// }else{
//   userid=userid;
// }

    const data = {
      "bankUserId":userid,
      "quotationStatus": "Placed"
    }

    this.nts.getTransQuotationDtlByBankUserIdAndStatus(data).subscribe(
      (response) => {

        custTrnsactionDetail();
        this.detail=[];
        console.log(JSON.parse(JSON.stringify(response)).data);
        this.detail = JSON.parse(JSON.stringify(response)).data;  
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

      if(this.getcountUser=='MASTER'){
       
        this.disablesubsi=true
      }else{
        this.disablesubsi=false
        
      }
      }, (error) => {
        this.hasNoRecord = true;
      }
    )

  }


  
  ngOnInit() {

   $('.slide-reveal-overlay').hide();
    
  }
  
  getNimaiCount() {
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress": ""
    }
    this.getCount.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
      response => {
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
    this.getcountUser=this.nimaiCount.accounttype;
      }
    )
  }
  // getSubsidiaryData(){
  //   const data = {
  //     "userId": sessionStorage.getItem('userID'),
  //   }
  //   this.psd.getAddUserList(data).
  //     subscribe(
  //       (response) => {
  //         this.subsidiaries = JSON.parse(JSON.stringify(response)).list;
        
  //       },
  //       (error) => {}
  //     )
  // }
  // public validateQuote(data: any){
  //   const param = {
  //     "userId": data.userId,
  //     "transactionId":data.transactionId
  //   }
  //   this.nts.validateQuote(param).subscribe(
  //     (response) => {
  //      // bankActiveTransaction();
  //       this.detail = JSON.parse(JSON.stringify(response)).status;
  //       console.log("Status---",this.detail)
  //       if(this.detail=="Validate Success"){
  //         alert("Validate Successfully.")
  //         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //           this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
  //         });
  //       }else{
  //         alert("Someting went wrong.")
  //       }
  //       console.log("message",this.detail.message)
  
  //     }, (error) => {
  //       this.hasNoRecord = true;
  //     }
  //   )
  // }
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
    this.confirmation.isActive = false;
    this.confirmAndDiscount.isActive = false;
    this.discounting.isActive = false;
    this.refinancing.isActive = false;
    this.banker.isActive = false;

  }

  close(){
    $('#myModal99').hide();
  }
  
  openOffcanvas() {   
    document.getElementById("menu-barDetailActive").style.width = "560px";
  
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
  showQuotePage(pagename: string, action: Tflag, data: any) {
   
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    if (pagename === 'confirmation' || pagename === 'Confirmation') {
      document.getElementById("menubar-con").style.width = "560px"; 
      this.confirmation.action(true, action, data);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;     

    }
    if (pagename === 'BankGuarantee' ) {
      document.getElementById("menubar-bg").style.width = "560px"; 
      this.bankGuarantee.action(true, action, data);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;   
      this.confirmation.isActive=false;  

    }
     else if (pagename === 'discounting' || pagename === 'Discounting') {
      this.confirmation.isActive = false;
      this.discounting.action(true, action, data);
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menubarDiscounting").style.width = "560px"; 

    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
      this.confirmAndDiscount.action(true, action, data);
      console.log(data, ' i m data');
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menubarConfDis").style.width = "560px"; 

    } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.action(true, action, data);
      this.banker.isActive = false;
      document.getElementById("menubarRefinancing").style.width = "560px"; 

    } else if (pagename === 'banker' || pagename === 'Banker' || pagename === 'Banker’s Acceptance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.action(true, action, data);
      document.getElementById("menubarBanker").style.width = "560px"; 

    } 
    else if(pagename === 'BillAvalisation' ) {
      document.getElementById("menubarAvalising_bg").style.width = "560px"; 
      this.billAvalisation.action(true, action, data);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;   
      this.confirmation.isActive=false;  

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
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
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

//  fileName= 'ExcelSheet.xlsx';  
//  exportexcel(): void 
//      {
//         /* table id is passed over here */   
//         let element = document.getElementById('datatables'); 
//         const ws: xlsx.WorkSheet =xlsx.utils.table_to_sheet(element); 
//         /* generate workbook and add the worksheet */
//         const wb: xlsx.WorkBook = xlsx.utils.book_new();
//         xlsx.utils.book_append_sheet(wb, ws, 'Sheet1'); 
//         /* save to file */
//         xlsx.writeFile(wb, this.fileName);       
//      }

}
