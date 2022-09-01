import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { KycuploadService } from 'src/app/services/kyc-upload/kycupload.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { signup } from 'src/app/beans/signup';
import * as $ from '../../../assets/js/jquery.min';
import  { ValidateRegex } from '../../beans/Validations';
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { Business } from 'src/app/beans/business';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  public title: string = "My Profile";
  personalDetails: any = "";
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  isReferrer: boolean = false;
  isBank: boolean = false;
  public bd: any = "";
  public kd: any = "";
  public isCustomer = false;
 public bcUserId:boolean = false;
  document: any;
  noData:boolean
  imgDownload: boolean;
  fileData: any;
  email: string;
  isDownloadORview: string;

  constructor(public titleService: TitleService, 
    public personalDetailsService: PersonalDetailsService,
    public fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public bds: BusinessDetailsService,
    public kycUpload:KycuploadService,
    ) { 

   // this.titleService.changeTitle(this.title);
   setTimeout(() => {
    this.titleService.loading.next(false);
    }, 2000);

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    this.callPersonalDetailService();
    this.callBusinessDetailService(sessionStorage.getItem('userID'))
    this.callKycDetailService(sessionStorage.getItem('userID'))

  }

  ngOnInit() {
    
    
  }

  personalDetailsForm = this.fb.group({

    firstName: ['', [Validators.required, Validators.maxLength(30)]],
    lastName: ['', [Validators.required, Validators.maxLength(30)]],
    emailId: ['', [Validators.required, Validators.email]],
    mobileNo: ['', Validators.required],
    landLineNo: [''],
    country: ['', Validators.required]
  });

  get perDetails() {
    return this.personalDetailsForm.controls;
  }

  callPersonalDetailService(){
    this.titleService.loading.next(true);
    if(sessionStorage.getItem('branchUserEmailId')==""){
      this.email="email";
        }else{
          this.email=sessionStorage.getItem('branchUserEmailId');
        }
    this.personalDetailsService.getPersonalDetails(sessionStorage.getItem('userID'),this.email,sessionStorage.getItem('token'))
    .subscribe(
      (response) => {
        let responseData = JSON.parse(JSON.stringify(response));

        this.personalDetails = responseData.data;
  
        var username = this.personalDetails.firstName + " " + this.personalDetails.lastName;
        this.titleService.changeUserName(username);
        this.personalDetailsForm.patchValue({
          firstName: this.personalDetails.firstName,
          lastName: this.personalDetails.lastName,
          emailId: this.personalDetails.emailAddress,
          mobileNo: this.personalDetails.mobileNum,
          landLineNo: this.personalDetails.landLinenumber,
          country: this.personalDetails.countryName
        });

        let subscriptionType = this.personalDetails.subscriberType;
          let bankType = this.personalDetails.bankType
          if (subscriptionType === 'REFERRER') {
            this.isReferrer = true;
            this.isBank = false;
          } else if (subscriptionType === 'BANK' && bankType === 'UNDERWRITER') {

            this.isBank = true;
            this.isReferrer = false;
          } else {
            this.isBank = false;
            this.isReferrer = false;
          }
  })}

  callBusinessDetailService(userID: string) {
    this.bds.viewBusinessDetails(userID,sessionStorage.getItem('token')).subscribe(
      (response) => {
        let responseData = JSON.parse(JSON.stringify(response));
        this.bd = responseData.data;
        if (this.bd.userId.startsWith('BA') || this.bd.userId.startsWith('RE')) {
          this.isCustomer = false;
          this.bcUserId = false;
        } else if 
        // (this.bd.userId.startsWith('CU') || this.bd.userId.startsWith('BC')) 
        (this.bd.userId.startsWith('CU')) 
        {
          this.isCustomer = true;
        }
        else if (this.bd.userId.startsWith('BC')){
          this.bcUserId = true;
          console.log('i m here')
        }
      }   
    )
  }
  callKycDetailService(userID: string){
    this.kycUpload.viewKycDetailsLatest(userID).subscribe(
      (response) => {        
        let responseData = JSON.parse(JSON.stringify(response));
        this.kd = responseData;

        if(!this.kd)
          this.noData = true;
        
        this.titleService.loading.next(false);
      }   
    )
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
    console.log(extension)
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
              convertbase64toArrayBuffer(base64) {
                var binary_string = window.atob(base64);
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                  bytes[i] = binary_string.charCodeAt(i);
                }
                return bytes.buffer;
              }

  openDocument(file){
    $('#modal_kycView').show();
   // this.document = file;
    var str = file; 
    var splittedStr = str.split(" |", 2); 
    var filename=str.split(" |", 1); 
    var filename=splittedStr[0].toLowerCase();
    var ext = filename.split("."); 
    //  if(ext[1]=='jpeg' || ext[1]=='jpg' || ext[1]=='png' || ext[1]=='svg'){
    //   this.imgDownload=true;
    //  }else{
    //   this.imgDownload=false;
    //  }

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
  close(){
    $('.modal3').hide();
  }

  public pdb(): signup {

    let data = {
      subscriberType: "",
      firstName: this.personalDetailsForm.get('firstName').value,
      lastName: this.personalDetailsForm.get('lastName').value,
      emailAddress: this.personalDetailsForm.get('emailId').value,
      mobileNum: this.personalDetailsForm.get('mobileNo').value,
      countryName: this.personalDetailsForm.get('country').value,
      landLinenumber: this.personalDetailsForm.get('landLineNo').value,
      otherType: this.personalDetailsForm.get('otherType').value,
      otherTypeBank:this.personalDetailsForm.get('otherTypeBank').value,
      companyName: "",
      designation: "",
      businessType: "",
      userId: sessionStorage.getItem('userID'),
      bankType: "",
      minLCValue: "",
      regCurrency:"",
      interestedCountry: [],
      beneInterestedCountry:[],
      blacklistedGoods:[],
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: ""
    }
    return data;
  }

  onSubmitPerDetails(): void {
    this.submitted = true;
    if(this.personalDetailsForm.invalid) {
      return;
    }
    this.submitted = false;
    $("#myModal5").hide();
    let userID: string = sessionStorage.getItem('userID');
    this.personalDetailsService.updatePersonalDetails(this.pdb(), sessionStorage.getItem('token'))
      .subscribe(
        (response) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congratulations! Your Personal Details has been successfully submitted!',
              message: '',
              parent: this.parentURL + '/my-profile'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/my-profile/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        },
        (error) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: ' Your Personal Details has been failed!',
              message: 'Invalid Data',
              parent: this.parentURL + 'my-profile'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/my-profile/error`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }
      )

  }

  validateRegexFields(event, type){
    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }
  }

  redirectOn(redirectVal){
    
    const navigationExtras: NavigationExtras = {
      state: {
        redirectedFrom: "MyProfile"
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/"+redirectVal], navigationExtras);
    }

}
