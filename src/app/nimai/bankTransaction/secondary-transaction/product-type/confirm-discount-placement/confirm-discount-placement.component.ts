import { Component, OnInit } from '@angular/core';
import { TransactionBean } from 'src/app/beans/TransactionBean';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from '../../../../../../assets/js/jquery.min';
import { Tflag } from 'src/app/beans/Tflag';
import { Router, ActivatedRoute } from '@angular/router';
import { TData } from 'src/app/beans/TransBean';
import { LoginService } from 'src/app/services/login/login.service';
import * as FileSaver from 'file-saver';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { formatDate } from '@angular/common';
import { ValidateRegex } from 'src/app/beans/Validations';
import * as moment from 'moment';
@Component({
  selector: 'app-confirm-discount-placement',
  templateUrl: './confirm-discount-placement.component.html',
  styleUrls: ['./confirm-discount-placement.component.css']
})
export class ConfirmDiscountPlacementComponent implements OnInit {

  public isActive: boolean = false;
  public data:TData;
  public title: string = "";
  public tab = 'tab2';
  document: any;
  public parentURL: string = "";
  public subURL: string = "";
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  countryName: any;
  public applicantType: boolean = true;
  public beneficiaryType: boolean = true;
  public productType:boolean=true;
  applicant: boolean = false;
  beneficiary: boolean = false;
  public userTypes:string='';
  benName: string;
  benCountry: string;
  appliName : string;
  appliCountry : string;
  private imageSrc: string = '';
  isUploadForma: boolean=false;
  reqType : string;
  isUpload=false;
  private filename: string = '';
  imgDownload: boolean=false;
  fileData: any;
  transaction_id: string;
  cancelSucessmsg: string;
  okSucessmsg: string;
  portOfLoading: any;
  portOfDischarge: any;
  goodsArray: any;
  isBankOther: boolean=false;
  othersStr: any;
  currentDateTime: string;
  checkValidity: boolean=true;
  disableRadiobtn: boolean=false;
  public tenorType:boolean =true;
  appBenBAC: boolean=true;
  chargesTypeArr: any=[];
  currencies: any;
  isDownloadORview: string;
  status: string;
  CurrentDate: string;
  errMsg: boolean;
  amount:Number;
  retentionAmt:Number;
  minParticipationAmt:Number;
  PresentDate: string;
  isBgOther: boolean;
  constructor(public upls: UploadLcService,public loginService: LoginService,public titleService: TitleService, public ts: NewTransactionService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    
    this.data = {
      claimExpiryDate:"",
      lCExpiryDate:"",
      bgType:"",
      isESGComplaint:"",
      otherBGType:"",
      otherType:"",
      transactionId:"",
      originalTenorDays:"",
      refinancingPeriod:"",
      lcMaturityDate:"",
      lcNumber:"",
      lastBeneBank:"",
      lastBeneSwiftCode:"",
      lastBankCountry:"",
      loadingCountry:"",
      loadingPort:"",
      dischargeCountry:"",
      dischargePort:"",
      chargesType:"",
      validity:"",
      lcProForma:"",
      applicantName:"",
      applicantCountry:"",
      userType:"",
      applicantContactPerson:"",
      applicantContactPersonEmail:"",
      beneName:"",
      beneCountry:"",
      beneContactPerson:"",
      beneContactPersonEmail:"",
      beneBankName:"",
      beneSwiftCode:"",
      beneBankCountry:"",
      lCIssuanceBank:"",
      lCIssuanceBranch:"",
      swiftCode:"",
      lCIssuanceCountry:"",
      requirementType:"",
      lCValue:"",
      lCCurrency:"",
      lCIssuingDate:"",
      negotiationDate:"",
      lastShipmentDate:"",
      goodsType:"",
      discountingPeriod:"",
      confirmationPeriod:"",
      paymentTerms:"",    
      tenorFile:"",
      usanceDays:0,
      offeredPrice:'',
      participationBasis:''
    }
    
  }

