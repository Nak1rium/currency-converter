import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { CurrencyConvertorState } from '../../interfaces/currency-convertor-state';
import { Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { CurrencyConverterComponent } from './currency-converter.component';
import { Currency } from '../../interfaces/currency';

@Injectable()
export class CurrencyConvertorStore extends ComponentStore<CurrencyConvertorState> {

  constructor(private exchangeRateService: ExchangeRateService) {
    super({
      allCurrency: [],
      firstValue: 0,
      secondValue: 0,
      currency: {firstCurrency: '', secondCurrency: ''},
      exchangeRate: 0
    });
  }

  readonly allCurrency$: Observable<string[]> = this.select(state => state.allCurrency);
  readonly exchangeRate$: Observable<number> = this.select(state => state.exchangeRate);
  readonly firstValue$: Observable<number> = this.select(state => state.firstValue);
  readonly secondValue$: Observable<number> = this.select(state => state.secondValue);

  readonly setCurrency = this.updater((state, allCurrency: string[]) => ({
    ...state, allCurrency
  }));
  readonly setExchangeRate = this.updater((state, exchangeRate: number) => ({
    ...state, exchangeRate
  }));
  readonly setFirstValue = this.updater((state, firstValue: number) => ({
    ...state, firstValue
  }));
  readonly setSecondValue = this.updater((state, secondValue: number) => ({
    ...state, secondValue
  }));

  readonly getCurrency = this.effect<void>((source) => {
    return source.pipe(
      switchMap(() => this.exchangeRateService.getCurrencies()
        .pipe(
          tap({
            next: (value) => this.setCurrency(Object.keys(value.currencies))
          })
        ))
    )
  });

  readonly getExchangeRate = this.effect<Currency>((currency$: Observable<Currency>) => {
    return currency$.pipe(
      switchMap((currency) =>
        this.exchangeRateService.getExchangeRate(currency)
          .pipe(
            withLatestFrom(this.firstValue$),
            tap({
              next: ([value, inputValue]) => {
                const exchangeRate = Object.entries(value.result)[0][1]
                this.setExchangeRate(exchangeRate)
                this.setSecondValue(CurrencyConverterComponent.converter(inputValue, exchangeRate))
              }
            })
          ))
    )
  });

  readonly getFirstValue = this.effect<number>((firstValue$: Observable<number>) =>
    firstValue$.pipe(
      withLatestFrom(this.exchangeRate$),
      tap(
        ([firstValue, exchangeRate]) => {
          this.setFirstValue(firstValue)
          this.setSecondValue(CurrencyConverterComponent.converter(firstValue, exchangeRate))
        }
      ))
  );

  readonly getSecondValue = this.effect<number>((secondValue$: Observable<number>) =>
    secondValue$.pipe(
      withLatestFrom(this.exchangeRate$),
      tap(
        ([secondValue, exchangeRate]) => {
          this.setSecondValue(secondValue)
          this.setFirstValue(CurrencyConverterComponent.converter(secondValue, exchangeRate, true))
        }
      ))
  );

}


