import { Injectable } from '@angular/core';
import { log, showAlertError } from '../model/message';
import { Usuario } from '../model/usuario';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { 
    this.storage.create();
  }

  async get(key: string) {
    this.storage.get(key);
}

private async leerUsuarioAutenticado(hideSecrets: boolean): Promise<Usuario | null> {
    log('StorageService.leerUsuarioAlmacenado', 'Revisando USER_DATA');
    return this.storage.get("USER_DATA").then((datos) => {
        if (datos !== null) {
            log('StorageService.leerUsuarioAlmacenado', `USER_DATA tiene datos: ${datos}`);
            const json = JSON.parse(datos);
            const usu = new Usuario();
            if (json.correo.trim() !== '') {
                log('StorageService.leerUsuarioAlmacenado', `Los datos de USER_DATA son: ${json}`);
                usu.setUsuario(
                    json.correo, 
                    json.password, 
                    json.nombre, 
                    json.apellido, 
                    json.preguntaSecreta, 
                    json.respuestaSecreta, 
                    json.sesionActiva,
                    hideSecrets
                );
                return Promise.resolve(usu);
            } else {
                log('StorageService.leerUsuarioAlmacenado', `USER_DATA tenía datos vacíos`);
            }
        }
        log('StorageService.leerUsuarioAlmacenado', `USER_DATA no tiene datos`);
        return Promise.resolve(null);
    }).catch(err => {
        showAlertError('StorageService.leerUsuarioAlmacenado', err);
        return Promise.resolve(null);
    })
}

async leerUsuarioAutenticadoConPrivacidad(): Promise<Usuario | null> {
    return this.leerUsuarioAutenticado(true);
}

async leerUsuarioAutenticadoSinPrivacidad(): Promise<Usuario | null> {
    return this.leerUsuarioAutenticado(false);
}

async guardarUsuarioAutenticadoConPrivacidad(user: Usuario): Promise<void> {
    return await this.storage.set('USER_DATA', JSON.stringify(user));
}

async eliminarUsuarioAutenticado(): Promise<void> {
    return await this.storage.remove('USER_DATA');
}

async verificarExisteUsuarioAutenticado(): Promise<boolean> {
    return this.leerUsuarioAutenticado(false).then(usuario => { return usuario != null; });
}
}
