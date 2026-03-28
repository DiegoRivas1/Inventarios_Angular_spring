import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { LocaleService } from './servicios/locale.service';//currency, date, number
import { registerLocaleData } from '@angular/common';

import localeEs from '@angular/common/locales/es';//EESPANIOL GENERICO
import  localeEsPe  from '@angular/common/locales/es-PE';//Peru
import localeEn from '@angular/common/locales/en';//Ingles GENERICO
//import localeEs419 from '@angular/common/locales/es-419'; //espaniol LATAM
registerLocaleData(localeEsPe, 'es-PE');//Peru - PEN
registerLocaleData(localeEs, 'es-ES');//Espania - EUR
registerLocaleData(localeEn, 'en-US');//Ingles USA - USD

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: LOCALE_ID,
      useFactory: (localeService: LocaleService) => localeService.getLocale(),
      deps: [LocaleService]
    }
  ]
};
