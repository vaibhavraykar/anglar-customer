import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TermAndConditionsComponent } from 'src/app/default/term-and-conditions/term-and-conditions.component';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { LoaderServiceService } from 'src/app/services/loader/loader-service.service';
import { LoginService } from 'src/app/services/login/login.service';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { SignupService } from 'src/app/services/signup/signup.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { load_dashboard } from '../../../assets/js/commons'
import * as $ from 'src/assets/js/jquery.min';

@Component({
  selector: 'app-offlinedashboard',
  templateUrl: './offlinedashboard.component.html',
  styleUrls: ['./offlinedashboard.component.css']
})
export class OfflinedashboardComponent implements OnInit {
  @ViewChild(TermAndConditionsComponent, { static: true }) termsAndconditions: TermAndConditionsComponent;

  public searchForm: FormGroup;
  public title: string = "Dashboard";
  public username: string = "";
  public isReferrer: boolean = false;
  public isCustomer: boolean = false;
  public isBank: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  public accountPages: string = "";
  public transactionpages: string = "";
  public transactionpages2: string = "";
  public transactionpages3: string = "";
  public transactionpages1:string ="";
  public isCollapsed: string = "collapsed";
  public areaExpandedacc: boolean = false;
  public areaExpandedass: boolean = false;
  public areaExpandedtra: boolean = false;
  public isDisablePlan:boolean=false;
  public isDisableKyc:boolean=false;
  public hidePlanFromProfile:boolean=false;
  public hidePlanFromMenu:boolean=false;
  public hideManageUser:boolean=false;
  public hideMyProfile:boolean=true;
  
  public hideCreditTransaction:boolean=false;
  draftData: any;
  draftDatas: any;
  draftData1: any;
  draftcount: any;
  draftcountBank: any;
  nimaiCount: any = "";
  isQuote = false;
  loading = false;
  userType: any;
  creditCount: any;
  userStat: any;
  creditenable: string;
  enableuserStat: boolean=false;
  referenceTab:boolean=false;
  hideSubAccount: boolean=false;
  accountType: string;
  public hideVas: boolean=true;
  emailid: string="";
  hideRefer: boolean=false;
  hideChangepass: boolean=false;
  token: any;
  tradeName: string;
  email: string;
  accStatus: any;
  isFieo: boolean=true;
  draftcountBankQuote: any;
  draftcountBankQuotes: any;
  notaccessed: boolean;
  constructor(public service: UploadLcService,public Service: SignupService, public fb: FormBuilder, public titleService: TitleService, public psd: PersonalDetailsService,public nts:NewTransactionService,
    private loaderservice: LoaderServiceService,
     public activatedRoute: ActivatedRoute, public router: Router, public getCount: SubscriptionDetailsService,public loginService: LoginService) {
      this.username = sessionStorage.getItem('username');
      console.log(this.username);
      this.activatedRoute.parent.url.subscribe((urlPath) => {
        this.parentURL = urlPath[urlPath.length - 1].path;
        console.log(this.parentURL);
      });
      this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
        this.subURL = urlPath[urlPath.length - 1].path;
      })
      this.titleService.loading.next(true);
      let userId = sessionStorage.getItem('userID');
     
    if (userId.startsWith('RE')) {
      this.isReferrer = true;
    } else if (userId.startsWith('CU')) {
      this.isReferrer = false;
      this.isCustomer = true;
      this.isBank = false;
      
    }   else if (userId.startsWith('BC')) {
      this.isReferrer = false;
      this.isCustomer = true;
      this.isBank = false;
     
    
    }else {
      this.isReferrer = false;
      this.isCustomer = false;
      this.isBank = true;
    }

    if (userId.startsWith('RE')) {
      this.userType = "Referrer";
      this.hideSubAccount=true;

      this.usersStat('RE');
    } else if (userId.startsWith('BC')) {
      this.userType = "Bank as a Customer";
      this.hideManageUser=true;
      this.hideRefer=false;
      this.hideCreditTransaction=true;
      this.usersStat('BC');
    } else if (userId.startsWith('CU')) {
      this.userType = "Customer";
      this.usersStat('CU');
    }  else if (userId.startsWith('BA')) {
      this.userType = "Bank as an Underwriter";

      this.usersStat('BA');
    }  else {
      this.userType = "";
    }



    
    if(sessionStorage.getItem('branchUserEmailId')==null || sessionStorage.getItem('branchUserEmailId')==undefined || sessionStorage.getItem('branchUserEmailId')=="undefined"){
    //  console.log("if")
      this.emailid=""
    }else{
      this.emailid=sessionStorage.getItem('branchUserEmailId')
    }
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress":this.emailid
    }

   




    this.nts.creditCount.subscribe(ccredit=>{
      this.creditCount=ccredit;
          });
  }

  ngOnInit() {
// new 
// this.loaderservice.hide();

// for get count 
let data = {
  "userid": sessionStorage.getItem('userID'),
  "emailAddress":this.emailid
}

this.getCount.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
  (response) =>{
    console.log(response);
  }
)


