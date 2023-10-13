import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataBaseService } from '../services/data-base.service';
import { AlertController } from '@ionic/angular';
import { AnimationController} from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { Asistencia } from 'src/app/model/asistencia';
import { ToastController } from '@ionic/angular';
import { AfterViewInit, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router , NavigationExtras} from '@angular/router';
import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit, AfterViewInit {
  bloquear: boolean = true;
  @ViewChild('Nombre', { read: ElementRef }) itemNombreTit!: ElementRef;
  @ViewChild('Bienvenida', { read: ElementRef }) itemBienvenida!: ElementRef;
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  
  @ViewChild('itemNombre', { read: ElementRef }) itemNombre!: ElementRef;
  @ViewChild('itemApellido', { read: ElementRef }) itemApellido!: ElementRef;
  @ViewChild('video')
  private video!: ElementRef;

  @ViewChild('canvas')
  private canvas!: ElementRef;

  public asistencia: Asistencia = new Asistencia();
  public escaneando = false;
  public datosQR: string = '';
  public usuario: Usuario;
  public datos = false;

  constructor(private activeroute: ActivatedRoute , private router: Router , private alertController: AlertController , private animationController: AnimationController, private toastController: ToastController) {

    this.usuario = new Usuario('','','','','','');


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
    
      public ngOnInit(): void {
      }
    
      public logOff(): void{
        this.router.navigate(['/login'])
      }
    
      public ngAfterViewInit(): void {
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
              .fromTo('color','orange','white')
              .fromTo("opacity",1,0.2)
              ;
            animation.play();
          }
        if (this.itemTitulo) {
        const animation = this.animationController
          .create()
            .addElement(this.itemTitulo.nativeElement)
            .iterations(Infinity)
            .duration(6000)
            .fromTo('transform', 'translate(0%)', 'translate(100%)')
            ;
          animation.play();
        }
      }
    
      public animateItem(elementRef: any) {
        this.animationController
          .create()
          .addElement(elementRef)
          .iterations(1)
          .duration(600)
          .fromTo('transform', 'translate(100%)', 'translate(0%)')
          .play();
      }
    
      public async comenzarEscaneoQR() {
        const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
          video: {facingMode: 'environment'}
        });
        this.video.nativeElement.srcObject = mediaProvider;
        this.video.nativeElement.setAttribute('playsinline', 'true');
        this.video.nativeElement.play();
        this.escaneando = true;
        requestAnimationFrame(this.verificarVideo.bind(this));
      }
      async verificarVideo() {
        if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
          if (this.obtenerDatosQR() || !this.escaneando) return;
          requestAnimationFrame(this.verificarVideo.bind(this));
        } else {
          requestAnimationFrame(this.verificarVideo.bind(this));
        }
      }
      public obtenerDatosQR(): boolean {
        const w: number = this.video.nativeElement.videoWidth;
        const h: number = this.video.nativeElement.videoHeight;
        this.canvas.nativeElement.width = w;
        this.canvas.nativeElement.height = h;
        const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
        context.drawImage(this.video.nativeElement, 0, 0, w, h);
        const img: ImageData = context.getImageData(0, 0, w, h);
        let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
        if (qrCode) {
          if (qrCode.data !== '') {
            this.escaneando = false;
            this.mostrarDatosQROrdenados(qrCode.data);
            this.datosQR = qrCode.data;
            this.datos = true;
            this.mostrarMensaje(`QR Escaneado`);
            const navigationExtras: NavigationExtras = {
              state: {
                asistencia: this.asistencia,
                usuario: this.usuario
              }
            };
            this.router.navigate(['/home/misclase'], navigationExtras);
            return true;
            
            
          }
        }
        this.datos = false;
        return false;
      }
      public mostrarDatosQROrdenados(datosQR: string): void {
        this.datosQR = datosQR;
        const objetoDatosQR = JSON.parse(datosQR);
        this.asistencia.setAsistencia(objetoDatosQR.bloqueInicio,objetoDatosQR.bloqueTermino,objetoDatosQR.dia,objetoDatosQR.horaFin,objetoDatosQR.horaInicio, objetoDatosQR.idAsignatura, objetoDatosQR.nombreAsignatura,objetoDatosQR.nombreProfesor,objetoDatosQR.seccion,objetoDatosQR.sede);
      }
    
      public detenerEscaneoQR(): void {
        this.mostrarMensaje(`No se escaneo ningun QR`);
        this.escaneando = false;
      }
    
      public miClase(): void {
        this.datos = true;
        if (this.datos) {
          const navigationExtras: NavigationExtras = {
            state: {
              asistencia: this.asistencia,
              usuario: this.usuario
            }
          };
          this.router.navigate(['/misclase'], navigationExtras);
        }
        else{
          this.mostrarMensaje(`No se encontro una clase`);
        }
      }
      async mostrarMensaje(mensaje: string, duracion?: number) {
    
        const toast = await this.toastController.create({
            message: mensaje,
            duration: duracion? duracion: 2000
          });
        toast.present();
      }
      
      segmentChanged(event: any) {
        const navigationExtras: NavigationExtras = {
          state: {
            asistencia: this.asistencia,
            usuario: this.usuario
          }
        };
        this.router.navigate(['home/'+ event.detail.value], navigationExtras);
      }
    
      
    }