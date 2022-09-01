import { Component, OnInit } from '@angular/core';
import { Tflag } from 'src/app/beans/Tflag';
import { TitleService } from 'src/app/services/titleservice/title.service';
import * as $ from 'src/assets/js/jquery.min';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { PlaceQuote, editViewQuotation } from 'src/app/beans/BankNewTransaction';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-oflline-confirmation-quotes',
  templateUrl: './oflline-confirmation-quotes.component.html',
  styleUrls: ['./oflline-confirmation-quotes.component.css']
})
export class OfllineConfirmationQuotesComponent implements OnInit {
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
  oldnumber:any;
  values: any;
  old:boolean;

  oldnumb:number;
  oldnumbedit:number;
  newNumber: number;
  amountgreated:boolean;
  participationAmount:any;
  newvale:number;
  bankDetails:any =[];
  bankName:any;
  isrequried = true;
  newtabscreen: boolean;
  newScreenview: boolean = true;
  showbutton = true;
  offeredprices: boolean;
  newtabscreentitle: boolean;
  applicableBenchmarknew: any=[];
  applicableBenchmark: number;
  ID: any;
  offered: any
  editpreview: boolean;
  hasError:boolean;
  showbuttonedit: boolean;
  isofferedview: boolean;
  newcheck: number;
  partnewnumber: any;
  newnumberone: any;
  // inputString: number;
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
        benchmark:0,
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
      retentionAmt: '',
      offeredPrice:'',
      billType:''
      // newNumber:'',
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
      isOffered:'',
      participationCommission: 0,
      // newNumber:''
      participationAmount:0,
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
    this.getDistributionBank(data.userId);
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
        this.showbutton = true;
        // this.showbutton = false;
        $('input').attr('readonly', true);
        $('textarea').attr('readonly', true);
        // this.newtabscreen = true;
       this.newScreenview = true;
       this.partnewnumber= data.participationAmount;
       console.log(this.partnewnumber);
        this.dataViewEdit = data;
        this.oldnumbedit = data.minParticipationAmt;
        this.participationAmount = data.lCValue - data.retentionAmt;
        console.log(this.oldnumber); 
        console.log(this.dataViewEdit);
        // this.dataViewEdit.participationAmount = this.participationAmount;
        console.log(this.dataViewEdit.isOffered);
        this.dataViewEdit.applicableBenchmark = data.benchmark;
        if (this.dataViewEdit.isOffered === 'Yes'){
          this.offeredprices = true;
          return;
        }else if((this.dataViewEdit.isOffered === 'null')){
            this.newtabscreentitle = true;
            return;
        }

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
        // this.showbutton = true;
        this.newScreenview = true;
        this.showbutton = false;
        this.dataViewEdit = data;
        this.oldnumbedit = data.minParticipationAmt;
       
