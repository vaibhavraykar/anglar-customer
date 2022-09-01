import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import * as $ from '../../../../assets/js/jquery.min';
import { Tflag } from 'src/app/beans/Tflag';
import {bankNewTransaction} from 'src/assets/js/commons'
import { OfflineNewTranscationComponent } from '../../offline-new-transcation/offline-new-transcation.component';
import { ConfirmationComponent } from '../../bankTransaction/newTransaction/quotes/confirmation/confirmation.component';
import { DiscountingComponent } from '../../bankTransaction/newTransaction/quotes/discounting/discounting.component';
import { ConfirmAndDiscountComponent } from '../../bankTransaction/newTransaction/quotes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from '../../bankTransaction/newTransaction/quotes/refinancing/refinancing.component';
import { BankerComponent } from '../../bankTransaction/newTransaction/quotes/banker/banker.component';
import { BankGuaranteeComponent } from '../../bankTransaction/newTransaction/quotes/bank-guarantee/bank-guarantee.component';
import { AvalisationComponent } from '../../bankTransaction/newTransaction/quotes/avalisation/avalisation.component';

@Component({
  selector: 'app-offline-primary-save-details',
  templateUrl: './offline-primary-save-details.component.html',
  styleUrls: ['./offline-primary-save-details.component.css']
})
export class OfflinePrimarySaveDetailsComponent implements OnInit {
  noData: boolean = false;
  draftData: any;
  public parentURL: string = "";
  public checkExpAcp:string = "";

  public subURL: string = "";
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  quotation_id: any;

  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  @ViewChild(BankGuaranteeComponent,{static:false}) bankGuarantee: BankGuaranteeComponent;
  @ViewChild(AvalisationComponent, { static: false }) avalisation: AvalisationComponent;


  @ViewChild(OfflineNewTranscationComponent, { static: true }) confirmationpage: OfflineNewTranscationComponent;
  isEdited: boolean;

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
    // this.confirmationpage.isActiveQuote = false;
    
    
  }

  callAllDraftTransaction(){
    const param = {
    "bankUserId":sessionStorage.getItem('userID')
    }
    
   this.service.getBankDraftQuotation(param).subscribe(
      (response) => {
        console.log(response);
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
    console.log(pagename,action, data );
    this.isEdited = true;
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
     
    if (pagename == 'confirmation' || pagename === 'Confirmation') {
    
    } else if (pagename == 'BankGuarantee' ) {
   
    }else if (pagename === 'discounting' || pagename === 'Discounting') {
    
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
     
    } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
     
    } else if (pagename === 'banker' || pagename === "Banker" || pagename === 'Banker’s Acceptance') {
     
    }else if (pagename === 'BillAvalisation') {
   
    }
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
      this.router.navigate([`/${this.subURL}/${this.parentURL}/draft-transaction`]);
  });
  }

}
