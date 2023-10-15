import { DataBaseService } from '../services/data-base.service';
import { showAlertDUOC } from "./message";

export class Usuario {

    public correo = '';
    public password = '';
    public nombre = '';
    public apellido = '';
    public preguntaSecreta = '';
    public respuestaSecreta = '';
    public sesionActiva = '';

    constructor() { }

    setUsuario(correo: string,
        password: string,
        nombre: string,
        apellido: string,
        preguntaSecreta: string,
        respuestaSecreta: string,
        sesionActiva: string,)
        //hideSecrets: boolean)
    {
        this.correo = correo;
        this.nombre = nombre;
        this.apellido = apellido;
        this.sesionActiva = sesionActiva;
        //if (hideSecrets) {
        //  this.password = '';
        //  this.preguntaSecreta = '';
        //this.respuestaSecreta = '';
        
        //} else {
          this.password = password;
          this.preguntaSecreta = preguntaSecreta;
          this.respuestaSecreta = respuestaSecreta;
        }
    

    getDatosUsuario() {
      return [this.correo, this.password, this.nombre, this.apellido, this.preguntaSecreta,
        this.respuestaSecreta, this.sesionActiva];
    }

    validarCorreo(correo: string): string {
      if (correo.trim() === '') return 'Para ingresar al sistema debe ingresar el correo del usuario.';
      return '';
    }
  
    validarPassword(password: string): string {
      if (password.trim() === '') return 'Para entrar al sistema debe ingresar la contraseña.';
      return '';
    }

    validarNombre(nombre: string): string {
      if (nombre.trim() === '') return 'Debe ingresar su nombre.';
      return '';
    }

    validarApellido(apellido: string): string {
      if (apellido.trim() === '') return 'Debe ingresar su nombre.';
      return '';
    }

    validarPreguntaSecreta(question: string): string {
      if (question.trim() === '') return 'Debe ingresar su pregunta secreta.';
      return '';
    }

    validarRespuestaSecreta(answer: string): string {
      if (answer.trim() === '') return 'Debe ingresar su respuesta secreta.';
      return '';
    }

    validarPropiedadesUsuario(correo: string, password: string, nombre: string, apellido: string
        , preguntaSecreta: string, respuestaSecreta: string): string {
      return this.validarCorreo(correo) 
        || this.validarPassword(password)
        || this.validarNombre(nombre)
        || this.validarApellido(apellido)
        || this.validarPreguntaSecreta(preguntaSecreta)
        || this.validarRespuestaSecreta(respuestaSecreta)
    }

    async validarUsuario(bd: DataBaseService, correo: string, password: string): Promise<boolean> {
      return new Promise(async (resolve) => {
        let msg = this.validarCorreo(correo);
        if (msg) {
          await showAlertDUOC(msg);
          return resolve(false);
        }
        msg = this.validarPassword(password);
        if (msg) {
          await showAlertDUOC(msg);
          return resolve(false);
        }
        //const usu = await db.leerUsuario(correo, password, true);
        const usu = await bd.leerUsuario(correo);
        if (usu) {
          this.correo = usu.correo;
          this.nombre = usu.nombre;
          this.apellido = usu.apellido;
          this.sesionActiva = usu.sesionActiva;
          this.password = usu.password;
          this.preguntaSecreta = usu.preguntaSecreta;
          this.respuestaSecreta = usu.respuestaSecreta;
          return resolve(true);
        } else {
          await showAlertDUOC('El correo o la contraseña no son correctos');
          return resolve(false);
        }
      });
    }
  }
