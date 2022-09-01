import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import * as $ from 'src/assets/js/jquery.min';
import { manageSub } from 'src/assets/js/commons'
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { loads } from 'src/assets/js/commons';
import { formatDate } from '@angular/common';
import { SignupService } from 'src/app/services/signup/signup.service';
import { InterestedCountry } from 'src/app/beans/interestedcountry';
import { BlackListedGoods } from 'src/app/beans/blacklistedgoods';
import { ValidateRegex } from 'src/app/beans/Validations';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
import { DashboardDetailsService } from 'src/app/services/dashboard-details/dashboard-details.service';
import { LoginService } from 'src/app/services/login/login.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { environment } from 'src/environments/environment';
import { BeneInterestedCountry } from 'src/app/beans/BeneInterestedCountry';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  userData:any;
  noData:any;
  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  respMessage: any;
  resp: any;

  dropdownSetting = {};
  public intCountries: InterestedCountry[] = [];
  public intBeneCountries: BeneInterestedCountry[] = [];
  public blg: BlackListedGoods[] = [];
  public intCountriesValue: any[] = [];
  public blgValue: any[] = [];
  subsidiries:any;
  subuticount:any;
  available:any;
  countryCode: any=" ";
  hasCountrycode: boolean=false;
  dropdownSettingGoods={};
  goodsArray: Array<string> = [];
  countryArray: Array<string> = [];
  isBankOther: boolean;
  countryName: any;
  disabledNone: boolean=false;
  isOptionNone: boolean=false;
  BGselected: any;
  nimaiCount: any;
  tradeName: string;
  currencies: any;
  trnxPendingMsg: string;
  tradeSupport: string;
  //ccyDisable: boolean=true;
    constructor(public router: Router, public getCount: SubscriptionDetailsService,public loginService: LoginService,public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ResetPasswordService, public signUpService: SignupService,public service: DashboardDetailsService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

   
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'code',
      textField: 'country',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    }
    this.dropdownSettingGoods = {
      singleSelection: false,
      idField: 'id',
      textField: 'productCategory',
    //    selectAllText: 'Select All',
    //  unSelectAllText: 'Unselect All',
     itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll:false
    
    }
    
  }

  manageSubForm = this.formBuilder.group({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    country: new FormControl('',[Validators.required]),
    mobileNo: new FormControl('',[Validators.minLength(7)]),
    landlineNo: new FormControl('',[Validators.required, Validators.minLength(7)]),
    emailId: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]),
    countriesInt: new FormControl('',[Validators.required]),
    minLCValue: new FormControl(''),
    regCurrency: new FormControl('',[Validators.required]),
    blacklistedGC: new FormControl('',[Validators.required]),
    otherTypeBank:new FormControl(''),
    beneInterestedCountry:new FormControl('',[Validators.required]),

  });

  get manageSubDetails() {
    return this.manageSubForm.controls;
  }

 


  onItemSelect(item: any) {
    if(item.productCategory=="Others"){
      this.isBankOther=true;      
     // loads();
    }
    else{
      this.isBankOther=false;
    }

  

if(item.productCategory=='None'){ 
  this.isOptionNone=true;
   this.disabledNone=true
   this.BGselected = [{ id: '1',productCategory: "None",description:""}];
}else{
  this.disabledNone=false;
}
  }
  closeNone(){
    this.manageSubForm.get('blacklistedGC').setValue('');
    this.disabledNone=false
    this.isOptionNone=false;
  }
  onSelectAll(item: any) {
   
  }

  ngOnInit() {
    this.tradeName= environment.name;
    this.tradeSupport= environment.support;

    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress":sessionStorage.getItem('branchUserEmailId')
    }

    this.getCount.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
      response => {        
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
        this.subsidiries=this.nimaiCount.subsidiries;;  
        this.subuticount=this.nimaiCount.subuticount;;
        this.available=this.subsidiries-this.subuticount
      })

    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
    this.currencies = JSON.parse(sessionStorage.getItem('currencyData'));
    this.goodsService();

    loads();
    manageSub();
    this.listOfUsers();
  }
  goodsService() {
    this.loginService.getGoodsData().
      subscribe(
        (response) => {
          this.goodsArray = JSON.parse(JSON.stringify(response));
        },
        (error) => {}
      )
}
  listOfUsers(){
    let userID: string = sessionStorage.getItem('userID');

    this.service.getUserList(userID).subscribe(
      (response) => {
        if(JSON.parse(JSON.stringify(response)).data)
          this.userData = JSON.parse(JSON.stringify(response)).data;
        else
          this.userData=""  
        if(this.userData.length === 0){
          this.noData = true;
        }else{
          this.noData=false;
        }
       
      },(error) =>{
        this.noData = true;
      }
      )
  }
  close() {
    this.isBankOther=false;
    this.disabledNone=false;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-user`]);
  });
   // $("#addsub").hide();
   

  }

  onOkClick(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-user`]);
      });
   // window.location.reload();
    $("#addsub").hide();
  }
  pendingOkBtn(){
    $('#txnPendingAdd').hide();
  }
  addSubsidiary() {
   
    if(sessionStorage.getItem('paymentstatus').toLowerCase()=="pending")
{
  this.trnxPendingMsg="Your payment is sent for approval. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
  $("#txnPendingAdd").show() ; 
}else{
    $("#addsub").show();
    this.manageSubForm.reset();
    this.respMessage = "";
}
  }

  onSubmit() { 
  
    var minValue = this.manageSubForm.get('minLCValue').value;
    var regCurrency = this.manageSubForm.get('regCurrency').value;

    if(minValue>0)
    {     
      this.manageSubForm.get('regCurrency').setValidators(Validators.required);
      this.manageSubForm.get('regCurrency').updateValueAndValidity();
    }else{
      this.manageSubForm.get('regCurrency').clearValidators()
      this.manageSubForm.get('regCurrency').updateValueAndValidity();
    }
   
    if(regCurrency)
    {      

      this.manageSubForm.get('minLCValue').setValidators(Validators.required);
      this.manageSubForm.get('minLCValue').updateValueAndValidity();
    }else{
      this.manageSubForm.get('minLCValue').clearValidators()
      this.manageSubForm.get('minLCValue').updateValueAndValidity();
    }
    // if(this.manageSubForm.get('minLCValue').value) {
    //   this.manageSubForm.get('regCurrency').setValidators(Validators.required)
    // } else{
    //   this.manageSubForm.get('regCurrency').clearValidators();
    //   this.manageSubForm.get('regCurrency').updateValueAndValidity();

    // }
    // if(!this.manageSubForm.get('minLCValue').value){
    //   this.manageSubForm.get('regCurrency').setValue("")
    // }
    this.submitted = true;    
    if (this.manageSubForm.invalid) {
      return;
    }
    this.submitted = false;
    this.blgValue = this.manageSubForm.get('blacklistedGC').value;
    this.intCountriesValue = this.manageSubForm.get('countriesInt').value;
    //this.intBeneCountries
    this.blg = [];
    this.intCountries = [];
    for (let vlg of this.blgValue) {
      let blgData;
      if(vlg.productCategory == 'Others'){
         var bankothers= this.manageSubForm.get('otherTypeBank').value;
           blgData = {
            goods_ID: null,
            goodsMId: vlg.id,
            blackListGoods:"Others - "+bankothers,
          }
      }else{
         blgData = {
          goods_ID: null,
          goodsMId: vlg.id,
          blackListGoods: vlg.productCategory
        }
      }
     
     
      this.blg.push(blgData);
    }

    for (let icc of this.intCountriesValue) {
      let icData = {
        countryID: null,
        ccid: icc.code,
        countriesIntrested: icc.country
      }
      this.intCountries.push(icData);
    }

    var minValue = this.manageSubForm.get('minLCValue').value;
    if(minValue == "" ||minValue == null){
      minValue = '0';
    }
    var regCurrency = this.manageSubForm.get('regCurrency').value;

    if(regCurrency == "" ||regCurrency == null){
      regCurrency = "";
    }
    let data = {
      isAssociated: 0,
      firstName: this.manageSubForm.get('firstName').value,
      lastName: this.manageSubForm.get('lastName').value,
      emailAddress: this.manageSubForm.get('emailId').value,
      mobileNum: this.manageSubForm.get('mobileNo').value,
      countryName: this.countryName,
      landLinenumber: this.manageSubForm.get('landlineNo').value,
      companyName: '',
      designation: '',
      businessType: '',
      userId: "",
      bankType: "underwriter",
      subscriberType: "bank",
      minLCValue: minValue,
      interestedCountry: this.intCountries,
      blacklistedGoods: this.blg,
      beneInterestedCountry:this.intBeneCountries,
      account_source: sessionStorage.getItem('userID'),
      account_type: "BANKUSER",
      account_status: "ACTIVE",
      account_created_date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US'),
      regCurrency: regCurrency,
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: "",
      otherTypeBank:'',
      otherType:'',
    }

    const fg = {
      event: 'ACCOUNT_ACTIVATE',
      email: this.manageSubForm.get('emailId').value,
    }
    
    this.signUpService.signUp(data).subscribe((response) => {
      this.respMessage = JSON.parse(JSON.stringify(response)).message;
      let res= JSON.parse(JSON.stringify(response))
      if(res.status!=="Failure"){
        this.fps.sendRegistrationEmail(fg)
        .subscribe(
          (response) => {
            this.resetPopup();
            this.respMessage = "You've successfully invited an additional user to join "+this.tradeName+". You will be notified once the invitee completes the sign up process."
          },
          (error) => {
            this.resetPopup();
            this.respMessage = "Service not working! Please try again later."
          }
        )
       }else{
        this.resetPopup();
        this.respMessage = res.errMessage;
      }

    },
    (error) => {
     console.log("error--",error)
     let err= JSON.parse(JSON.stringify(error.error))
      this.resetPopup();
      this.respMessage = err.errMessage
    }
   )
  }
 
  resetPopup(){
    $('#authemaildiv').slideUp();
    $('#paradiv').slideDown();
    $('#okbtn').show();
    $('#btninvite').hide();
    this.manageSubForm.reset();
   }
  validateRegexFields(event, type){
 
    if(this.manageSubForm.get('minLCValue').value){
      //this.ccyDisable=false
    }

    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }else if(type=="name_validation"){
      var key = event.keyCode;
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/)) {
          event.preventDefault();
      }    
    }
  }
  showCountryCode(data){
    this.countryName = data.country;
    this.countryCode = data.code;
    if(this.countryCode){
      this.hasCountrycode=true;
    }
  }
}

