import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { call } from '../../../assets/js/bootstrap-filestyle.min'
import { TitleService } from 'src/app/services/titleservice/title.service';
import { KycuploadService } from 'src/app/services/kyc-upload/kycupload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { loadFilestyle ,loads,uploadFileRefinance4,uploadFileRefinance1} from '../../../assets/js/commons'
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import * as $ from '../../../assets/js/jquery.min';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-kyc-details',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.css']
})
export class KycDetailsComponent implements OnInit {
  public kycDetailsForm: FormGroup;
  public submitted:boolean = false;
  selectedFiles: File[] = [];

  public title: string = "KYC Details";
  public subURL: string = "";
  public parentURL: string = "";
  parentRedirection: string = "account-review";
  isBank: boolean = false;
  isCustomer: boolean = false;
  resp: any;
  itemData:any = [];
  imageSrcBusi: any;
  imageSrcPer: any;
  private filename: string = '';
  kycStatusData: any;
  disabledBusiness: boolean=false;
  disabledpersonal: boolean=false;
  rejectReason: string;
  rejectedTitle: any;
  detail: any;
  isRejectedBusiness:any;
  isRejectedPersonal:any;
  sendData:any;
  count: number;
  isUpload: boolean=false;
  isUpload1: boolean=false;
  invalidFileMsg4: string="";
  uploadFile: string;
  invalidFileMsg1: string="";
  invalidFileMsg: string;
  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder, public titleService: TitleService, public router: Router, public kycService: KycuploadService) {
    call();
    loadFilestyle();

    setTimeout(() => {
      this.titleService.loading.next(false);
      }, 2000);

    let navigation = this.router.getCurrentNavigation();

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "MyProfile"){
        this.parentRedirection = "my-profile";
      }
    }

    let userID = sessionStorage.getItem("userID");
    
    if((userID.startsWith('BA')) || (userID.startsWith('BC')) || (userID.startsWith('RE'))){
      this.isBank = true;
    }
    else if(userID.startsWith('CU')){
      this.isCustomer = true;
    }

    this.resp = JSON.parse(sessionStorage.getItem('countryData'));    
     this.kycDetailsForm = this.fb.group({
      businessDocumentList: this.fb.array([]),
      personalDocumentList: this.fb.array([]),
      businessDocumentList_html: this.fb.array([this.getBusiList()]),
      personalDocumentList_html: this.fb.array([this.getPersList()]),
      busiCountry: ['', Validators.required],
      busiDocument: ['', Validators.required],   
      perCountry: ['', Validators.required],  
      perDocument : ['', Validators.required]
    })
  }
  ngOnInit() {
    loads();
    this.titleService.changeTitle(this.title);
    let kycStatus = sessionStorage.getItem("kycStatus");
    let kStatus=sessionStorage.getItem("kStatus")
    if(kycStatus=="Approved" || kStatus=="KycStauts:Approved"){
      this.router.navigate([`/${this.subURL}/${this.parentURL}/dashboard-details`])
    } 
    if(kycStatus=="Pending" || kStatus=="KycStauts:Pending"){   
      this.router.navigate([`/${this.subURL}/${this.parentURL}/account-review`]) 
    }
   if(kycStatus=="Rejected" || kStatus=="KycStauts:Rejected"){ 
      this.checkStatus();
    }else{
      this.disabledBusiness=true;
      this.disabledpersonal=true;
    }
  }
checkStatus(){ 
  var userId = sessionStorage.getItem("userID")  
  this.kycService.viewKycDetails(userId)
  .subscribe(
    response => {
      this.kycStatusData= JSON.parse(JSON.stringify(response));
      
      for (let i = 0; i < this.kycStatusData.length; i++) {
        if(this.kycStatusData[i].title=="Business"){
          if(this.kycStatusData[i].kycStatus.includes("Rejected") !== -1){
            this.sendData="RejectedBusiness"
            this.isRejectedBusiness="RejectedBusiness"
            this.disabledBusiness=true;
            this.rejectReason=this.kycStatusData[i].comment;
            this.rejectedTitle=this.kycStatusData[i].title;
            $('#rejectedPopup').show();
          }
          this.kycDetailsForm.patchValue({      
            busiCountry: this.kycStatusData[i].country,
            busiDocument:this.kycStatusData[i].documentName,  
            busiEncodedFileContent:this.kycStatusData[i].encodedFileContent,
          })
          this.imageSrcBusi=this.kycStatusData[i].encodedFileContent;
         } 
         if (this.kycStatusData[i].title=="Personal"){
          if(this.kycStatusData[i].kycStatus.includes("Rejected") !== -1){
            this.sendData="RejectedPersonal"
            this.isRejectedPersonal="RejectedPersonal"
            this.disabledpersonal=true;
            this.rejectReason=this.kycStatusData[i].comment;
            this.rejectedTitle=this.kycStatusData[i].title;

            $('#rejectedPopup').show();
          }
          this.kycDetailsForm.patchValue({                 
            perCountry: this.kycStatusData[i].country,  
            perDocument :this.kycStatusData[i].documentName,
            encodedFileContent:this.kycStatusData[i].encodedFileContent,
          })
          this.imageSrcPer=this.kycStatusData[i].encodedFileContent;
         }
      }  
      console.log("this.isRejectedPersonal---",this.isRejectedPersonal)
      console.log("this.isRejectedBusiness---",this.isRejectedBusiness)
    },
    error => {
      this.detail = JSON.parse(JSON.stringify(error)).message;
      this.disabledBusiness=true;
      this.disabledpersonal=true;

    })


}
closePopup(){
  $('#rejectedPopup').hide();
}

