import { computed, Injectable, signal } from '@angular/core';
import { LocaleConfig } from '../modelos/locale';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  // signal para reactividad (por derfecto peru) otro : es-ES, en-US
  locale = signal<string>(localStorage.getItem('locale') ?? 'es-PE');

  // Tasas de cambio (ejemplo, en un caso real se obtendrían de una API)
  readonly tasasCambio: Record<string, number> = {
    'PEN': 1, // Sol peruano
    'EUR': 0.25, // Euro
    'USD': 0.27 // Dólar estadounidense
  };

  //Lista de locales disponibles
  readonly locales: LocaleConfig[] = [
    { codigo: 'es-PE', pais: 'Perú', moneda: 'PEN' },
    { codigo: 'es-ES', pais: 'España', moneda: 'EUR' },
    { codigo: 'en-US', pais: 'Estados Unidos', moneda: 'USD' }
  ];

  setLocale(loc: string) {
    this.locale.set(loc);
    localStorage.setItem('locale', loc);
  }

  getLocale() {
    return this.locale();
  }

  moneda = computed(() => {
    const loc = this.locales.find(l => l.codigo === this.locale());
    return loc?.moneda?? 'PEN';
  });


  convertirMoneda(valor: number) {
    const monedaDestino = this.moneda();
    const tasa = this.tasasCambio[monedaDestino] ?? 1;
    return valor * tasa;
  }

}