  ngOnInit() {
    this.CurrentDate=  formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));
    this.currencies = JSON.parse(sessionStorage.getItem('currencyData'));
    var userid=sessionStorage.getItem('userID');
    if (userid.startsWith('BC')) {
      this.disableRadiobtn=true;
    }
  }
  changeReqType(event){    
    this.reqType=event.target.value
  }
  deleteFileContent(){    
    $('#upload_file1').val('');
    this.data.tenorFile="";
    this.isUpload = false;    
  }
  handleFileInput(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.filename=file.name;
    var pattern = /image-*/;
    var reader = new FileReader();
    // if (!file.type.match(pattern)) {
    //   alert('invalid format');
    //   $('#upload_file1').val('');
    //   return;
    // }
    this.isUpload=true;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = this.filename +" |" + reader.result;
    this.data.tenorFile=this.imageSrc;
    // this.LcDetail.get('lcMaturityDate').setValue("");

  }
  onNegotChange(val){
    if (val === 'applicant') {
      this.applicantType=true;
      this.beneficiaryType=false;
      this.userTypes='Applicant';
      this.data.applicantName=this.data.beneName;
      this.data.applicantCountry=this.data.beneCountry;
      this.data.beneName=this.benName;
    this.data.beneCountry=this.benCountry;
    } else if (val === 'beneficiary') {
      this.applicantType=false;
      this.beneficiaryType=true;
      this.userTypes='Beneficiary';
      this.data.beneName=this.data.applicantName;
      this.data.applicantName=this.appliName;
      this.data.beneCountry=this.data.applicantCountry;
     this.data.applicantCountry=this.appliCountry;
    }    
  }

  deleteFileContentForma(){    
    $('#upload_file2').val('');
    this.data.lcProForma="";
    this.isUploadForma = false;    
  }
  handleFileProForma(e){
    this.noFileDisable=true;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    this.filename=file.name;
    // if (!file.type.match(pattern)) {
    //   alert('invalid format');
    //   $('#upload_file2').val('');
    //   return;
    // }
    this.isUploadForma=true;
    reader.onload = this._handleReaderLoadedForma.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoadedForma(e) {
    let reader = e.target;
    this.imageSrc =this.filename +" |" + reader.result;
    this.data.lcProForma=this.imageSrc;

  }
  onItemSelect(item) {
    var str = item; 
    var splittedStr =str.split(": ",2)
      this.othersStr=splittedStr[1];
    if(splittedStr[1]=="Others" || splittedStr[1].startsWith('Others')){
      this.isBankOther=true;      
    }else{
      this.isBankOther=false;
    }
  }

  public action(flag: boolean, type: Tflag, data: any,goods : any,validityDate:any,status) {
    // if(status=="Pending")
    // this.status="pending-transaction";
    // if(status=="Active")
    this.status="active-secondary-transaction";
    this.chargesTypeArr=[]
    var strs=data.validity;
    var strsplit=strs.split('T',2)
       this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US')     
       if(strsplit[0]==this.currentDateTime && data.quotationReceived==0){
        this.checkValidity=false;
      }else{
        this.checkValidity=true;
      }
    this.goodsArray=goods
    this.tab='tab2';
    if (flag) {
      this.isActive = flag;
      if (type === Tflag.VIEW) { 
        // $('input').attr('readonly', true);
        this.title = 'View Transaction';
        this.data = data;
        this.PresentDate = data.lCIssuingDate;
        this.amount = data.lCValue;
        this.retentionAmt = data.retentionAmt;
        this.minParticipationAmt = data.minParticipationAmt; 
        console.log(data);
        if(this.data.chargesType.startsWith(this.data.applicantName)){
          this.chargesTypeArr.push(this.data.beneName+" "+"(Beneficiary)")
        }else{
          this.chargesTypeArr.push(this.data.applicantName+" "+"(Applicant)")
        }
        if(this.data.goodsType.startsWith('Others')){
          this.isBankOther=true;      
          var str = this.data.goodsType; 
          var splittedStr =str.split(" - ",2)
          this.othersStr=splittedStr[0];
          this.data.goodsType=this.othersStr;
          this.data.otherType=splittedStr[1];
         }else{
           this.isBankOther=false;
         }
        this.reqType=this.data.requirementType;
        if (this.data.userType === 'Applicant') {
          this.userTypes='Applicant';
          this.beneficiary = false;
          this.applicant = true;
          this.applicantType=true;
          this.beneficiaryType=false;
          this.benName=this.data.beneName;
          this.benCountry=this.data.beneCountry;
          data.applicantCountry= data.applicantCountry.toUpperCase();

        } else if (this.data.userType === 'Beneficiary') {
          this.userTypes='Beneficiary';
          this.applicant = false;
          this.beneficiary = true;
          this.applicantType=false;
          this.beneficiaryType=true;
          this.benName='';
          this.benCountry='';
          this.appliName=this.data.applicantName;
          this.appliCountry=this.data.applicantCountry;
          data.beneCountry=data.beneCountry.toUpperCase();

        }else if(this.data.userType==""){
          this.beneficiaryType = true;
          this.applicantType=true;
          this.appBenBAC=false;
        }
      } else if (type === Tflag.EDIT) {
        this.title = 'Edit Transaction';
        this.data = data;
        // $('input').attr('readonly', false);
      }
    } else {
      this.isActive = flag;
      this.data = data;
      this.title = '';
      // $('input').attr('readonly', true);

    }
    
    if(data.lcProForma==null || data.lcProForma=="" || data.lcProForma==undefined){
      this.noFileDisable=false;
      this.viewDisable=true;

     }else{
      this.viewDisable=false;
      this.noFileDisable=true;
     }

  }

  public closed() {
    this.isActive = false;
     this.titleService.quote.next(false);
  }

 closed_div(){
  this.isActive = false;
  this.errMsg = false;
  document.getElementById("menu-barnew").style.width = "0%"; 
  document.getElementById("myCanvasNav").style.width = "0%";
  document.getElementById("myCanvasNav").style.opacity = "0"; 
 }
 
  public transaction(act: string,data:any) {
  
    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
       
        setTimeout(() => {
          // $('input').attr('readonly', false);
        }, 100);
        this.title = 'Edit Transaction';
        this.portLoadingOnchange(data.loadingCountry);
        this. portDischargeOnchange(data.dischargeCountry)
      }
        break;

      case 'submit': {
        this.okSucessmsg='ok';
        this.title = 'Transaction Updated';

        if(this.othersStr=='Others'){
          this.data.goodsType="Others - "+this.data.otherType;
        }
        this.data.userType=this.userTypes;
        console.log("data---",this.data)
        this.ts.updateCustomerTransaction(this.data).subscribe(
          (response) => {
            this.tab = 'tab3';
          },
          error => {
            alert('error')
          }
        ) }
        break;

        case 'cancel': {
          this.transaction_id=this.data.transactionId;     
          this.cancelSucessmsg='cancel';
          $("#cancelTrasactioncnd").show();         
        }
          break;

          case 'cancelTransaction': {
        const param={
          "transactionId":this.transaction_id,
          "userId":sessionStorage.getItem('userID'),
        }  

        this.ts.cancelTransaction(param).subscribe(
          (response) => {
                $('#cancelTrasactioncnd').hide();
            this.tab = 'tab3';
          },
          error => {
            alert('error')
          }
        )     
          }
            break;

            case 'notCancelTransaction': {
              $('#cancelTrasactioncnd').hide();      
            }
              break;

      case 'ok': {

        this.closed();
        this.tab = 'tab1';
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/${this.status}`]);
      });
      }
        break;
      case 'preview': {
        this.tab = 'tab2';
        this.title = 'preview Transaction';

        if(this.data.lcProForma){
          this.viewDisable=false;
          this.noFileDisable=true;
        }else{
          this.noFileDisable=false;
         this.viewDisable=true;

        }
        setTimeout(() => {
          // $('input').attr('readonly', true);
        }, 200);
      }
        break;
    }

  }

  close(){
    $('.modal3').hide();
  }

  openDocument(file){
    $('#myModalCD').show();
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
              portLoadingOnchange(countryName){
                const param={
                        "countryName":countryName
                      }    
                this.upls.getPortByCountry(param).subscribe(
                  (response) => {
                    this.portOfLoading = JSON.parse(JSON.stringify(response)).data;
                   

                  });
            }
            portDischargeOnchange(countryName){
  
              const data={
                        "countryName":countryName
                      }    
                this.upls.getPortByCountry(data).subscribe(
                  (response) => {
                    this.portOfDischarge = JSON.parse(JSON.stringify(response)).data;
                  });
            }

            validateRegexFields(event, type){
              var key = event.keyCode;
              if(type == "number"){
                const reg = /^-?\d*(\.\d{0,2})?$/;
                let input = event.target.value + String.fromCharCode(event.charCode);
                if (!reg.test(input)) {
                  event.preventDefault();
              }
               // ValidateRegex.validateNumber(event);
              }
              else if(type == "alpha"){
                ValidateRegex.alphaOnly(event);
              }
              else if(type == "alphaNum"){
                ValidateRegex.alphaNumeric(event);
              }
              else if(type == "alphaNumericNoSpace"){
                ValidateRegex.alphaNumericNoSpace(event);
              }
              else if(type == "date_validation"){     
                if (key!=191 && key!=189 && key > 31 && (key < 48 || key > 57)) {
                  event.preventDefault();
                }
              }
          
            }

            preview(val){
              console.log('amount', val);
              let inputStr = Number(val);
           
              if (Number(inputStr)+Number(this.retentionAmt) > Number(this.amount)){
                this.errMsg = true;
                return;
              } else{
                this.errMsg= false; 
              }
              this.minParticipationAmt = inputStr;
              console.log(this.minParticipationAmt);
                }
                
                previewamout(val){
                  console.log('amount', val);
                  let inputString = Number(val);
                  console.log(this.minParticipationAmt);
                 
                  if (Number(inputString)+Number(this.minParticipationAmt) > Number(this.amount)){
                    this.errMsg = true;
                    return;
                  } else{
                    this.errMsg= false; 
                  }
          this.retentionAmt = inputString;
          console.log(this.retentionAmt);
                    }

                    calculateDiff() {
                      var firstDate = moment(new Date(this.data.lCIssuingDate));
                      var secondDate = moment(new Date(this.data.lcMaturityDate));
                      var diffInDays = Math.abs(firstDate.diff(secondDate, 'days'));
                      this.data.usanceDays = (diffInDays  + 1);
                      console.log(this.data.usanceDays);
                    }

                    
                    onBGSelect(item) {
                      if(item==""){
                    this.isBgOther=true;      
                   }else{
                  this.isBgOther=false;
                 }
                } 
}
