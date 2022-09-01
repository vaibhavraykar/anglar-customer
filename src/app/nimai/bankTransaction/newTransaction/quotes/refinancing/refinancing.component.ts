import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from 'src/assets/js/jquery.min';
import { Tflag } from 'src/app/beans/Tflag';
import { PlaceQuote, editViewQuotation } from 'src/app/beans/BankNewTransaction';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-refinancing',
  templateUrl: './refinancing.component.html',
  styleUrls: ['./refinancing.component.css']
})
export class RefinancingComponent implements OnInit {

  public isActive: boolean = false;
  public isActiveQuote: boolean = false;
  public data: PlaceQuote;
  public dataViewEdit: editViewQuotation;
  public title: string = "";
  public tab = 'tab1';
  public errmessage: string = "";

  detail: any;
  val: any;
  public parentURL: string = "";
  public subURL: string = "";
  totalQuote: any;
  dateString: any;
  currentDateTime: any;
  CurrentDate: string;
  ID: any;

  constructor(public titleService: TitleService, public ts: NewTransactionService,
    public upls: UploadLcService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
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
      chargesType: "",
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

  ngOnInit() {
  }
  public action(flag: boolean, type: Tflag, data: any) {
    this.CurrentDate=  formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.tab='tab1';
console.log(type)
    if(data.termConditionComments=='null'){
      data.termConditionComments='';
    } if(data.chargesType=='null'){
      data.chargesType='';
    } if(data.commentsBenchmark=='null'){
      data.commentsBenchmark='';
    }
   
    if (flag) {
      if (type === Tflag.VIEW) {
        this.isActive = flag;
        $('input').attr('readonly', true);
        $('textarea').attr('readonly', true);
        this.title = 'View';
        this.dataViewEdit = data;
       
      } else if (type === Tflag.EDIT) {
        this.isActive = flag;
        this.title = 'Edit';
        this.dataViewEdit = data;
        $('input').attr('readonly', false);
      } else if (type === Tflag.PLACE_QUOTE) {
        this.isActiveQuote = flag;
        this.title = 'Place Quote';
        this.data = data;
       
        $('input').attr('readonly', false);
      }

    } else {
      this.isActive = flag;
      this.data = data;
      this.title = '';
      $('input').attr('readonly', true);

    }
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

  public transaction(act: string) {

    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        setTimeout(() => {
          $('input').attr('readonly', false);
          $('textarea').attr('readonly', false);
        }, 100);
        this.title = 'Edit';
      }
        break;

      case 'submit': {
        if(this.dataViewEdit.quotationStatus=="FreezePlaced"|| this.dataViewEdit.quotationStatus=="FreezeRePlaced"){
          const param = {
            "userId": this.dataViewEdit.userId,
            "bankUserId":this.dataViewEdit.bankUserId,
            "transactionId":this.dataViewEdit.transactionId
          }
          this.ts.validateQuote(param).subscribe(
            (response) => {
              this.detail = JSON.parse(JSON.stringify(response)).status;
              if(this.detail=="Validate Success"){
               // $("#validateSuccessRef").show();
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
            this.ts.validateQuote(param).subscribe(
              (response) => {
                this.detail = JSON.parse(JSON.stringify(response)).status;
                console.log(this.detail);
                if(this.detail=="Validate Success"){
                 // alert("Quote Validated Successfully.")
                // $("#validateSuccessCon").show();
    console.log(' i am here');
                }else{
                  console.log("Someting went wrong.")
                }
              }, (error) => {}
            )
            }
        this.ts.updateBankTransaction(this.dataViewEdit).subscribe(
          (response) => {
            this.tab = 'tab3';
          },
          error => {
            alert('error')
            this.closedQuote();
            this.tab = 'tab1';
          }
        )
      }
        break;

        case 'withdraw': {          
          $('#withdrawTrasactionRef').show();       
        }
          break;

          case 'withdrawTransaction': {
            const param={
              "transactionId":this.dataViewEdit.transactionId,
              "userId":sessionStorage.getItem('userID'),
               "quotationId":this.dataViewEdit.quotationId,
            }  
            this.ts.withdrawQuote(param).subscribe(
              (response) => {
                    $('#withdrawTrasactionRef').hide();
                this.tab = 'tab4';
              },
              error => {
                alert('error')
              }
            )     
              }
                break;
    
                case 'noWithdrawTransaction': {
                  $('#withdrawTrasactionRef').hide();      
                }
                  break;
      case 'ok': {
        this.closed();
        this.tab = 'tab1';
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
        });
      }
        break;
      case 'preview': {
        if (this.title == 'Edit') {
          this.tab = 'tab2';
          setTimeout(() => {
            $('input').attr('readonly', true);
            $('textarea').attr('readonly', true);

          }, 200);
          this.ts.updateBankTransaction(this.dataViewEdit).subscribe(
            (response) => {
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
            $('textarea').attr('readonly', true);

          }, 200);
        }
      }
        break;
    }
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
    this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
  }

  closed_div(){
    this.isActive = false;
    document.getElementById("menubarRefinanceQuote").style.width="0%";
    document.getElementById("menubarRefinancing").style.width = "0%"; 
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0"; 
   }

  public transactionForQuotes(act: string, data: any, detail: any) {
    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        setTimeout(() => {
          $('input').attr('readonly', false);
        }, 100);
        this.title = 'Edit';
      }
        break;

      case 'confirm': {
        const param = {
          "quotationId": detail.quotationId,
          "transactionId": data.transactionId,
          "userId": data.userId
        }

        this.ts.confirmQuotation(param).subscribe(
          (response) => {
            this.tab = 'tab3';
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
            // this.upls.confirmLcMailSent(emailBodyUpdate).subscribe((resp) => { console.log("Email sent successfully"); }, (err) => { },);

            this.upls.confirmLcMailSentToBank(emailBankBody).subscribe((resp) => { console.log("bank mail sent successfully"); }, (err) => { },);

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
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
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
        this.ts.saveQuotationToDraft(this.data, this.ID).subscribe(
          (response) => {
            this.detail = JSON.parse(JSON.stringify(response)).data;
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
      
      //   this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US'),
      //   this.dateString=formatDate(this.data.validityDate, this.currentDateTime, 'en-US');

      //   this.currentDateTime

      //   this.data.validityDate=this.dateString;
      // alert(formatDate(this.dateString, "yyyy-MM-dd'T'HH:mm:ss", 'en-US'))
        this.tab = 'tab2';
        this.ID='new';
        this.ts.saveQuotationToDraft(this.data, this.ID).subscribe(
          (response) => {
            if (JSON.parse(JSON.stringify(response)).status === 'Failure') {
              this.errmessage = `Quotation has already Accepted by the Customer for the transaction : ${this.data.transactionId}`
              $("#labRef").text(this.errmessage);
              document.getElementById("myModalRef").style.display = "block";
            }
            else {
              this.detail = JSON.parse(JSON.stringify(response)).data;
              this.data = data;
              this.data.TotalQuote = this.detail.TotalQuote;
              this.data.confChgsMatur = this.detail.confChgsMatur;
              this.data.confChgsNegot = this.detail.confChgsNegot;

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
}