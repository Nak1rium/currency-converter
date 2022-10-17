import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeaderStore } from './header.store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HeaderStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  UAH: string = 'UAH';
  USD: string = 'USD';
  EUR: string = 'EUR';

  usdExchangeRate$ = this.headerStore.usdExchangeRate$;
  eurExchangeRate$ = this.headerStore.eurExchangeRate$;

  constructor(private readonly headerStore: HeaderStore) {
  }

  ngOnInit(): void {
    this.headerStore.getUsdExchangeRate({firstCurrency: this.EUR, secondCurrency: this.UAH});
    this.headerStore.getEurExchangeRate({firstCurrency: this.USD, secondCurrency: this.UAH});
  }

}