closeAR(){
  $('#accountReview').hide();
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/account-review`]);
});
}
  getBusiList(){
    return this.fb.group({
    documentName: [''],
    title: ['Business'],
    country: [''],
    busiEncodedFileContent: ['', Validators.required],
    documentType: ['jpg']
  });
}

  getPersList(){
    return this.fb.group({
    documentName: [''],
    title: ['Personal'],
    country: [''],
    encodedFileContent: ['',Validators.required],
    documentType: ['jpg']
  });
}

add(i: number, type) {
  if(type){
    let items = this.kycDetailsForm.get('businessDocumentList_html') as FormArray;
    if (items.length < 3)
    {
      items.push(this.getBusiList());
    }
  }
  else{
    let items = this.kycDetailsForm.get('personalDocumentList_html') as FormArray;
    if (items.length < 3)
    {
      items.push(this.getPersList());
    }
  }

}

remove(i: number, type) {
  if(type){
    let items = this.kycDetailsForm.get('businessDocumentList_html') as FormArray;
    items.removeAt(i);
  }
  else{
    let items = this.kycDetailsForm.get('personalDocumentList_html') as FormArray;
    items.removeAt(i);
  }
}

get kycDetails() {
  return this.kycDetailsForm.controls;
}
setValidators(){
  if(this.isRejectedPersonal && this.isRejectedBusiness){
    this.sendData="both"
    return
  }
  if(this.sendData=="RejectedBusiness"){
    this.kycDetailsForm.get("perDocument").disable();
    this.kycDetailsForm.get("perCountry").disable();
    this.kycDetailsForm.get("personalDocumentList").disable();
    this.kycDetailsForm.get("personalDocumentList_html").disable();
  }else if(this.sendData=="RejectedPersonal"){
    this.kycDetailsForm.get("busiDocument").disable();
    this.kycDetailsForm.get("busiCountry").disable();
    this.kycDetailsForm.get("businessDocumentList").disable();
    this.kycDetailsForm.get("businessDocumentList_html").disable();
  }
}
  submit(): void {
    
    this.setValidators();  
    this.submitted = true;  
     if(this.kycDetailsForm.invalid || this.invalidFileMsg1 || this.invalidFileMsg4 || this.invalidFileMsg) {
     
      return;
    }
  
    const businessDocumentList = <FormArray>this.kycDetailsForm.get('businessDocumentList');
    businessDocumentList.controls = [];
    if(this.sendData=="RejectedBusiness" || this.sendData==null || this.sendData=="" || this.sendData=="both"){
    businessDocumentList.push(this.fb.group({
      documentName: $('#busiDocument').val(),
      title: ['Business'],
      country: this.kycDetailsForm.get('busiCountry').value,
      encodedFileContent: [this.imageSrcBusi],
      documentType: ['jpg']      
    }));
    }
  
    const personalDocumentList  = <FormArray>this.kycDetailsForm.get('personalDocumentList');
    personalDocumentList.controls = [];
  
    if(this.sendData=="RejectedPersonal" || this.sendData==null || this.sendData=="" || this.sendData=="both"){     
    personalDocumentList.push(this.fb.group({
      documentName: $('#perDocument').val(),
      title: ['Personal'],
      country: this.kycDetailsForm.get('perCountry').value,
      encodedFileContent: [this.imageSrcPer],
      documentType: ['jpg']      
    }));
    }      
    var data = {
      "userId" : sessionStorage.getItem("userID"),
      "businessDocumentList": this.kycDetailsForm.get('businessDocumentList').value,
      "personalDocumentList": this.kycDetailsForm.get('personalDocumentList').value,
    }

    console.log(data)
    this.kycService.upload(data)
      .subscribe(
        resp => {    
        $('#accountReview').show();
   
        }
        
         
        ,
        err => {
          this.failedError();
        });
       
  }

  failedError(){
    const navigationExtras: NavigationExtras = {
      state: {
        title: 'Oops! Something went wrong while uploading KYC documents',
        message: '',
        parent: this.subURL + '/' + this.parentURL + '/kyc-details'

      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details/error`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
  }

  selectFile(e, data) {
    // $("#moreImageUploadLinkType").show();
    if(e.target.files.length==1)
    { 
    this.isUpload1=true;
     this.count=0;
    this.itemData = data;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var sizeInMb = file.size/1024;
    var sizeLimit= 1024*20;
    if (sizeInMb > sizeLimit) {
    //alert('File size should be less than 20MB')
    this.uploadFile='first'
    this.invalidFileMsg="File size should be less than 20MB";
    $('#upload_file1').val("");
    this.isUpload1=false;
    this.invalidFileMsg1="";
        $('#invalidFile').show();
       
    return
    }
    this.filename=file.name;
    
    if(this.filename.toLowerCase().indexOf(".jpg") !== -1 || this.filename.toLowerCase().indexOf(".jpeg") !== -1 || this.filename.toLowerCase().indexOf(".png") !== -1 ||
    this.filename.toLowerCase().indexOf(".pdf") !== -1 || this.filename.toLowerCase().indexOf(".tiff") !== -1 ){
     var reader = new FileReader();
       reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);  
      this.invalidFileMsg1=""   
  
    }else{
      //alert("Invalid File , Kindly select .pdf , .png , .jpeg or tiff File")
      this.uploadFile='first';
      this.invalidFileMsg="Kindly select pdf, png, jpeg or tiff File";      
    //  $('#upload_file1').val("");  
    this.invalidFileMsg1="";            
      $('#invalidFile').show();         

      return
    } 
    this.invalidFileMsg="";
  } 
    else{

      this.invalidFileMsg="You are not allowed to upload more one file";
      $('#upload_file1').val("");
      this.isUpload=false;
      this.invalidFileMsg1="";
       $('#invalidFile').show();  
      return


  }
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrcBusi =this.filename +" |" + reader.result;
    this.kycDetailsForm.get('busiEncodedFileContent').setValue(this.imageSrcBusi);
   
  }
  invalidDateOk(){
  
    if(this.uploadFile=='first'){
      this.deleteFileContent1();
    }
       if(this.uploadFile=='second'){
    this.deleteFileContent4();
  }
  this.invalidFileMsg1="";
  this.invalidFileMsg4="";
    $('#invalidFile').hide();

  }
  selectFile_KYC(e) {
    // $("#moreImageUploadLink").show();
    if(e.target.files.length==1)
    {     
    this.isUpload = true;  
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var sizeInMb = file.size/1024;
    var sizeLimit= 1024*20;
  
    if (sizeInMb > sizeLimit) {
   this.uploadFile='second'
    this.invalidFileMsg="File size should be less than 20MB";
    $('#upload_file4').val("");
    this.isUpload=false;
    this.invalidFileMsg4="";
     $('#invalidFile').show();    

    return
    }
   
    this.filename=file.name;
    if(this.filename.toLowerCase().indexOf(".jpg") !== -1 || this.filename.toLowerCase().indexOf(".jpeg") !== -1 || this.filename.toLowerCase().indexOf(".png") !== -1 ||
    this.filename.toLowerCase().indexOf(".pdf") !== -1 || this.filename.toLowerCase().indexOf(".tiff") !== -1  ){
    var reader = new FileReader(); 
         reader.onload = this._handleReaderLoaded_KYC.bind(this);
      reader.readAsDataURL(file);  
      this.invalidFileMsg4=""     
      
    }else{
      
    this.uploadFile='second';
    this.invalidFileMsg4="";
    $('#invalidFile').show();
    this.invalidFileMsg="Kindly select pdf, png, jpeg or tiff File";   
    
    // $('#upload_file4').val("");
    return;
    }
    this.invalidFileMsg=""
    } 
    else{

      this.invalidFileMsg="You are not allowed to upload more one file";
      $('#upload_file4').val("");
      this.isUpload=false;
      this.invalidFileMsg4="";
       $('#invalidFile').show();  
      return

  }
  }
  _handleReaderLoaded_KYC(e) {
    let reader = e.target;
      this.imageSrcPer =this.filename +" |" + reader.result;
    this.kycDetailsForm.get('encodedFileContent').setValue(this.imageSrcPer);
   
  }

  deleteFileContent1(){    
    $('#upload_file1').val('');
 //   this.kycDetailsForm.get('busiEncodedFileContent').setValue("");
    this.invalidFileMsg1="Upload Doc"
    this.isUpload1 = false;   
   uploadFileRefinance1();
  }
  deleteFileContent4(){    
    $('#upload_file4').val('');
    this.invalidFileMsg4="Upload Doc"
   // this.kycDetailsForm.get('encodedFileContent').reset;
    this.isUpload = false;   
    uploadFileRefinance4();
  }
}