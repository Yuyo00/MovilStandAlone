import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController, IonicModule, ToastController } from '@ionic/angular';
import { Asistencia } from 'src/app/model/asistencia';
import { Usuario } from 'src/app/model/usuario';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MisdatosComponent  implements OnInit, AfterViewInit{
  public asistencia: Asistencia = new Asistencia();
  public usuario: Usuario;
  @ViewChild('Bienvenida', { read: ElementRef }) itemBienvenida!: ElementRef;
  @ViewChild('Nombre', { read: ElementRef }) itemNombreTit!: ElementRef;

  constructor( private storage : StorageService, private activeroute: ActivatedRoute , private router: Router , private alertController: AlertController , private animationController: AnimationController, private toastController: ToastController) {
    this.usuario = new Usuario();
    
    this.activeroute.queryParams.subscribe(params => { 
      const nav = this.router.getCurrentNavigation();

      if (nav) {
        // Si tiene datos extra, se rescatan y se asignan a una propiedad
        if (nav.extras.state) {
          this.usuario = nav.extras.state['usuario'];
          this.asistencia = nav.extras.state['asistencia'];
          return;
        }
      }
      this.router.navigate(['/login']);
    });
  }
  ngAfterViewInit(): void {
    if (this.itemNombreTit) {
      const animation = this.animationController
        .create()
          .addElement(this.itemNombreTit.nativeElement)
          .iterations(7)
          .duration(400)
          .fromTo('transform', 'scale3d(1,1,1)', 'scale')
          .fromTo("opacity",0.2,1)
          ;
        animation.play();
      }
    if (this.itemBienvenida) {
      const animation = this.animationController
        .create()
          .addElement(this.itemBienvenida.nativeElement)
          .iterations(7)
          .duration(400)
          .fromTo('transform', 'scale3d(1,1,1)', 'scale')
          .fromTo('color','white','orange')
          .fromTo("opacity",0.2,1)
          ;
        animation.play();
      }
  }
  
  async DatosStorage() {
    const Datos = await this.storage.leerUsuarioAutenticadoSinPrivacidad()
    if (Datos) {
      this.usuario.setUsuario(Datos.correo, Datos.password, Datos.nombre, Datos.apellido, Datos.preguntaSecreta, Datos.respuestaSecreta, Datos.sesionActiva)
    } else {
      console.log('Error :(')
    }
  }

  ngOnInit() {
    this.DatosStorage();
  }

}
