import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { log, showAlertError, showToast } from '../model/message';
import { Usuario } from '../model/usuario';
import { Storage } from '@ionic/storage-angular';
import { DataBaseService } from './data-base.service';

@Injectable()

export class AuthService {

  keyUsuario = 'USUARIO_AUTENTICADO';
  usuarioAutenticado = new BehaviorSubject<Usuario | null>(null);

  constructor(private router: Router, private bd: DataBaseService, private storage: Storage) { }

  inicializarAutenticacion() {
    this.storage.create();
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.leerUsuarioAutenticado().then(usuario => {
      return usuario !== null;
    });
  }

  async login(correo: string, password: string) {
    await this.storage.get(this.keyUsuario).then(async (usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.bd.actualizarSesionActiva(correo, 'S');
        this.storage.set(this.keyUsuario, usuarioAutenticado);
        this.usuarioAutenticado.next(usuarioAutenticado);
        this.router.navigate(['home/qr']);
      } else {
        await this.bd.validarUsuario(correo, password).then(async (usuario: Usuario | undefined) => {
          if (usuario) {
            showToast(`¡Bienvenido(a) ${usuario.nombre} ${usuario.apellido}!`);
            this.bd.actualizarSesionActiva(correo, 'S');
            this.storage.set(this.keyUsuario, usuario);
            this.usuarioAutenticado.next(usuario);
            this.router.navigate(['home/qr']);
          } else {
            showToast(`El correo o la password son incorrectos`);
            this.router.navigate(['ingreso']);
          }
        });
      }
    });
  }

  async logout() {
    this.leerUsuarioAutenticado().then((usuario) => {
      if (usuario) {
        showToast(`¡Hasta pronto ${usuario.nombre} ${usuario.apellido}!`);
        this.bd.actualizarSesionActiva(usuario.correo, 'N');
        this.storage.remove(this.keyUsuario);
        this.usuarioAutenticado.next(null);
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['login']);
      }
    })

  }

  async leerUsuarioAutenticado(): Promise<Usuario | undefined> {
    return this.storage.get(this.keyUsuario).then(usuario => usuario as Usuario);
  }

}
