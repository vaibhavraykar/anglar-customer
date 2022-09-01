import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { signup } from 'src/app/beans/signup';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import * as $ from '../../../assets/js/jquery.min';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { loads, selectpickercall } from '../../../assets/js/commons';
import { ValidateRegex } from '../../beans/Validations';
import { LoginService } from 'src/app/services/login/login.service';
import { SignupService } from 'src/app/services/signup/signup.service';


const pd = this;
@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})

export class PersonalDetailsComponent implements OnInit {


  public loading = true;



  public personalDetailsForm: FormGroup;
  public personalDetails: signup = null;
  public isReferrer: boolean = false;
  public isBankCustomer: boolean = false;
  public isBankUnderwriter: boolean = false;
  public username: string = "";
  public submitted:boolean = false;

  dropdownSetting = {};
  dropdownSettingBene = {};
  dropdownSettingGoods={};
  goodsArray: Array<string> = [];
  countryArray: Array<string> = [];

  intCntTemp: any[] = [];
  goodsCntTemp:any[]=[];
  blgTemp: any[] = [];
  intBeneCntTemp: any[] = [];
  public title: string = "Personal Details";

  public parentURL: string = "";
  public subURL: string = "";
  public hasValue=false;
  resp: any;
  parentRedirection: string = "business-details";
  isBankOther: boolean=false;
  public isReferrerOther=false;
  busiType:any;
  otherType:any;
  isOptionNone: boolean=false;
  disabledNone: boolean=false;
  otherTypeBank: string;
  validEmail1: boolean=false;
  validEmail2: boolean=false;
  validEmail3: boolean=false;
  validEmail: boolean=false;
  email: string;
  currencies: any;
  constructor(public activatedRoute: ActivatedRoute,public service :SignupService,public loginService: LoginService, public fb: FormBuilder, public router: Router, public personalDetailsService: PersonalDetailsService, public titleService: TitleService) {
    if(sessionStorage.getItem('userID'))
    {
      this.hasValue=true;
    }else{
      this.hasValue=false;
    }
    // const dat=  {
    //   "userId":sessionStorage.getItem('userID'),
    //   "password":"password"
    // }
    // this.service.authenticate(dat).subscribe((response)=>{
    // sessionStorage.setItem('token',JSON.parse(JSON.stringify(response)).token)
    // this.getPersonalDetails(sessionStorage.getItem('userID'),JSON.parse(JSON.stringify(response)).token);

    // })
    if(sessionStorage.getItem('branchUserEmailId')==""){
      this.email="email";
        }else{
          this.email=sessionStorage.getItem('branchUserEmailId');
        }
    this.getPersonalDetails(sessionStorage.getItem('userID'),this.email,sessionStorage.getItem('token'));

    this.personalDetailsForm = this.fb.group({
      userId: [''],
      subscriberType: [''],
      bankType: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]],
      mobileNo: ['', [Validators.minLength(7)]],
      landLineNo: ['',Validators.minLength(7)],
      country: ['', Validators.required],
      companyName: [''],
      designation: [''],
      businessType: [''],
      otherType:[''],
      countriesInt: [''],
      beneInterestedCountry:[''],
      minLCVal: [''],
      regCurrency:[''],
      blacklistedGC: [''],
      otherTypeBank:[''],
      // otherEmails: this.fb.array([this.getOtherMails()])
      emailAddress1: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")],
      emailAddress2: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")],
      emailAddress3: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]

    })
    
    this.titleService.changeTitle(this.title);
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'code',
      textField: 'country',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    }
    this.dropdownSettingBene = {
      singleSelection: false,
      idField: 'code',
      textField: 'country',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    }
    
    this.dropdownSettingGoods = {
      singleSelection: false,
      idField: 'id',
      textField: 'productCategory',
      // selectAllText: 'Select All',
      // unSelectAllText: 'Unselect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll:false
    }
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    let navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "MyProfile"){
        this.parentRedirection = "my-profile";
      }
    }

  }

  getOtherMails(){
    var count = 0;
    return this.fb.group({
      emailAddress: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]
  });
  }

  add(i: number) {
    let items = this.personalDetailsForm.get('otherEmails') as FormArray;
    if (items.length < 3)
    {
      items.push(this.getOtherMails());
    }
  }

  remove(i: number) {
    let items = this.personalDetailsForm.get('otherEmails') as FormArray;
    items.removeAt(i);
  }

  get perDetails() {
    return this.personalDetailsForm.controls;
  }

  ngOnInit() {
   // this.setUserCategoryValidators();
   this.goodsService();

    $("body").on("domChanged", function () {
      const inputs = $('.inputDiv').find('input');
      for (let input of inputs) {
        var text_val = $(input).val();
        if (text_val === "") {
          $(input).removeClass('has-value');
        } else {
          $(input).addClass('has-value');
        }
      };
    });

    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
    this.countryArray=JSON.parse(sessionStorage.getItem('countryData'));
    this.currencies = JSON.parse(sessionStorage.getItem('currencyData'));

  }
  setReferrerValidators(){
    this.personalDetailsForm.get('companyName').setValidators([Validators.required])
    this.personalDetailsForm.get('companyName').updateValueAndValidity();
    this.personalDetailsForm.get('businessType').setValidators([Validators.required])
    this.personalDetailsForm.get('businessType').updateValueAndValidity();
    this.personalDetailsForm.get('designation').setValidators([Validators.required])
    this.personalDetailsForm.get('designation').updateValueAndValidity();
  }
  setBankAsUnderwriterValidators(){
    this.personalDetailsForm.get('blacklistedGC').setValidators([Validators.required])
    this.personalDetailsForm.get('blacklistedGC').updateValueAndValidity();
    this.personalDetailsForm.get('countriesInt').setValidators([Validators.required])
    this.personalDetailsForm.get('countriesInt').updateValueAndValidity();
    this.personalDetailsForm.get('beneInterestedCountry').setValidators([Validators.required])
    this.personalDetailsForm.get('beneInterestedCountry').updateValueAndValidity();
    this.personalDetailsForm.get('mobileNo').clearValidators();
    this.personalDetailsForm.get('mobileNo').updateValueAndValidity();
    this.personalDetailsForm.get('landLineNo').setValidators([Validators.required,Validators.minLength(7)])
    this.personalDetailsForm.get('landLineNo').updateValueAndValidity();
   }
   setBankAsCustomerValidators(){
    this.personalDetailsForm.get('mobileNo').clearValidators();
   // this.personalDetailsForm.get('mobileNo').setValidators([Validators.minLength(7)])
    this.personalDetailsForm.get('mobileNo').updateValueAndValidity();
    this.personalDetailsForm.get('landLineNo').setValidators([Validators.required,Validators.minLength(7)])
    this.personalDetailsForm.get('landLineNo').updateValueAndValidity();
    
   }
   setCustomerValidators(){
    this.personalDetailsForm.get('landLineNo').clearValidators();
    this.personalDetailsForm.get('landLineNo').setValidators([Validators.minLength(7)])
    this.personalDetailsForm.get('landLineNo').updateValueAndValidity();
    this.personalDetailsForm.get('mobileNo').setValidators([Validators.required,Validators.minLength(7)])
    this.personalDetailsForm.get('mobileNo').updateValueAndValidity();
    
   }
  submit(): void {

  
  let emailId=  this.personalDetailsForm.get('emailId').value;
  let emailId1=  this.personalDetailsForm.get('emailAddress1').value
  let emailId2=  this.personalDetailsForm.get('emailAddress2').value
  let emailId3=  this.personalDetailsForm.get('emailAddress3').value

if(emailId==emailId1 || emailId==emailId2 || emailId==emailId3){
alert('Official Email ID and Additional Email ID cannot be same ')
this.validEmail=false;
}else{
  this.validEmail=true;

}
 if(emailId1 && emailId2 ){
  if(emailId1 == emailId2 ){
    alert('Email ID 1 and Email ID 2 cannot be same ')
   this.validEmail1=false;
  }else{
    this.validEmail1=true;
  }
 }else{
  this.validEmail1=true;
}
  if(emailId2 && emailId3){
  if(emailId2 == emailId3 ){
    alert('Email ID 2 and Email ID 3 cannot be same ')
    this.validEmail2=false;
  }else{
    this.validEmail2=true;
  }
}else{
  this.validEmail2=true;
}
 if(emailId1 && emailId3){
  if(emailId1 == emailId3 ){
    alert('Email ID 1 and Email ID 3 cannot be same ')
    this.validEmail3=false;
  }else{
    this.validEmail3=true;
  }
}else{
  this.validEmail3=true;
}
 if(this.validEmail1 && this.validEmail2 && this.validEmail3 && this.validEmail){

    this.submitted = true;
   
    if(this.personalDetailsForm.invalid) {
      return;
    }
    this.submitted = false;
    this.titleService.loading.next(true);
    let userID = this.personalDetailsForm.get('userId').value;

    if (userID.startsWith('RE')) {
      this.parentRedirection = "kyc-details"
    }
   
    this.personalDetailsService.updatePersonalDetails(this.pdb(), sessionStorage.getItem('token'))
      .subscribe(
        (response) => {
         this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congratulations! Your Personal Details has been successfully submitted!',
              message: '',
              parent: this.subURL + '/' + this.parentURL + '/' + this.parentRedirection  // need to check
            }
          };

          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/personal-details/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
           }); 
        },
        (error) => {
          this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: ' Your Personal Details has been failed !!!',
              message: 'Invalid Data',
              parent: this.subURL + "/" + this.parentURL + '/personal-details'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/personal-details/error`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }
      )
      }
  
    }
  public getPersonalDetails(userID: string,email:string,token) {
   
    this.titleService.loading.next(true);
    this.personalDetailsService.getPersonalDetails(userID,email,token)
   
      .subscribe(
        (response) => {
          let responseData = JSON.parse(JSON.stringify(response));
          this.personalDetails = responseData.data;
          console.log(this.personalDetails);
          this.username = this.personalDetails.firstName + " " + this.personalDetails.lastName;
          this.titleService.changeUserName(this.username);
          if(this.personalDetails.businessType=="Bank" || this.personalDetails.businessType=="CA Firm" || this.personalDetails.businessType=="Law Firm" || this.personalDetails.businessType=="Corporate" || this.personalDetails.businessType=="Consultant")
          {
            this.busiType=this.personalDetails.businessType;
            this.isReferrerOther=false;
          }else{
            this.busiType="Others"
            this.isReferrerOther=true;
            this.otherType=this.personalDetails.otherType;
          }
          if(this.personalDetails.otherTypeBank != ""){
            console.log(this.personalDetails.otherType, 'other type');
            this.isBankOther=true;
            console.log(' i m true bank other');
            this.otherTypeBank=this.personalDetails.otherTypeBank;
          }
         
          this.personalDetailsForm.patchValue({
            firstName: this.personalDetails.firstName,
            lastName: this.personalDetails.lastName,
            emailId: this.personalDetails.emailAddress,
            mobileNo: this.personalDetails.mobileNum,
            landLineNo: this.personalDetails.landLinenumber,
            country: this.personalDetails.countryName,
            companyName: this.personalDetails.companyName,
            designation: this.personalDetails.designation,
            businessType: this.busiType,
            otherType: this.personalDetails.otherType,
            otherTypeBank:this.otherTypeBank,
            userId: this.personalDetails.userId,
            subscriberType: this.personalDetails.subscriberType,
            bankType: this.personalDetails.bankType,
            countriesInt: this.filterInterestedCountry(this.personalDetails.interestedCountry),
            beneInterestedCountry: this.filterInterestedBeneCountry(this.personalDetails.beneInterestedCountry),
            minLCVal: this.personalDetails.minLCValue,
            regCurrency:this.personalDetails.regCurrency,
            blacklistedGC: this.filterBlackListGoods(this.personalDetails.blacklistedGoods),
            emailAddress1: this.personalDetails.emailAddress1,
            emailAddress2: this.personalDetails.emailAddress2,
            emailAddress3: this.personalDetails.emailAddress3,

          })
          sessionStorage.setItem('custUserEmailId',this.personalDetails.emailAddress);
         if(this.personalDetails.interestedCountry)
         this.intCntTemp = this.filterDataINCT(this.personalDetails.interestedCountry);
         if(this.personalDetails.blacklistedGoods)
          this.blgTemp = this.filterDataBG(this.personalDetails.blacklistedGoods); 
         if(this.personalDetails.beneInterestedCountry)
         this.intBeneCntTemp = this.filterDataINBeneCT(this.personalDetails.beneInterestedCountry);

         
          let subscriptionType = this.personalDetailsForm.get('subscriberType').value;
          let bankType = this.personalDetails.bankType
        
          if (subscriptionType === 'REFERRER') {
            this.isReferrer = true;
            this.isBankCustomer = false;
            this.isBankUnderwriter = false;
            this.setReferrerValidators();
          } else if ((subscriptionType === 'BANK' && bankType === 'UNDERWRITER')) {
            this.isBankUnderwriter = true;
            this.isBankCustomer = false;
            this.isReferrer = false;
            this.setBankAsUnderwriterValidators();
          }else if ((subscriptionType === 'BANK' && bankType === 'CUSTOMER')) {
            this.isBankCustomer = true;
            this.isBankUnderwriter = false;
            this.isReferrer = false;
            this.setBankAsCustomerValidators();
          }  else if ((subscriptionType === 'CUSTOMER')) {
            this.isBankCustomer = false;
            this.isBankUnderwriter = false;
            this.isReferrer = false;
            this.setCustomerValidators();
          }
          else {
            this.isBankUnderwriter = false;
            this.isBankCustomer = false;
            this.isReferrer = false;
          }
          setTimeout(() => {
            selectpickercall();
            loads();
            //$('.selectpicker').selectpicker('val', ['India', 'USA']);
          }, 200);

          const pd = this;
          setTimeout(function () {
            const inputs = $('.inputDiv').find('input');
            for (let input of inputs) {
              var text_val = $(input).val();
              if (text_val === "") {
                $(input).removeClass('has-value');
              } else {
                $(input).addClass('has-value');
              }
            };
            pd.loading = false;
          }, 1000)


          const selects = $('.inputDiv').find('select')

          for (let select of selects) {
            var text_val = $(select).val();
            if (text_val === "") {
              $(select).css('color', 'transparent');
              $(select).removeClass('has-value');
            } else {
              $(select).css('color', 'black');
              $(select).addClass('has-value');
            }
          };

          this.titleService.loading.next(false);

        },
        (error) => {
          this.titleService.loading.next(false);
          this.personalDetails = null;
        }
      )
  }
  filterDataBG(blacklistedGoods: import("../../beans/blacklistedgoods").BlackListedGoods[]): any[] {
    var data:any[]=[];
    for(var acdata of blacklistedGoods){
      if(acdata.blackListGoods){
      var d={
        id:acdata.goodsMId,
        productCategory:acdata.blackListGoods
      }
      data.push(d);
    }
    }
    return data;
  }
  filterDataINCT(interestedCountry: import("../../beans/interestedcountry").InterestedCountry[]): any[] {
    var data:any[]=[];
    for(var acdata of interestedCountry){
      if(acdata.countriesIntrested){
      var d={
        code:acdata.ccid,
        country:acdata.countriesIntrested
      }
      data.push(d);
    }
    }
    return data;
  }
  filterDataINBeneCT(beneInterestedCountry: import("../../beans/BeneInterestedCountry").BeneInterestedCountry[]): any[] {
    var data:any[]=[];
    for(var acdata of beneInterestedCountry){
      if(acdata.countriesIntrested){
      var d={
        code:acdata.ccid,
        country:acdata.countriesIntrested
      }
      data.push(d);
    }
    }
    return data;
  }
  public pdb(): signup {
    if(this.isReferrerOther){      
      this.personalDetailsForm.get('businessType').setValue(this.personalDetailsForm.get('otherType').value)
 
    }
    // if(this.personalDetailsForm.get('otherTypeBank').value){
    //   this.otherType= this.personalDetailsForm.get('otherTypeBank').value
    //  }else{
    //   this.otherType= this.personalDetailsForm.get('otherType').value
    //  }
    let data = {
      subscriberType: this.personalDetailsForm.get('subscriberType').value,
      firstName: this.personalDetailsForm.get('firstName').value,
      lastName: this.personalDetailsForm.get('lastName').value,
      emailAddress: this.personalDetailsForm.get('emailId').value,
      mobileNum: this.personalDetailsForm.get('mobileNo').value,
      countryName: this.personalDetailsForm.get('country').value,
      landLinenumber: this.personalDetailsForm.get('landLineNo').value,
      companyName: this.personalDetailsForm.get('companyName').value,
      designation: this.personalDetailsForm.get('designation').value,
      businessType: this.personalDetailsForm.get('businessType').value,
      userId: this.personalDetailsForm.get('userId').value,
      bankType: this.personalDetailsForm.get('bankType').value,
      minLCValue: this.personalDetailsForm.get('minLCVal').value,
      regCurrency:this.personalDetailsForm.get('regCurrency').value,
      interestedCountry: this.filterForSaveIntCon(this.intCntTemp),
      beneInterestedCountry: this.filterForSaveIntBeneCon(this.intBeneCntTemp),
      blacklistedGoods: this.filterForSaveBlg(this.blgTemp),
      emailAddress1: this.personalDetailsForm.get('emailAddress1').value,
      emailAddress2: this.personalDetailsForm.get('emailAddress2').value,
      emailAddress3: this.personalDetailsForm.get('emailAddress3').value,
      otherTypeBank:this.personalDetailsForm.get('otherTypeBank').value,
      otherType:this.personalDetailsForm.get('otherType').value,
       
    }


    return data;
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


  // goodsService() {
  //   return [{ id: 0, name: 'None' },{ id: 1, name: 'Gold' }, { id: 2, name: 'Drugs' }, { id: 3, name: 'Diamonds' }]
  // }


  // getGoodsName(gid: number) {
  //   return this.goodsService().filter((res) => res.id == gid)[0];
  // }

  
  onItemSelect(item: any) {
    //this.intCntTemp.push(item);
    console.log(item);
    // console.log(this.filterForSaveIntCon(this.intCntTemp, this.personalDetailsForm.get('countriesInt').value))
    // console.log(this.filterForSaveBlg(this.blgTemp, this.personalDetailsForm.get('blacklistedGC').value))
  }





  onSelectAll(item: any) {
    console.log(item);
    //this.intCntTemp=item;
  }
  onItemDeSelect(item:any){
    console.log(item)
    
  }

  onItemSelectBG(item: any) {
    if(item.productCategory=="Others"){
      this.isBankOther=true;      
     // loads();
    }else{
      this.isBankOther=false;
    }

    // if(item.id === 0){
    //  this.blgTemp=[];
    //  this.blgTemp.push(item)
    // }
  
if(item.productCategory=='None'){ 
  this.isOptionNone=true;
   this.disabledNone=true
   this.blgTemp = [{ id: '1',productCategory: "None",description:""}];
}else{
  this.disabledNone=false;
}
  }
  closeNone(){
    this.personalDetailsForm.get('blacklistedGC').setValue('');
    this.disabledNone=false
    this.isOptionNone=false;
  }

  onSelectAllBG(item: any) {
    console.log(item);
   // this.blgTemp=item;
  }
  onItemDeSelectBG(item:any){
    console.log(item)
   
  }
  

  filterInterestedCountry(data: any[]) {
    let dataArr: any[] = [];
    if (data != null)
      for (let d of data) {
        let dd = {
          code: d.ccid,
          country: d.countriesIntrested
        }
        dataArr.push(dd);
      }   
    return dataArr;
  }

  filterInterestedBeneCountry(data: any[]) {
    let dataArr: any[] = [];
    if (data != null)
      for (let d of data) {
        let dd = {
          code: d.ccid,
          country: d.countriesIntrested
        }
        dataArr.push(dd);
      }   
    return dataArr;
  }
  filterBlackListGoods(data: any[]) {
    let dataArr: any[] = [];
    if (data != null)
      for (let d of data) {
        let dd = {
          id: d.goodsMId,
          productCategory: d.blackListGoods
        }
        dataArr.push(dd);
      }
    return dataArr;
  }
  filterForSaveIntCon(data: any[]) {    
    let dataArr: any[] = [];
    for (let d1 of data) {     
        let dd = {
          countryID: null,
          countriesIntrested: d1.country,
          ccid: d1.code
        }
        dataArr.push(dd)
    }
    return dataArr;
  }

  filterForSaveIntBeneCon(data: any[]) {    
    let dataArr: any[] = [];
    for (let d1 of data) {     
        let dd = {
          countryID: null,
          countriesIntrested: d1.country,
          ccid: d1.code
        }
        dataArr.push(dd)
    }
    return dataArr;
  }

  filterForSaveBlg(data: any[]) {
    let dataArr: any[] = [];
    for (let d1 of data) {
      let dd
      if(d1.productCategory == 'Others'){
        var bankothers= this.personalDetailsForm.get('otherTypeBank').value;
         dd = {
          goods_ID: null,
          //blackListGoods: "Others - "+bankothers,
          blackListGoods: "Others ",
          goodsMId: d1.id
        }
     }else{
       dd = {
        goods_ID: null,
        blackListGoods: d1.productCategory,
        goodsMId: d1.id
      }
    }
       
        dataArr.push(dd)
      


    }
    return dataArr;
  }
  validateRegexFields(event, type) {
    if (type == "number") {
      ValidateRegex.validateNumber(event);
    }
    else if (type == "alpha") {
      ValidateRegex.alphaOnly(event);
    }
    else if (type == "alphaNum") {
      ValidateRegex.alphaNumeric(event);
    }else if(type=="name_validation"){
      var key = event.keyCode;
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/|| key==32/*SPACE*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/)) {
          event.preventDefault();
      }    
    }
  }

  changeType(type){    
    if(type=="Others"){
      this.isReferrerOther=true;      
      loads();

    }else{
      this.isReferrerOther=false;
    }
  }
}
