

export class Persona {

    public nombre;
    public apellido;
  
  
  
    constructor() {
      this.nombre = '';
      this.apellido = '';
  
    }
  
    public setPersona(nombre: string, apellido: string) {
      this.nombre = nombre;
      this.apellido = apellido;
  
    }
  
    public getNombre(): string {
      if (this.nombre.trim() === '') return 'No asignado';
      return this.nombre;
    }
  
    public getApellido() {
      if (this.apellido.trim() === '') return 'No asignado';
      return this.apellido;
    }
  }