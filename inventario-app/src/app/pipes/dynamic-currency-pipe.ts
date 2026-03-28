import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LocaleService } from '../servicios/locale.service';

@Pipe({
  name: 'dynamicCurrency',
  standalone: true,
  pure: false
})
export class DynamicCurrencyPipe implements PipeTransform {

  private localeService = inject(LocaleService);

  transform(value: number): string | null {

    const locale = this.localeService.locale();
    const currency = this.localeService.moneda();

    const pipe = new CurrencyPipe(locale);

    return pipe.transform(value, currency, 'symbol', '1.2-2', locale); // <!-- <td>{{ producto.precio | currency: 'PEN':'symbol':'1.2-2' }}</td> -->
  }
}