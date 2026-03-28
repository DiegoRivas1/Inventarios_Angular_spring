import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  // signal para reactividad (por derfecto peru) otro : es-ES, en-US
  locale = signal<string>('es-PE');

  setLocale(nuevoLocale: string) {
    this.locale.set(nuevoLocale);
  }

  getLocale() {
    return this.locale();
  }

}