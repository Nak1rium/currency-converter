import { Currency } from './currency';

export interface CurrencyConvertorState {
  allCurrency: string[];
  firstValue: number ;
  secondValue: number;
  currency: Currency;
  exchangeRate: number;
}
