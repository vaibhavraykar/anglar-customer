import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { Tflag } from 'src/app/beans/Tflag';
import {bankNewTransaction} from 'src/assets/js/commons'
import { OfllineConfirmationQuotesComponent } from '../oflline-confirmation-quotes/oflline-confirmation-quotes.component';
@Component({
  selector: 'app-offline-sec-saved-transcation',
  templateUrl: './offline-sec-saved-transcation.component.html',
  styleUrls: ['./offline-sec-saved-transcation.component.css']
})
export class OfflineSecSavedTranscationComponent implements OnInit {
  noData: boolean = false;
  draftData: any;
  public parentURL: string = "";
  public checkExpAcp:string = "";

  public subURL: string = "";
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  quotation_id: any;
  @ViewChild(OfllineConfirmationQuotesComponent, { static: true }) confirmation: OfllineConfirmationQuotesComponent;
  constructor(public service: UploadLcService,public titleService: TitleService,public router: Router,
     public nts: NewTransactionService, public activatedRoute: ActivatedRoute) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });
    this.titleService.quote.next(false);
 
  }
  
  ngOnInit() {
   console.log('test')
  }

  ngAfterViewInit() {
    this.callAllDraftTransaction();
    this.confirmation.isActiveQuote = false;
   
    
  }

  callAllDraftTransaction(){
    const param = {
    "bankUserId":sessionStorage.getItem('userID')
    }
    
   this.service.getSecondaryDraftQuotationByBankUserId(param).subscribe(
      (response) => {
        this.draftData = JSON.parse(JSON.stringify(response)).data;
        bankNewTransaction();
        if(!this.draftData){
          this.noData = true;
        }
     
      },(error) =>{
        this.noData = true;
      }
      )
  }



  editDraft(pagename: string,action:Tflag,data:any) {
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
 this.quotation_id=data.quotationId;
   const param= {
      "userId":data.userId,
      "transactionId":data.transactionId,
      }
    
    this.service.checkAcceptedExpiredTransaction(param).subscribe(
      (response) => {
        this.checkExpAcp = JSON.parse(JSON.stringify(response)).status;

      
        if(this.checkExpAcp =="Success"){
          this.confirmation.action(true, action, data);
    // if (pagename == 'confirmation' || pagename === 'Confirmation') {
    //   this.confirmation.action(true, action, data);
    //   this.discounting.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    // } else if (pagename == 'BankGuarantee' ) {
    //   this.bankGuarantee.action(true, action, data);
    //   this.discounting.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    //   this.confirmation.isActiveQuote=false;
    // }else if (pagename === 'discounting' || pagename === 'Discounting') {
    //   this.confirmation.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    //   this.discounting.action(true, action, data);
    // } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
    //   this.confirmAndDiscount.action(true, action, data);
    //   this.confirmation.isActiveQuote = false;
    //   this.discounting.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    // } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
    //   this.refinancing.action(true, action, data);
    //   this.confirmation.isActiveQuote = false;
    //   this.discounting.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    // } else if (pagename === 'banker' || pagename === "Banker" || pagename === 'Banker’s Acceptance') {
    //   this.confirmation.isActiveQuote = false;
    //   this.discounting.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.action(true, action, data);
    // }
  }
  
  if(this.checkExpAcp=="Failure"){
    $("#discardQuote").show(); 
    
    }
  });
}


cancelDiscard(){
  $("#discardQuote").hide(); 
}
  deleteDraft(quotation_id){
    // if(data){
    //   var req = {
    //     "quotationId": data.quotationId
    //     }
    // }else{
      
      var req = {
        "quotationId": quotation_id
        }
   // }
   
    this.service.deleteDraftQuotationByQuotationId(req).subscribe(
      (response) => {
        debugger
        const index = this.draftData.indexOf(this.quotation_id);
        this.draftData.splice(index, 1);
        $("#discardQuote").hide(); 
        this.refreshPage();

      },(error) =>{
      }
      )

  }

  refreshPage(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/saved-transaction-qoute`]);
  });
  }

}
