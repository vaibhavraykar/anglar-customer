import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OfflinedashboardComponent } from 'src/app/nimai/offlinedashboard/offlinedashboard.component';
import { OfflineActiveTranscationComponent } from 'src/app/nimai/offline-active-transcation/offline-active-transcation.component';
import { ErrorPopupComponent } from 'src/app/default/popups/error-popup/error-popup.component';
import { SuccessPopupComponent } from 'src/app/default/popups/success-popup/success-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7';
import { SharedModule } from '../shared/shared.module';
import { OfflineNewTranscationComponent } from 'src/app/nimai/offline-new-transcation/offline-new-transcation.component';

import { OfflineTranscatianDetailsComponent } from 'src/app/nimai/offlinebank/offline-transcatian-details/offline-transcatian-details.component';
import { NewTransactionQouteComponent } from 'src/app/nimai/offlinebank/secondary-market/new-transaction-qoute/new-transaction-qoute.component';
import { OfllineConfirmationQuotesComponent } from 'src/app/nimai/offlinebank/secondary-market/oflline-confirmation-quotes/oflline-confirmation-quotes.component';
import { OfflineSecActiveTranscationComponent } from 'src/app/nimai/offlinebank/secondary-market/offline-sec-active-transcation/offline-sec-active-transcation.component';
import { OfflineSecTranscationDetailsComponent } from 'src/app/nimai/offlinebank/secondary-market/offline-sec-transcation-details/offline-sec-transcation-details.component';
import { OfflineSecSavedTranscationComponent } from 'src/app/nimai/offlinebank/secondary-market/offline-sec-saved-transcation/offline-sec-saved-transcation.component';
import { OfflineSecDashboardDetailsComponent } from 'src/app/nimai/offlinebank/offline-sec-dashboard-details/offline-sec-dashboard-details.component';
import { OfflinePrimarySaveDetailsComponent } from 'src/app/nimai/offlinebank/offline-primary-save-details/offline-primary-save-details.component';
import { SupportComponent } from 'src/app/default/support/support/support.component';



const routes: Routes =[
  {
    path:"baau",
    component: OfflinedashboardComponent,
    children: [
      { path: "", redirectTo: "/baau/newrequest", pathMatch: "full" },
      {
        path: "newrequest", component: OfflineNewTranscationComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "activerequest", component: OfflineActiveTranscationComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "transaction-details", component: OfflineTranscatianDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "new-transaction-qoute", component: NewTransactionQouteComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "active-transaction-qoute", component: OfflineSecActiveTranscationComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "transaction-detail-qoute", component: OfflineSecTranscationDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "saved-transaction-qoute", component: OfflineSecSavedTranscationComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "dashboard-details", component: OfflineSecDashboardDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "draft-transaction", component: OfflinePrimarySaveDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "support", component: SupportComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
    ]
  }
]



@NgModule({
  declarations: [
   
    OfflineNewTranscationComponent,
    OfflineActiveTranscationComponent,
    OfflineTranscatianDetailsComponent,
    NewTransactionQouteComponent,
    OfllineConfirmationQuotesComponent,
    OfflineSecActiveTranscationComponent,
    OfflineSecTranscationDetailsComponent,
    OfflineSecSavedTranscationComponent,
    OfflineSecDashboardDetailsComponent,
    OfflinePrimarySaveDetailsComponent

  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    SharedModule,
  ],
  exports:[
   
    OfflineNewTranscationComponent,
    OfflineActiveTranscationComponent,
    OfflineTranscatianDetailsComponent,
    NewTransactionQouteComponent,
    OfllineConfirmationQuotesComponent,
    OfflineSecActiveTranscationComponent,
    OfflineSecTranscationDetailsComponent,
    OfflineSecSavedTranscationComponent,
    OfflineSecDashboardDetailsComponent,
    OfflinePrimarySaveDetailsComponent
    
  ]
})
export class OfflinebankModule { }