        this.participationAmount = data.lCValue - data.retentionAmt;
        console.log(this.oldnumbedit); 
        console.log(this.data);
        console.log(data);

      } else if (type === Tflag.PLACE_QUOTE) {
        debugger
        this.showbutton = true;
        this.isActiveQuote = flag;
        this.title = 'Place Quote';
        this.data = data;
        data.confChgsIssuanceToMatur = "yes";
        data.applicableBenchmark = data.benchmark;
        console.log(data);
        console.log(data.participationAmount);
        console.log(data.applicableBenchmark);
        this.oldnumb = data.participationAmount;
        if (this.offeredprices = false) {
        this.applicableBenchmarknew = data.benchmark;
        console.log(this.applicableBenchmarknew);
      }
       
        this.participationAmount = data.lCValue - data.retentionAmt;
        //new
        
        data.participationAmount = this.participationAmount;
        this.newvale = this.participationAmount.toFixed(2);
        console.log(this.newvale)
        data.participationAmount = this.newvale;
        console.log(data.participationAmount)
        this.participationAmount = this.participationAmount.toFixed(2);
        console.log(this.participationAmount);
        console.log(this.oldnumber); 

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
       data.confChgsIssuanceToMatur = "yes";
     


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
  getDistributionBank(data){
    this.ts.getDistributingBank(data).subscribe(
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


  public closed() {
    this.isActive = false;
    this.newtabscreen = false;
    this.newScreenview = false;
    this.titleService.quote.next(false);
  }

  public closedQuote() {
    this.newtabscreen = false;
    this.isActiveQuote = false;
    this.newScreenview = false;
    this.titleService.quote.next(false);
  }


  public transaction(act: string, dataViewEdit: any) {
    this.dataViewEdit.confChgsIssuanceToNegot = this.selectNego;
    this.dataViewEdit.confChgsIssuanceToMatur = this.selectMature;
    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        this.title = 'Edit';
        this.editpreview = true;
        // this.newtabscreen = true;//
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
          this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction-qoute`]);
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
        // this.offeredprices = true;
        if(this.title=='Edit'){
          // this.offeredprices = false;
          if (this.newcheck == 1){
            this.dataViewEdit.isOffered = null;
            console.log(' im here');
            // return;
          } else if (this.newcheck != 1){
            this.dataViewEdit.isOffered = 'Yes';
            console.log(' i m not their');
          }
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
        redirectedFrom: "offlineconfirmation",
        trnsactionID: "data.transactionId"
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction-qoute`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
  }

  closed_div(){
    this.isActive = false;
this.editpreview = false;
this.ngOnInit();
    this.old= false;
    this.amountgreated = false;
    this.isrequried = false;
    this.newtabscreen = false;
    this.newtabscreentitle = false;
    this.offeredprices = false;
    this.showbutton = false;
    this.showbuttonedit = false;
    this.newScreenview = true;
    // data
    // this.showbutton = true;
    document.getElementById("menubarConfirmQuote").style.width="0%";
    document.getElementById("menubar-con").style.width = "0%"; 
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0"; 
    // document.getElementById("menubarConfirmQuote").style.opacity = "0"; 

   }
  public transactionForQuotes(act: string, data: any, detail: any) {
    
  
    this.isrequried=true;
    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        this.title = 'Edit';
        this.isrequried=true;
        this.newtabscreen = true;
        this.newScreenview = false;
        console.log('i m here');
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
        this.isrequried=true;
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
        this.isrequried=true;
        this.tab = 'tab1';
      
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction-qoute`]);
      });
      }
        break;
      case 'preview': {

        this.tab = 'tab2';
        this.isrequried=true;
        setTimeout(() => {
          $('input').attr('readonly', true);
        }, 200);
      }
        break;


      case 'calculateQuote': {    
        this.isrequried=true;    
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
        this.isrequried=false;
        this.radioid = true;   
        
        this.tab = 'tab2';
        if (this.offeredprices == false){
          data.isOffered = 'null';
          this.ID = 'new' ;
        } else {
          this.ID = 'offered' ;
          // data.discountingCharges = "null";
          // data.participationCommission = "null";
          // data.participationAmount = data.participationAmount;
          this.newvale = data.participationAmount;
          console.log(this.newvale);
          data.participationAmount = Number(this.newvale).toFixed(2);
          // data.participationAmount = data.participationAmount.toFixed(2);
          data.validityDate = data.validityDate;
          data.termConditionComments = data.termConditionComments;
        }
        data.confirmationCharges = 0;
          data.benchmark = data.applicableBenchmark;
        this.data.confChgsIssuanceToNegot = this.selectNego;
        this.data.confChgsIssuanceToMatur = this.selectMature;
        if(data.confChgsIssuanceToNegot=='no'){
          this.confNegot=true;
          this.confMature=false;
        }if(data.confChgsIssuanceToMatur=='no'){
          this.confMature=true;
          this.confNegot=false;
        }
          this.ts.saveQuotationToDraft(this.data,this.ID).subscribe(
          (response) => {
            if (JSON.parse(JSON.stringify(response)).status === 'Failure') {
              this.errmessage = `Quotation has already Accepted by the Customer for the transaction : ${this.data.transactionId}`
              $("#labConfirm").text(this.errmessage);
              document.getElementById("myModalConfirm").style.display = "block";
            }
            else {
              this.detail = JSON.parse(JSON.stringify(response)).data;
              this.data = data;
              console.log(this.data);
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
  Amounts(item){
    var str = item;
    console.log(str);
  }

  Amount(val){
    let inputString = Number(val);
    if (Number(inputString) > Number(this.oldnumb)) {
      this.old = true;
      return; 
    } else{ 
      this.old = false;
    }
 
   
  }

  checkAmount(val){
let inputValue = Number(val);
 this.newnumberone = Number(inputValue);
console.log(this.newnumberone);
this.participationAmount = this.newnumberone;
console.log(this.participationAmount);
  // data.participationAmount =inputValue ;
if (Number(inputValue) < Number(this.oldnumb)){
  this.old = true;
      return; 
}else{
  this.old = false;
}
 if (Number(val) > Number(this.data.lCValue)-Number(this.data.retentionAmt)){
  this.amountgreated = true;
  return; 
}else{
this.amountgreated = false;
return;
 }

  }
  checkAmountEdit(val){
    let inputValue = Number(val);
    this.participationAmount = inputValue;
    console.log(this.participationAmount);
      // data.participationAmount =inputValue ;
    if (Number(inputValue) < Number(this.oldnumbedit)){
      this.old = true;
          return; 
    }else{
      this.old = false;
    }
     if (Number(val) > Number(this.dataViewEdit.lCValue)-Number(this.dataViewEdit.retentionAmt)){
      this.amountgreated = true;
      return; 
    }else{
    this.amountgreated = false;
    return;
     }
    
      }
      newtab(){
        this.newtabscreen = true;
        this.showbutton = false;
        this.data.applicableBenchmark = this.data.benchmark ;
        console.log(this.data.applicableBenchmark);
        this.newtabscreentitle = true;
        // this.old = !this.old;
        this.old = false;
        this.amountgreated = false;
      }
      newtabEdit(){
        this.newtabscreen = true;
        // this.showbutton = true;
        this.isofferedview = false;
        this.newcheck = 1;
        console.log(this.partnewnumber);
        this.dataViewEdit.participationAmount = this.partnewnumber
        console.log(this.dataViewEdit.participationAmount);
        console.log(this.newcheck);
        this.showbuttonedit = false;
        this.newtabscreentitle = true;
        // this.dataViewEdit.isOffered = 'null';
        // this.old = !this.old;
        this.old = false;
        this.amountgreated = false;
        this.tab = 'tab1';
        setTimeout(() => {
          $('input').attr('readonly', true);
          $('textarea').attr('readonly', true);
        }, 200);
      }
      newtabOffered(){
        this.offeredprices = true;
        this.data.discountingCharges = null; 
        this.data.applicableBenchmark = 0;
        console.log(this.data.applicableBenchmark);
        this.newtabscreen = true;
        this.showbutton = false;
        // this.old = !this.old;
        this.old = false;
        this.amountgreated = false;
        this.tab = 'tab1';
        // setTimeout(() => {
        //   $('input').attr('readonly', true);
        //   $('textarea').attr('readonly', true);
        // }, 200);
      }
      newtabOfferedEdit(){
        this.offeredprices = true;
        this.newtabscreen = true;
        this.isofferedview = true;
        this.dataViewEdit.participationAmount = (this.dataViewEdit.lCValue)-Number(this.dataViewEdit.retentionAmt);
        console.log(this.dataViewEdit.participationAmount);
        // this.dataViewEdit.isOffered = 'Yes';
        this.dataViewEdit.discountingCharges = 0;
        this.dataViewEdit.minTransactionCharges =0 ;
        this.dataViewEdit.participationCommission = 0;
        this.dataViewEdit.otherCharges = 0;
        this.dataViewEdit.chargesType = '';
        this.dataViewEdit.commentsBenchmark = '';
        // this.dataViewEdit.otherCondition = 0;
        // this.showbutton = true;
        this.showbuttonedit = false;

        // this.old = !this.old;
        this.old = false;
        this.amountgreated = false;
        this.tab = 'tab1';
        setTimeout(() => {
          $('input').attr('readonly', true);
          $('textarea').attr('readonly', true);
        }, 200);
      } 
      backpage(){
        this.newtabscreen = !this.newtabscreen;
        this.newtabscreentitle = false;
        this.offeredprices = false;
        this.showbutton = true;
        
      }

      backpageforEdit(){
        this.newtabscreen = !this.newtabscreen;
        this.newtabscreentitle = false;
        this.offeredprices = false;
        this.showbutton = true;
        this.showbuttonedit = true;
        this.isofferedview = false;
        // this.dataViewEdit.isOffered = '';
      }

      backpageFOREditperview(){
        this.newtabscreen = !this.newtabscreen;
        this.editpreview = !this.editpreview;
        this.newtabscreentitle = false;
        this.showbuttonedit = true;
        this.offeredprices = false;
        this.showbutton = true;
        this.isofferedview = false;
        // this.dataViewEdit.isOffered = '';
      }

      backpageFOREditperviewload(){
        this.newtabscreen = !this.newtabscreen;
        this.editpreview = !this.editpreview;
        this.newtabscreentitle = false;
        this.showbuttonedit = true;
        this.offeredprices = false;
        this.showbutton = true;
      }
      isNumber(event){
       console.log(event);
       if(event === 0) {
         this.hasError= true;
         return;
       }else{
         this.hasError =false;
       }
      }

      backpagenewEdit() {
        this.showbutton = true;
      }


      backpageforEditview(){
        // this.newtabscreen = !this.newtabscreen;
        this.newtabscreen = false;
        this.newtabscreentitle = false;
        this.offeredprices = false;
        this.showbutton = true;
        this.newScreenview = false;
        this.showbuttonedit = true;
        // this.dataViewEdit.isOffered = '';
      }
    
}
