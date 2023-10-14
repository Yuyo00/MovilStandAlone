import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DataBaseService } from '../services/data-base.service';
import { showAlertDUOC } from "./message";
import { Persona } from "./persona";

export class Usuario {

    public correo = '';
    public password = '';
    public nombre = '';
    public apellido = '';
    public preguntaSecreta = '';
    public respuestaSecreta = '';
    public sesionActiva = '';

    private nombreBaseDatos = 'basedatos';
    private db!: DataBaseService;

    constructor() { }

    setUsuario(correo: string,
        password: string,
        nombre: string,
        apellido: string,
        preguntaSecreta: string,
        respuestaSecreta: string,
        sesionActiva: string,
        hideSecrets: boolean)
    {
        this.correo = correo;
        this.nombre = nombre;
        this.apellido = apellido;
        this.sesionActiva = sesionActiva;
        if (hideSecrets) {
          this.password = '';
          this.preguntaSecreta = '';
          this.respuestaSecreta = '';
        
        } else {
          this.password = password;
          this.preguntaSecreta = preguntaSecreta;
          this.respuestaSecreta = respuestaSecreta;
        }
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

    async validarUsuario(storageService: DataBaseService, correo: string, password: string): Promise<boolean> {
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
        const usu = await storageService.leerUsuario(correo);
        if (usu === null) {
          await showAlertDUOC('El correo o la contraseña no son correctos');
          return resolve(false);
        }
        this.correo = usu.correo;
        this.nombre = usu.nombre;
        this.apellido = usu.apellido;
        this.sesionActiva = usu.sesionActiva;
        this.password = usu.password;
        this.preguntaSecreta = usu.preguntaSecreta;
        this.respuestaSecreta = usu.respuestaSecreta;
        return resolve(true);
      });
    }

    async traerUsuario() {
      return this.correo, this.password, this.nombre, this.apellido, this.preguntaSecreta, this.preguntaSecreta
    }
  
  
  // public correo: string;
  // public password: string;
  // public preguntaSecreta: string;
  // public respuestaSecreta: string;
  // public sesionActiva = '';

  // constructor(correo: string, password: string, preguntaSecreta: string, respuestaSecreta: string
  //     , nombre: string, apellido: string) {
  //   super();
  //   this.correo = correo;
  //   this.password = password;
  //   this.preguntaSecreta = preguntaSecreta;
  //   this.respuestaSecreta = respuestaSecreta;
  //   this.setPersona(nombre, apellido);
  // }

  public getCorreo(): string {
    return this.correo;
  }

  public getPassword(): string {
    return this.password;
  }

  // public setUsuario(correo: string, password: string): void {
  //   this.correo = correo;
  //   this.password = password;
  // }

  // public listaUsuariosValidos(): Usuario[] {
  //   const lista = [];
  //   lista.push(new Usuario(
  //       'sin.datos@duocuc.cl'
  //     , '1234'
  //     , ''
  //     , ''
  //     , ''
  //     , ''
  //   ));
  //   lista.push(new Usuario(
  //       'atorres@duocuc.cl'
  //     , '1234'
  //     , '¿Cuál es tu animal favorito?'
  //     , 'gato'
  //     , 'Ana'
  //     , 'Torres'
  //     ));
  //   lista.push(new Usuario(
  //       'jperez@duocuc.cl'
  //     , '5678'
  //     , '¿Cuál es tu postre favorito?'
  //     , 'panqueques'
  //     , 'Juan'
  //     , 'Pérez'
  //     ));
  //   lista.push(new Usuario(
  //       'cmujica@duocuc.cl'
  //     , '0987'
  //     , '¿Cuál es tu vehículo favorito?'
  //     , 'moto'
  //     , 'Carla'
  //     , 'Mujica'
  //     ));
  //   return lista;
  // }

  // public buscarUsuarioValido(storageService: DataBaseService, correo: string, password: string): Usuario | undefined {
  //   const nived: Usuario | undefined = this.db.leerUsuarios().find(
  //     (      usu: { correo: string; password: string; }) => usu.correo === correo && usu.password === password);
  //   return nived;
  // }

  // public validarCorreo(): string {
  //   const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   if (patronCorreo.test(this.correo)) {
  //     return '';
  //   } else {
  //     return 'El correo ingresado no tiene un formato válido.';
  //   }
  // }

  // public validarPassword(): string {
  //   if (this.password.trim() === '') {
  //     return 'Para entrar al sistema debe ingresar una contraseña.';
  //   }
  //   for(let i = 0; i < this.password.length; i++) {
  //     if ('0123456789'.indexOf(this.password.charAt(i)) === -1) {
  //       return 'La contraseña debe ser numérica.';
  //     }
  //   }
  //   if (this.password.length !== 4) {
  //     return 'La contraseña debe ser numérica de 4 dígitos.';
  //   }
  //   return '';
  // }

  // public validarCredenciales(): string {
  //   const usu: Usuario | undefined = this.buscarUsuarioValido(this.correo, this.password);
  //   return usu? '' : 'El usuario no fue encontrado en el sistema.';
  // }

  // public validarUsuario(): string {
  //   return this.validarCorreo() || this.validarPassword() || this.validarCredenciales();
  // }

  // public buscarCorreoValido(correo: string): Usuario | undefined {
  //   const nived: Usuario | undefined = this.listaUsuariosValidos().find(
  //     usu => usu.correo === correo);
  //   return nived;
  // }

}