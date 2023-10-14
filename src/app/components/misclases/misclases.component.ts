import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController, IonicModule } from '@ionic/angular';
import { Asistencia } from 'src/app/model/asistencia';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service.service';

@Component({
  selector: 'app-misclases',
  templateUrl: './misclases.component.html',
  styleUrls: ['./misclases.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MisclasesComponent  implements OnInit {
  public asistencia: Asistencia = new Asistencia();
  public escaneando = false;
  public datosQR: string = '';
  public usuario: Usuario;
  public datos: any;


  constructor(private authService : AuthService, private activeroute: ActivatedRoute, private router: Router, private alertController: AlertController, private animationController: AnimationController) { 
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

  ngOnInit() {}

  public logOff(): void{
    this.authService.logout();
    this.router.navigate(['/login'])
  }
  public mostrarDatosQROrdenados(datosQR: string): void {
    this.datosQR = datosQR;
    const objetoDatosQR = JSON.parse(datosQR);
    this.asistencia.setAsistencia(objetoDatosQR.bloqueInicio,objetoDatosQR.bloqueTermino,objetoDatosQR.dia,objetoDatosQR.horaFin,objetoDatosQR.horaInicio, objetoDatosQR.idAsignatura, objetoDatosQR.nombreAsignatura,objetoDatosQR.nombreProfesor,objetoDatosQR.seccion,objetoDatosQR.sede);
  }
}
