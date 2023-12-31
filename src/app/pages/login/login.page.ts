import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router'; 
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { DataBaseService } from 'src/app/services/data-base.service';
import { AuthService } from 'src/app/services/auth.service.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  public usuarioRescatado : Usuario;
  public usuario: Usuario;
  listaUsuarios: Usuario[] = [];
  public passwordEscrita = '';
  public correoEscrito = '';

  constructor(private storage : StorageService, private router: Router, private toastController: ToastController, private bd: DataBaseService, private authService: AuthService) { 
    this.usuario = new Usuario()
    this.bd.listaUsuarios.subscribe(usuarios => {
      this.listaUsuarios=usuarios;
    })
    this.usuarioRescatado = new Usuario();
  
    // this.usuario.setUsuario('sin.datos@duocuc.cl', '1234');
    // this.usuario.setUsuario('atorres@duocuc.cl', '1234');
    // this.usuario.setUsuario('jperez@duocuc.cl', '5678');
    // this.usuario.setUsuario('cmujica@duocuc.cl', '0987');
    // this.usuario.setUsuario('usuario.inexistente@duocuc.cl', '1234');
    // this.usuario.setUsuario('atorres@duocuc.cl', 'password mala');
    // this.usuario.setUsuario('atorres@duocuc.cl', '9999999999999');
    // this.usuario.setUsuario('atorres@duocuc.cl', '9999');
    // this.usuario.setUsuario('correo.malo', '0987');
    // this.usuario.setUsuario('correo.malo@', '0987');
    // this.usuario.setUsuario('correo.malo@duocuc', '0987');
    // this.usuario.setUsuario('correo.malo@duocuc.', '0987');

  }

  ngOnInit() {
  }

  async ingresar() {
    const validar: boolean = await this.usuario.validarUsuario(this.bd, this.correoEscrito, this.passwordEscrita);

    if (validar) {
      const result = this.listaUsuarios.find((item) => item.correo === this.usuario.correo);

      console.log(result)

      if (result) {
        if (this.correoEscrito == result.correo && this.passwordEscrita == result.password) {
          
          this.usuarioRescatado.setUsuario(result?.correo, result?.password, result?.nombre, result?.apellido, result?.preguntaSecreta, result?.respuestaSecreta, result?.sesionActiva);
          
          await this.storage.guardarUsuarioAutenticadoConPrivacidad(this.usuario);
          
          this.authService.login(this.usuario.correo, this.usuario.password)
          this.mostrarMensaje(`Bienvenid@ ${this.usuario.nombre} ${this.usuario.apellido}!`)
          this.router.navigate(['/home/qr']);
        } else {

          this.mostrarMensaje(`Usuario o contraseña incorrectos.`)
        }
      } else {
        this.mostrarMensaje(`???`)
      }
    } else {
      this.mostrarMensaje(`Usuario o contraseña incorrectos?`)
    }
  }

  async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion? duracion: 2000
      });
    toast.present();
  }

  public correo() {
    this.router.navigate(['/correo']); 
  }

}