import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TransactionBean } from 'src/app/beans/TransactionBean';
import { PlaceQuote, editViewQuotation } from 'src/app/beans/BankNewTransaction';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewTransactionService {


  constructor(public httpClient: HttpClient) { }
  creditCount = new Subject<any>();
  public getAllNewTransaction(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getAllTxnByUserIdAndStatus`,data, { headers: { 'content-types': 'application/json' } });
  }
  public getTxnForCustomerByUserIdAndStatus(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getTxnForCustomerByUserIdAndStatus`,data, { headers: { 'content-types': 'application/json' } });
  }
  

  public getTransactionDetailByUserId(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getTransactionDetailByUserId`, data, { headers: { 'content-types': 'application/json' } })
  }
  
  public validateQuote(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/validateTransaction`, data, { headers: { 'content-types': 'application/json' } })
  }

  public getTransQuotationDtlByBankUserIdAndStatus(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getTransQuotationDtlByBankUserIdAndStatus`, data, { headers: { 'content-types': 'application/json' } })
  }
  

  public getSecTransQuotationDtlByBankUserIdAndStatus(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getSecTransQuotationDtlByBankUserIdAndStatus`, data, { headers: { 'content-types': 'application/json' } })
  }
   public getQuotationOfAcceptedQuote(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getQuotationOfAcceptedQuote`, data, { headers: { 'content-types': 'application/json' } })
  }
  
  public getTransQuotationDtlByQuotationId(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getTransQuotationDtlByQuotationId`, data, { headers: { 'content-types': 'application/json' } })
  }
  
  // public saveQuotationToDraft(data: any): Observable<any[]> {
  //   return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/saveQuotationToDraft`, data, { headers: { 'content-types': 'application/json' } })
  // }
  public saveQuotationToDraft(data: any, ID): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/saveQuotationToDraft/`+ ID, data, { headers: { 'content-types': 'application/json' } })
  }
  public calculateQuote(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/calculateQuote`, data, { headers: { 'content-types': 'application/json' } })
  }
  
  public updateCustomerTransaction(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/updateMasterLC`, data, { headers: { 'content-types': 'application/json' } });
  }

  public cancelTransaction(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/cancelTransaction`, data, { headers: { 'content-types': 'application/json' } });
  }

   public withdrawQuote(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/withdrawQuote`, data, { headers: { 'content-types': 'application/json' } });
  }

  public updateBankTransaction(data: editViewQuotation): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/updateMasterQuotation`, data, { headers: { 'content-types': 'application/json' } });
  }
  
  public confirmQuotation(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/confirmQuotation`, data, { headers: { 'content-types': 'application/json' } });
  }
  
 
  
  public getSpecificTxnDetailByTxnId(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getSpecificTxnDetailByTxnId`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getAllNewBankRequest(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getAllNewRequestsForBank`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getNewRequestsForBankSecondary(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getNewRequestsForBankSecondary`,data , { headers: { 'content-types': 'application/json' } });
  }
  
  public getcheckQuotationPlaced(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/checkQuotationPlaced`,data , { headers: { 'content-types': 'application/json' } });
  }
  
  public getBankplaceQuotation(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/saveQuotationToDraft`,data , { headers: { 'content-types': 'application/json' } });
  }


  public saveComments(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/save/comment`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getBankgetQuotationCount(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getQuotationCount`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getAllQuotationDetails(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getAllQRByUserIdTxnId`,data , { headers: { 'content-types': 'application/json' } });
  }

   public getConfChargesForQuoteAmount(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getConfChargesForQuoteAmount`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getQuotationDetails(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getQuoteByUserIdTxnIdStatus`,data , { headers: { 'content-types': 'application/json' } });
  }

  public acceptBankQuote(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/acceptQuote`,data , { headers: { 'content-types': 'application/json' } });
  }

  

  public custRejectBankQuote(data, quoteId): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/rejectQuote/`+ quoteId, data , { headers: { 'content-types': 'application/json' } });
  }

  public custCloneTransaction(data): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/cloneLC`, data , { headers: { 'content-types': 'application/json' } });
  }

  public custReopenTransaction(data): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/reopenTransactionByTxnIdUserId`, data , { headers: { 'content-types': 'application/json' } });
  }

  public custCloseTransaction(data): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/closeTransaction`, data , { headers: { 'content-types': 'application/json' } });
  }

  public updateTransactionValidity(data): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/updateTransactionValidity`, data , { headers: { 'content-types': 'application/json' } });
  }
  public getDistributingBank(id): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/getDistributingBank/` + id , { headers: { 'content-types': 'application/json' } });
  }
// new api
  public getAcceptedQuoteId(data): Observable<any[]> {
return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/getAcceptedQuoteId`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getSecQuoteByUserIdTxnIdStatus(data): Observable<any[]> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/getSecQuoteByUserIdTxnIdStatus`, data , { headers: { 'content-types': 'application/json' } });
      }
      public custRejectsecBankQuote(data, quoteId): Observable<any[]> {
        return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/rejectSecQuote/`+ quoteId, data , { headers: { 'content-types': 'application/json' } });
      }
}
