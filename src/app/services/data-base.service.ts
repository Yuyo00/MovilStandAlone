import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable} from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { Usuario } from '../model/usuario';
import { BehaviorSubject, Observable } from 'rxjs';
import { showAlert, showAlertDUOC, showAlertError } from '../model/message';

@Injectable()
export class DataBaseService {

  userUpgrades = [
    {
      toVersion: 1,
      statements: [`
      CREATE TABLE IF NOT EXISTS USUARIO (
        correo TEXT PRIMARY KEY NOT NULL,
        password TEXT NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        preguntaSecreta TEXT NOT NULL,
        respuestaSecreta TEXT NOT NULL,
        sesionActiva TEXT NOT NULL
      );
      `]
    }
  ]

  nombreBD = 'basedatos';
  db!: SQLiteDBConnection;
  listaUsuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  listaUsuariosFueActualizada: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqliteService: SQLiteService) { }

  async inicializarBaseDeDatos() {

    
    await this.sqliteService.crearBaseDeDatos({database: this.nombreBD, upgrade: this.userUpgrades});

    
    this.db = await this.sqliteService.abrirBaseDeDatos(this.nombreBD, false, 'no-encryption', 1, false);

    
    await this.crearUsuariosDePrueba();

    
    await this.leerUsuarios();
  }

  async crearUsuariosDePrueba() {
    const usu = new Usuario();
    usu.setUsuario('atorres@duocuc.cl', '1234', 'Ana', 'Torres', 'Nombre de mi mascota', 'gato', 'N');
    await this.guardarUsuario(usu);
    usu.setUsuario('avalenzuela@duocuc.cl', 'qwer', 'Alberto', 'Valenzuela', 'Mi mejor amigo', 'juanito', 'N');
    await this.guardarUsuario(usu);
    usu.setUsuario('cfuentes@duocuc.cl', 'asdf', 'Carla', 'Fuentes', 'Dónde nació mamá', 'valparaiso', 'N');
    await this.guardarUsuario(usu);
  }


  
  async guardarUsuario(usuario: Usuario) {
    const sql = 'INSERT OR REPLACE INTO USUARIO (correo, password, nombre, apellido, ' +
      'preguntaSecreta, respuestaSecreta, sesionActiva) VALUES (?,?,?,?,?,?,?);';
    await this.db.run(sql, [usuario.correo, usuario.password, usuario.nombre, usuario.apellido, 
      usuario.preguntaSecreta, usuario.respuestaSecreta, usuario.sesionActiva]);
    await this.leerUsuarios();
  }


  async leerUsuarios() {
    const usuarios: Usuario[]= (await this.db.query('SELECT * FROM USUARIO;')).values as Usuario[];
    this.listaUsuarios.next(usuarios);
    this.listaUsuariosFueActualizada.next(true);
  }


  async leerUsuario(correo: string): Promise<Usuario | undefined> {
    const usuarios: Usuario[]= (await this.db.query('SELECT * FROM USUARIO WHERE correo=?;', [correo])).values as Usuario[];
    return usuarios[0];
  }


  async eliminarUsuarioUsandoCorreo(correo: string) {
    const sql = 'DELETE FROM USUARIO WHERE correo=?';
    await this.db.run(sql, [correo]);
    await this.leerUsuarios();
  }


  async validarUsuario(correo: string, password: string): Promise<Usuario | undefined> {
    const usuarios: Usuario[]= (await this.db.query('SELECT * FROM USUARIO WHERE correo=? AND password=?;',
      [correo, password])).values as Usuario[];
    return usuarios[0];
  }


  async actualizarSesionActiva(correo: string, sesionActiva: string) {
    const sql = 'UPDATE USUARIO SET sesionActiva=? WHERE correo=?';
    await this.db.run(sql, [sesionActiva, correo]);
    await this.leerUsuarios();
  }
}
