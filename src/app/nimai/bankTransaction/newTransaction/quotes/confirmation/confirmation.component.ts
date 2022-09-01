import { Component, OnInit, Query } from '@angular/core';
import { Tflag } from 'src/app/beans/Tflag';
import { TitleService } from 'src/app/services/titleservice/title.service';
import * as $ from 'src/assets/js/jquery.min';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { PlaceQuote, editViewQuotation } from 'src/app/beans/BankNewTransaction';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  public isActive: boolean = false;
  public isActiveQuote: boolean = false;
  public data: PlaceQuote;
  public dataViewEdit: editViewQuotation;
  public title: string = "";
  public tab = 'tab1';
  chargesEdit1: boolean = false;
  chargesEdit2: boolean = false;
  charges1: boolean = false;
  charges2: boolean = false;
  public selectNego: string = "";
  public selectMature: String = "";
  public radioid: boolean = true;
  getCurrentDate: any;
  detail: any;
  public parentURL: string = "";
  public subURL: string = "";
  public errmessage: string = '';
  totalQuote: any;
  public confNegot:boolean=false;
  public confMature:boolean=false;
  CurrentDate: string;
  withdrawMsg: any;
  withdrawOK: boolean=false;
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

  onNegotChange(value) {
    this.data.confChgsIssuanceToMatur='no';
    this.data.confChgsIssuanceToNegot='yes';
    this.selectMature = 'no';
    this.selectNego = 'yes';
  }

  onMatureChange(value) {
    this.data.confChgsIssuanceToMatur='yes';
    this.data.confChgsIssuanceToNegot='no';
    this.selectMature = 'yes';
    this.selectNego = 'no';
  }
  public action(flag: boolean, type: Tflag, data: any) {
  this.CurrentDate=  formatDate(new Date(), 'yyyy-MM-dd', 'en');
 this.tab='tab1';
    if(data.termConditionComments=='null'){
      data.termConditionComments='';
    } if(data.chargesType=='null'){
      data.chargesType='';
    } if(data.commentsBenchmark=='null'){
      data.commentsBenchmark='';
    }    
    if (flag) {
      console.log('okkkk')
      if (type === Tflag.VIEW) {
        this.isActive = flag;
        $('input').attr('readonly', true);
        $('textarea').attr('readonly', true);
        this.title = 'View';
        this.dataViewEdit = data;
        if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
          this.chargesEdit2 = true;
          this.chargesEdit1 = false;
          this.dataViewEdit.confChgsIssuanceToMatur = "";
          this.dataViewEdit.confChgsIssuanceToNegot = "";
          this.selectMature = 'yes';
          this.selectNego = 'no';
        } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
          this.chargesEdit1 = true;
          this.chargesEdit2 = false;
          this.dataViewEdit.confChgsIssuanceToNegot = "";
          this.dataViewEdit.confChgsIssuanceToMatur = "";
          this.selectMature = 'no';
          this.selectNego = 'yes';
        }

      } else if (type === Tflag.EDIT) {
        this.isActive = flag;
        this.title = 'Edit';
        this.dataViewEdit = data;

      } else if (type === Tflag.PLACE_QUOTE) {
        this.isActiveQuote = flag;
        this.title = 'Place Quote';
        this.data = data;
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
        }else{
          this.charges1=false;
       this.charges2=false;
       data.confChgsIssuanceToNegot = "";
       data.confChgsIssuanceToMatur = "";
     


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



  public closed() {
    this.isActive = false;
    this.titleService.quote.next(false);
  }

  public closedQuote() {
    this.isActiveQuote = false;
    this.titleService.quote.next(false);
  }


  public transaction(act: string, dataViewEdit: any) {
    this.dataViewEdit.confChgsIssuanceToNegot = this.selectNego;
    this.dataViewEdit.confChgsIssuanceToMatur = this.selectMature;
    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        this.title = 'Edit';
        this.radioid=false;
        $('input').attr('readonly', false);
        $('textarea').attr('readonly', false);
        if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
          this.chargesEdit2 = true;
          this.chargesEdit1 = false;
          this.dataViewEdit.confChgsIssuanceToMatur = "yes";
          this.dataViewEdit.confChgsIssuanceToNegot = "no";
          this.selectMature = 'yes';
          this.selectNego = 'no';
        } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
          this.chargesEdit1 = true;
          this.chargesEdit2 = false;
          this.dataViewEdit.confChgsIssuanceToNegot = "yes";
          this.dataViewEdit.confChgsIssuanceToMatur = "no";
          this.selectMature = 'no';
          this.selectNego = 'yes';
        }


      }
        break;

      case 'submit': {
        if(this.dataViewEdit.quotationStatus=="FreezePlaced"){
          const param = {
            "userId": this.dataViewEdit.userId,
            "bankUserId":this.dataViewEdit.bankUserId,
            "transactionId":this.dataViewEdit.transactionId
          }
          this.ts.validateQuote(param).subscribe(
            (response) => {
              this.detail = JSON.parse(JSON.stringify(response)).status;
              if(this.detail=="Validate Success"){
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

          const param={
            "transactionId":this.dataViewEdit.transactionId,
            "userId":sessionStorage.getItem('userID'),
             "quotationId":this.dataViewEdit.quotationId,
          }  
          this.ts.withdrawQuote(param).subscribe(
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
            this.ts.withdrawQuote(param).subscribe(
              (response) => {
                    $('#withdrawTrasactionConfirm').hide();
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
          this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
      });
      }
        break;
      case 'preview': {
        if (this.dataViewEdit.confChgsIssuanceToMatur === 'yes') {
          this.chargesEdit2 = true;
          this.chargesEdit1 = false;
          this.selectMature = 'yes';
          this.selectNego = 'no';
        } else if (this.dataViewEdit.confChgsIssuanceToNegot === 'yes') {
          this.chargesEdit1 = true;
          this.chargesEdit2 = false;
          this.selectMature = 'no';
          this.selectNego = 'yes';
        }

        if(this.title=='Edit'){
          this.tab = 'tab2';
          setTimeout(() => {
            $('input').attr('readonly', true);
            $('textarea').attr('readonly', true);
          }, 200);
          this.ts.updateBankTransaction(this.dataViewEdit).subscribe(
            (response) => {
              this.detail = JSON.parse(JSON.stringify(response)).data;
              this.totalQuote = JSON.parse(JSON.stringify(response)).data.TotalQuote;
            },
          // this.ts.saveQuotationToDraft(this.dataViewEdit).subscribe(
          //   (response) => {
          //     this.totalQuote = JSON.parse(JSON.stringify(response)).data.TotalQuote;
          //     console.log(this.totalQuote)
          //   },
            error => {
              alert('error')
              this.closed();
              this.tab = 'tab1';
            }
          )
        }else{
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
    $("#validateSuccessCon").hide();
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
    document.getElementById("menubarConfirmQuote").style.width="0%";
    document.getElementById("menubar-con").style.width = "0%"; 
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0"; 
   }
  public transactionForQuotes(act: string, data: any, detail: any) {
    
  

    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        this.title = 'Edit';
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
            // this.upls.confirmLcMailSent(emailBodyUpdate).subscribe((resp) => { console.log("Email sent successfully"); }, (err) => { },);

            // this.upls.confirmLcMailSentToBank(emailBankBody).subscribe((resp) => { console.log("bank mail sent successfully"); }, (err) => { },);

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
        // const navigationExtras: NavigationExtras = {
        //   state: {
        //     redirectedFrom: "confirmation",
        //     trnsactionID: data.transactionId
        //   }
        // };
        // this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`], navigationExtras)
        //   .then(success => console.log('navigation success?', success))
        //   .catch(console.error);
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
        this.ts.saveQuotationToDraft(this.data,this.ID).subscribe(
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
        
        this.radioid = true;   
        this.tab = 'tab2';
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
          this.ts.saveQuotationToDraft(this.data, this.ID).subscribe(
          (response) => {
            if (JSON.parse(JSON.stringify(response)).status === 'Failure') {
              this.errmessage = `Quotation has already Accepted by the Customer for the transaction : ${this.data.transactionId}`
              $("#labConfirm").text(this.errmessage);
              document.getElementById("myModalConfirm").style.display = "block";
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