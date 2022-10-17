import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { HeaderState } from '../../interfaces/header-state';
import { Observable, switchMap, tap } from 'rxjs';
import { Currency } from '../../interfaces/currency';
import { ExchangeRateService } from '../../services/exchange-rate.service';

@Injectable()
export class HeaderStore extends ComponentStore<HeaderState> {

  constructor(private exchangeRateService: ExchangeRateService) {
    super({
      usdExchangeRate: 0,
      eurExchangeRate: 0
    });
  }

  readonly usdExchangeRate$: Observable<number> = this.select(state => state.usdExchangeRate);
  readonly eurExchangeRate$: Observable<number> = this.select(state => state.eurExchangeRate);

  readonly setUsdExchangeRate = this.updater((state, usdExchangeRate: number) => ({
    ...state, usdExchangeRate
  }));
  readonly setEurExchangeRate = this.updater((state, eurExchangeRate: number) => ({
    ...state, eurExchangeRate
  }));

  readonly getUsdExchangeRate = this.effect<Currency>((currency$: Observable<Currency>) => {
    return currency$.pipe(
      switchMap((currency) =>
        this.exchangeRateService.getExchangeRate(currency)
          .pipe(
            tap({
              next: (value) => this.setUsdExchangeRate(Object.entries(value.result)[0][1])
            })
          )
      )
    )
  });
  readonly getEurExchangeRate = this.effect<Currency>((currency$: Observable<Currency>) => {
    return currency$.pipe(
      switchMap((currency) =>
        this.exchangeRateService.getExchangeRate(currency)
          .pipe(
            tap({
              next: (value) => this.setEurExchangeRate(Object.entries(value.result)[0][1])
            })
          )
      )
    )
  });

}
