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
  // public ingresar(): void {
    
  //   if (this.usuario) {
      
  //     const mensajeError = this.usuario.validarUsuario();
  //     if (mensajeError) {
  //       this.mostrarMensaje(mensajeError);
  //       return;
  //     }
  //     const usu: Usuario | undefined = this.usuario.buscarUsuarioValido(this.usuario.correo, this.usuario.password);
      
  //     if (usu) {
  
  //       const navigationExtras: NavigationExtras = {
  //         state: {
  //           usuario: usu
  //         }
  //       };
  //       this.mostrarMensaje(`Bienvenid@ ${usu.nombre} ${usu.apellido}!`);
  //       this.router.navigate(['/home/qr'], navigationExtras); 
  //     }
  //   }
  // }

  async ingresar() {
    const validar: boolean = await this.usuario.validarUsuario(this.bd, this.usuario.correo, this.usuario.password);

    if (validar) {
      const result = this.listaUsuarios.find((item) => item.correo === this.usuario.correo);
      if (result) {
        this.usuarioRescatado.setUsuario(result?.correo, result?.password, result?.nombre, result?.apellido, result?.preguntaSecreta, result?.respuestaSecreta, result?.sesionActiva, false);
        await this.storage.guardarUsuarioAutenticadoConPrivacidad(this.usuarioRescatado);
  
        this.mostrarMensaje(`Bienvenid@ ${this.usuario.nombre} ${this.usuario.apellido}!`)
        this.router.navigate(['/home/qr']);
        this.authService.login(this.usuario.correo, this.usuario.password)
      } else {
        this.mostrarMensaje(`???`)
      }
    } else {
      this.mostrarMensaje(`Usuario o contraseña incorrectos.`)
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