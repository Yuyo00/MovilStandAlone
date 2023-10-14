import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { InitializeAppService } from './app/services/initialize.app.service';
import { SQLiteService } from './app/services/sqlite.service';
import { DataBaseService } from './app/services/data-base.service';
import { StorageService } from './app/services/storage.service';
import { DbnameVersionService } from './app/services/dbname-version.service';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './app/services/auth.service.service';
import { Storage } from '@ionic/storage-angular';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';

if (environment.production) {
  enableProdMode();
}

const platform = Capacitor.getPlatform();
if(platform === "web") {
  jeepSqlite(window);
  window.addEventListener('DOMContentLoaded', async () => {
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
      jeepEl.autoSave = true;
  });
}

export function initializeFactory(init: InitializeAppService) {
  return () => init.inicializarAplicacion();
}
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({ innerHTMLTemplatesEnabled : true }), 
    // HttpClientModule, 
    // IonicStorageModule.forRoot()
    ),
    provideRouter(routes),
    // provideAnimations(),
    InitializeAppService,
    SQLiteService,
    DataBaseService,
    DbnameVersionService,
    StorageService,
    AuthService,
    Storage,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService],
      multi: true
    }

  ],
});
