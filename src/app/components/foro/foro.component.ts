import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIClientService } from './../../services/apiclient.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';

@Component({  
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ForoComponent  implements OnInit {
  selectedUserId!: number;
  public usuario: Usuario;
  ngOnInit() {
  };

  usuarios: any;


  publicacion: any = {
    userId: null,
    id: null,
    title: '',
    body: '',
    name: ''
  };


  publicaciones: any;
  publicacionSeleccionada: string | undefined;


  constructor(
    private api: APIClientService,
    private toastController: ToastController,private activeroute: ActivatedRoute, private router: Router,) {
      this.usuario = new Usuario();
      this.activeroute.queryParams.subscribe(params => { 
        const nav = this.router.getCurrentNavigation();
  
        if (nav) {
          if (nav.extras.state) {
            this.usuario = nav.extras.state['usuario'];
            return;
          }
        }
        this.router.navigate(['/login']);
    });
  }

  ionViewWillEnter() {
    this.selectedUserId = 0;
    this.setPublicacion(null, null, '', '', '');
    this.getUsuarios();
    this.getPublicaciones();
  }


  cambiarUsuario($event: number) {
    this.setPublicacion($event, null, '', '', '');
  }


  limpiarPublicacion() {
    this.setPublicacion(this.selectedUserId, null, '', '', '');
  }


  setPublicacion(userId: number | null, pubId: null, title: string, body: string, name: string) {

    this.publicacion.userId = userId;
    this.publicacion.id = pubId;
    this.publicacion.title = title;
    this.publicacion.body = body;
    this.publicacion.name = name;

    const uid = userId === null? 'no seleccionado' : userId;
    const pid = pubId === null? 'nueva' : pubId;
    this.publicacionSeleccionada = `(userId: ${uid} - pubId: ${pid})`;
  }


  getUsuarios() {
    this.api.getUsuarios().subscribe(data => this.usuarios = data);
  }


  getPublicaciones() {

    this.api.getPublicaciones().subscribe((publicaciones) => {

      this.api.getUsuarios().subscribe((usuarios) => {

        publicaciones.forEach((publicacion: { name: any; userId: any; }) => {
          publicacion.name = usuarios.find((u: { id: any; }) => u.id === publicacion.userId).name;
        });

        publicaciones.reverse();

        this.publicaciones = publicaciones;
      });
    });
  }


  guardarPublicacion() {
    if (this.publicacion.userId === null) {
      this.mostrarMensaje('Antes de hacer una publicación debe seleccionar un usuario.');
      return;
    }
    if (this.publicacion.title.trim() === '') {
      this.mostrarMensaje('Antes de hacer una publicación debe llenar el título.');
      return;
    }
    if (this.publicacion.body.trim() === '') {
      this.mostrarMensaje('Antes de hacer una publicación debe llenar el cuerpo.');
      return;
    }
    if (this.publicacion.id === null) {
      this.crearPublicacion();
    }
    else {
      this.actualizarPublicacion();
    }
  }

  crearPublicacion() {
    this.api.createPublicacion(this.publicacion).subscribe(
      (data) => {
        this.mostrarMensaje(`PUBLICACION CREADA CORRECTAMENTE: ${data.id} ${data.title}...`);
        this.limpiarPublicacion();
        this.getPublicaciones();
      },
      (error) => this.mostrarError('NO FUE POSIBLE CREAR LA PUBLICACION.', error)
    );
  }

  actualizarPublicacion() {
    this.api.updatePublicacion(this.publicacion).subscribe(
      (data) => {
        this.mostrarMensaje(`PUBLICACION ACTUALIZADA CORRECTAMENTE: ${data.id} ${data.title}...`);
        this.limpiarPublicacion();
        this.getPublicaciones();
      },
      (error) => this.mostrarError('NO FUE POSIBLE ACTUALIZAR LA PUBLICACION.', error)
    );
  }

  editarPublicacion($event: any){
    const pub = $event;
    this.setPublicacion(pub.userId, pub.id, pub.title, pub.body, pub.name);

  }

  eliminarPublicacion($event: { id: any; }){
    const pubId = $event.id;
    this.api.deletePublicacion(pubId).subscribe(
      (data) => {
        this.mostrarMensaje(`PUBLICACION ELIMINADA CORRECTAMENTE: ${pubId}...`);
        this.limpiarPublicacion();
        this.getPublicaciones();
      },
      (error) => this.mostrarError('NO FUE POSIBLE ELIMINAR LA PUBLICACION.', error)
    );
  }

 

  getIdentificadorItemPublicacion(index: any, item: { id: any; }) {
    return item.id;
  }


  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  async mostrarError(mensaje: string, error: any) {
    console.log(mensaje);
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
    throw error;
  }

}

