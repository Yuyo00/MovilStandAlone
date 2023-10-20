import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable} from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { Usuario } from '../model/usuario';
import { BehaviorSubject, Observable } from 'rxjs';

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
  datosQR: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private sqliteService: SQLiteService) { }

  async inicializarBaseDeDatos() {

    // Crear base de datos SQLite
    await this.sqliteService.crearBaseDeDatos({database: this.nombreBD, upgrade: this.userUpgrades});

    // Abrir base de datos
    this.db = await this.sqliteService.abrirBaseDeDatos(this.nombreBD, false, 'no-encryption', 1, false);

    // Para crear usuarios de prueba descomenta la siguiente línea
    await this.crearUsuariosDePrueba();

    // Cargar la lista de usuarios
    await this.leerUsuarios();
  }

  async crearUsuariosDePrueba() {
    await this.guardarUsuario(Usuario.getUsuario('atorres@duocuc.cl', '1234', 'Ana', 'Torres', 'Nombre de mi mascota', 'gato', 'N'));
    await this.guardarUsuario(Usuario.getUsuario('avalenzuela@duocuc.cl', 'qwer', 'Alberto', 'Valenzuela', 'Mi mejor amigo', 'juanito', 'N'));
    await this.guardarUsuario(Usuario.getUsuario('cfuentes@duocuc.cl', 'asdf', 'Carla', 'Fuentes', 'Dónde nació mamá', 'valparaiso', 'N'));
  }

  // Create y Update del CRUD. La creación y actualización de un usuario
  // se realizarán con el mismo método, ya que la instrucción "INSERT OR REPLACE"
  // revisa la clave primaria y si el registro es nuevo entonces lo inserta,
  // pero si el registro ya existe, entonces los actualiza.
  
  async guardarUsuario(usuario: Usuario) {
    const sql = 'INSERT OR REPLACE INTO USUARIO (correo, password, nombre, apellido, ' +
      'preguntaSecreta, respuestaSecreta, sesionActiva) VALUES (?,?,?,?,?,?,?);';
    await this.db.run(sql, [usuario.correo, usuario.password, usuario.nombre, usuario.apellido, 
      usuario.preguntaSecreta, usuario.respuestaSecreta, usuario.sesionActiva]);
    await this.leerUsuarios();
  }

  // Cada vez que se ejecute leerUsuario() la aplicación va a cargar los usuarios desde la base de datos,
  // y por medio de la instrucción "this.listaUsuarios.next(usuarios);" le va a notificar a todos los programas
  // que se subscribieron a la propiedad "listaUsuarios", que la tabla de usuarios se acaba de cargar. De esta
  // forma los programas subscritos a la variable listaUsuarios van a forzar la actualización de sus páginas HTML.

  // ReadAll del CRUD. Si existen registros entonces convierte los registros en una lista de usuarios
  // con la instrucción ".values as Usuario[];". Si la tabla no tiene registros.
  async leerUsuarios() {
    const usuarios: Usuario[]= (await this.db.query('SELECT * FROM USUARIO;')).values as Usuario[];
    this.listaUsuarios.next(usuarios);
    this.listaUsuariosFueActualizada.next(true);
  }

  // Read del CRUD
  async leerUsuario(correo: string): Promise<Usuario | undefined> {
    const usuarios: Usuario[]= (await this.db.query('SELECT * FROM USUARIO WHERE correo=?;', [correo])).values as Usuario[];
    return usuarios[0];
  }

  // Delete del CRUD
  async eliminarUsuarioUsandoCorreo(correo: string) {
    const sql = 'DELETE FROM USUARIO WHERE correo=?';
    await this.db.run(sql, [correo]);
    await this.leerUsuarios();
  }

  // Validar usuario
  async validarUsuario(correo: string, password: string): Promise<Usuario | undefined> {
    const usuarios: Usuario[]= (await this.db.query('SELECT * FROM USUARIO WHERE correo=? AND password=?;',
      [correo, password])).values as Usuario[];
    return usuarios[0];
  }

  // Actualizar sesión activa
  async actualizarSesionActiva(correo: string, sesionActiva: string) {
    const sql = 'UPDATE USUARIO SET sesionActiva=? WHERE correo=?';
    await this.db.run(sql, [sesionActiva, correo]);
    await this.leerUsuarios();
  }
}
