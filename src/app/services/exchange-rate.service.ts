import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExchangeRate } from '../interfaces/exchange-rate';
import { Currencies } from '../interfaces/currencies';
import { Currency } from '../interfaces/currency';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(private httpClient: HttpClient) {
  }

  getCurrencies(): Observable<Currencies> {
    return this.httpClient.get<Currencies>('https://api.fastforex.io/currencies')
  }

  getExchangeRate({firstCurrency,secondCurrency}:Currency): Observable<ExchangeRate> {
    return this.httpClient.get<ExchangeRate>(`https://api.fastforex.io/fetch-one?from=${firstCurrency}&to=${secondCurrency}`)
  }

}
