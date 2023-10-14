import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable} from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { DbnameVersionService } from './dbname-version.service';
import { Usuario } from '../model/usuario';
import { BehaviorSubject, Observable } from 'rxjs';
import { showAlert, showAlertDUOC, showAlertError } from '../model/message';


@Injectable()
export class DataBaseService {

  private userUpgrades = [
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

  public listaUsuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  private nombreBaseDatos = 'basedatos';
  private db!: SQLiteDBConnection;
  private estaListoUsuario: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // usuario1: Usuario;
  // usuario2: Usuario;
  // usuario3: Usuario;

  constructor(private sqliteService: SQLiteService, private dbVerService: DbnameVersionService) {
    // this.usuario1 = new Usuario();
    // this.usuario1.setUsuario('atorres@duocuc.cl','1234','Ana','Torres','¿Cuál es tu animal favorito?','gato','no',false);
    // this.usuario2 = new Usuario();
    // this.usuario2.setUsuario('jperez@duocuc.cl','5678','Juan','Pérez','¿Cuál es tu postre favorito?','panqueques','no',false);
    // this.usuario3 = new Usuario();
    // this.usuario3.setUsuario('cmujica@duocuc.cl','0987','Carla','Mujica','¿Cuál es tu vehículo favorito?','moto','no',false);

  }

  async actualizarSesionActiva(correo: string, sesionActiva: string) {
    const sql = 'UPDATE USUARIO SET sesionActiva=? WHERE correo=?';
    await this.db.run(sql, [sesionActiva, correo]);
    await this.leerUsuarios();
  }

  async validarUsuario(correo: string, password: string): Promise<Usuario | undefined> {
    const usuarios: Usuario[]= (await this.db.query('SELECT * FROM USUARIO WHERE correo=? AND password=?;',
      [correo, password])).values as Usuario[];
    return usuarios[0];
  }

  async inicializarBaseDeDatos() {
    
    // Crear base de datos SQLite
    await this.sqliteService.crearBaseDeDatos({
      database: this.nombreBaseDatos,
      upgrade: this.userUpgrades
    });

    // Abrir base de datos
    try {
      this.db = await this.sqliteService.abrirBaseDeDatos(
        this.nombreBaseDatos,
        false,
        'no-encryption',
        1,
        false
      );
    } catch(err: any) {
      showAlertError('inicializarBaseDeDatos', err);
    };

    // Crear usuarios de prueba
    // this.crearUsuario(this.usuario1);
    // this.crearUsuario(this.usuario2);
    // this.crearUsuario(this.usuario3);

    // Respaldar el nombre y versión de la base de datos
    this.dbVerService.set(this.nombreBaseDatos, 1);

    // Cargar la lista de usuarios
    await this.leerUsuarios();
  }

  usuariosFueronCargados() {
    return this.estaListoUsuario.asObservable();
  }

  notificarUsuarios$(): Observable<Usuario[]> {
    return this.listaUsuarios.asObservable();
  }

  async cargarUsuarios() {
    const users: Usuario[]= (await this.db.query('SELECT * FROM USUARIO;')).values as Usuario[];
    this.listaUsuarios.next(users);
  }

  async leerUsuario(correo: string) {
    const users: Usuario[]= (await this.db.query(`SELECT * FROM USUARIO WHERE correo='${correo}';`)).values as Usuario[];
    return users[0];
  }

  async leerUsuarios() {
    await this.cargarUsuarios();
    this.estaListoUsuario.next(true);
  }

  async crearUsuario(usuario: Usuario) {
    try {
      const sql = `INSERT INTO USUARIO (correo, password, nombre, apellido, preguntaSecreta, respuestaSecreta, sesionActiva) VALUES (?,?,?,?,?,?,?);`;
      await this.db.run(sql, [
        usuario.correo,
        usuario.password,
        usuario.nombre,
        usuario.apellido,
        usuario.preguntaSecreta,
        usuario.respuestaSecreta,
        usuario.sesionActiva
      ]);
      await this.leerUsuarios();
    } catch(err) {
      console.log(err);
    }
  }

  async actualizarUsuarioPorCorreo(correo: string, sesionActiva: string) {
    const sql = `UPDATE USUARIO SET sesionActiva=${sesionActiva} WHERE correo='${correo}'`;
    await this.db.run(sql);
    await this.leerUsuarios();
  }

  async eliminarUsuarioPorCorreo(correo: string) {
    const sql = `DELETE FROM USUARIO WHERE correo='${correo}'`;
    await this.db.run(sql);
    await this.leerUsuarios();
  }


}
function err(reason: any): SQLiteDBConnection | PromiseLike<SQLiteDBConnection> {
  throw new Error('Function not implemented.');
}

