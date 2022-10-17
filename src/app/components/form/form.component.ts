import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Currency } from '../../interfaces/currency';
import { Subject, takeUntil } from 'rxjs';

interface FormComponentProps extends SimpleChanges {
  firstValue: GenericSimpleChange<number>
  secondValue: GenericSimpleChange<number>
}

interface GenericSimpleChange<T> extends SimpleChange {
  readonly previousValue: T
  readonly currentValue: T
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  currency: string[] | null;

  @Input()
  firstValue!: number | null;

  @Input()
  secondValue!: number | null;

  @Output() outFirstValue = new EventEmitter<number>();

  @Output() outSecondValue = new EventEmitter<number>();

  @Output() outFirstCurrency = new EventEmitter<Currency>();

  @Output() outSecondCurrency = new EventEmitter<Currency>();

  form: FormGroup;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.createForm();
    this.getFirstCurrency({
      firstCurrency: this.form.get('firstCurrency')!.value,
      secondCurrency: this.form.get('secondCurrency')!.value
    });
    this.form.get('firstValue')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.getFirstValue(val);
      });
    this.form.get('secondValue')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.getSecondValue(val);
      });
    this.form.get('firstCurrency')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((cur) => {
        this.getFirstCurrency({firstCurrency: cur, secondCurrency: this.form.get('secondCurrency')!.value});
      });
    this.form.get('secondCurrency')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((cur) => {
        this.getSecondCurrency({secondCurrency: cur, firstCurrency: this.form.get('firstCurrency')!.value});
      });
  }

  ngOnChanges(changes: FormComponentProps): void {
    if (!this.form) return
    if (changes.firstValue) {
      this.form.get('firstValue')?.patchValue(!changes.firstValue.currentValue
        ? null
        : changes.firstValue.currentValue, {
        emitEvent: false
      });
    }
    if (changes.secondValue) {
      this.form.get('secondValue')?.patchValue(!changes.secondValue.currentValue
        ? null
        : changes.secondValue.currentValue, {
        emitEvent: false
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): void {
    this.form = new FormGroup({
      firstValue: new FormControl(null),
      secondValue: new FormControl(null),
      firstCurrency: new FormControl('UAH'),
      secondCurrency: new FormControl('USD')
    });
  }

  getFirstValue(firstValue: number): void {
    this.outFirstValue.emit(firstValue);
  }

  getSecondValue(secondValue: number): void {
    this.outSecondValue.emit(secondValue);
  }

  getFirstCurrency(currency: Currency): void {
    this.outFirstCurrency.emit(currency);
  }

  getSecondCurrency(currency: Currency): void {
    this.outSecondCurrency.emit(currency);
  }

}