// end 
var userIdDetail = sessionStorage.getItem('userID');
var emailId = "";


if(sessionStorage.getItem('accountType')=='Passcode'){
  emailId = sessionStorage.getItem('branchUserEmailId');
}else{
  //emailId="";
  emailId = sessionStorage.getItem('branchUserEmailId');
}

if (userIdDetail.startsWith('BC')) {
  emailId = sessionStorage.getItem('branchUserEmailId');
}

const param = {
  userId: sessionStorage.getItem('userID'),
  "branchUserEmail": emailId
}
this.service.getCustDraftTransaction(param).subscribe(
  (response) => {
    // custTrnsactionDetail();
    this.draftDatas=[];
    this.draftDatas = JSON.parse(JSON.stringify(response)).data;
    if(this.draftDatas)
    if (this.draftDatas.length > 0) {
      this.draftcountBankQuotes = this.draftDatas.length;
      console.log(this.draftcountBankQuotes);
    }
    
 
  },(error) =>{
    
  }
  )
 
   this.titleService.loading.next(true);

  console.log(sessionStorage.getItem('branchUserEmailId'))
  if(sessionStorage.getItem('branchUserEmailId')==""){
this.email="email";
  }else{
    this.email=sessionStorage.getItem('branchUserEmailId');
  }


  //})
    load_dashboard();
    if (this.router.url === `/${this.parentURL}/baau/activerequest` || this.router.url === `/${this.parentURL}/baau/newrequest`|| this.router.url === `/${this.parentURL}/baau/transaction-details` || this.router.url === `/${this.parentURL}/baau/draft-transaction`) {
      this.transactionpages = "in"
      this.isCollapsed = ""
      this.areaExpandedtra = !this.areaExpandedtra
      console.log(this.areaExpandedtra, ' i in  pirmary');
    }
    else if (this.router.url === `/${this.parentURL}/baau/new-transaction-qoute` || this.router.url === `/${this.parentURL}/baau/active-transaction-qoute` || this.router.url === `/${this.parentURL}/baau/transaction-detail-qoute` || this.router.url === `/${this.parentURL}/baau/saved-transaction-qoute`) {
      this.transactionpages3 = "in"
      this.isCollapsed = ""
      // this.areaExpandedtra = !this.areaExpandedtra
      this.areaExpandedtra = false;
      this.areaExpandedass = false;
      this.areaExpandedacc = !this.areaExpandedacc
      console.log(this.areaExpandedtra, ' i am in secdonary');
      console.log(this.areaExpandedacc, ' i am in secdonary cc');
    }

    

    this.searchForm = this.fb.group({
      searchText: ['']
    });

    this.titleService.titleMessage.subscribe(title => this.title = title);
  
  }

  search(): void {

  }



  usersStat(users) {
    this.getCount.getUserStats()
    .subscribe(
      (response) => {
        this.userStat = JSON.parse(JSON.stringify(response)).data;
        var str = this.userStat; 
        var splittedStr = str.split(", ", 2); 
        if(users=='BA'){
         var colonSplit = splittedStr[1]
          var arrsplit = colonSplit.split(": ", 2); 
          this.userStat=arrsplit[1]+" banks placed quote on "+this.tradeName+" in last 24 hours";
        }else if(users=='CU' || users=='BC'){
        var colonSplit = splittedStr[0]
        var arrsplit = colonSplit.split(": ", 2); 
        this.userStat=arrsplit[1]+" customers placed transaction on "+this.tradeName+" in last 24 hours";
        }else if(users=='RE'){
           this.enableuserStat=true;
        }

      })
  }
 
 
  public loadRoute(){
    sessionStorage.setItem('vasPending','Yes')
 
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.parentURL}/dsb/subscription`]);
  });
 
  }
 


  openTermAndServiceDialog(num) {   
    if(num==1){
      this.termsAndconditions.privacyPolicy();

    }else{
      this.termsAndconditions.termsConditions();
    }
  }
  notaccess(){
    this.notaccessed = true;
 
  console.log(' im not access')
  $("#myModal17").show();
 
  }

  closed(){
    $("#myModal17").hide();
  }

  openpopup(){
    $("#myModal17").hide();
    $("#myModal20").show();
  }

  closepopup(){
    $("#myModal20").hide();
  }

  gotodashboard(){
    console.log(' im in dashboard page')
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate(['automated/baau/dashboard-details']); 
  });
  }

  
}
