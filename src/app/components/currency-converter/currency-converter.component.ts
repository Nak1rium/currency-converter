import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Currency } from '../../interfaces/currency';
import { CurrencyConvertorStore } from './currency-convertor.store';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  providers: [CurrencyConvertorStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyConverterComponent implements OnInit {

  allCurrency$ = this.currencyConvertorStore.allCurrency$;
  firstValue$ = this.currencyConvertorStore.firstValue$;
  secondValue$ = this.currencyConvertorStore.secondValue$;

  constructor(private readonly currencyConvertorStore: CurrencyConvertorStore) {
  }

  ngOnInit(): void {
    this.currencyConvertorStore.getCurrency();
  }

  getFirstValue(firstValue: number) {
    this.currencyConvertorStore.getFirstValue(firstValue);
  }

  getSecondValue(secondValue: number) {
    this.currencyConvertorStore.getSecondValue(secondValue);
  }

  getFirstCurrency(currency: Currency) {
    this.currencyConvertorStore.getExchangeRate(currency);
  }

  getSecondCurrency(currency: Currency) {
    this.currencyConvertorStore.getExchangeRate(currency);
  }

  static converter(amount: number, multiplier: number, isDivide: boolean = false): number {
    if (!amount) return 0
    return Number((isDivide ? amount / multiplier : amount * multiplier).toFixed(2));
  }

}
