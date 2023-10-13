import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CorreoPage implements OnInit {

  constructor(private router: Router, private toastController: ToastController) { 
    this.usuario = new Usuario('', '', '', '', '', '')
  }public usuario: Usuario;

  public ngOnInit(): void {
  }
  public correo: string = '';

  public IrPregunta() : void {
    const usu = new Usuario('', '', '', '', '', '');
    const usuarioValidado= usu.buscarCorreoValido(this.correo);

    if (!usuarioValidado) {
      this.router.navigate(['/incorrecto']);
    } else {
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: usuarioValidado
        }
      };
      this.router.navigate(['/pregunta'], navigationExtras);
    }
    
  }

  async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion? duracion: 2000
      });
    toast.present();
  }

  public login() {
    this.router.navigate(['/login'])
  }

}