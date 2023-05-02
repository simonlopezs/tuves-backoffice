import { IBase } from "./Base.model";

export interface IDeco extends IBase {
  nombre: string;
  rut: string;
  email: string;
  telefonos: string[];
  direccion: string;
  comuna: string;
  region: string;
  municipio: string;
  abonado: string;
  urbanizacion: string;
  ubicacion: [number, number];

  distribuidor: string;
  permisor: string;
  ordRecupero: string;
  statusOrden: string;
  fchIngreso: Date;
  fchFinalizacion: Date;
  codTecnico: string;
  tecnico: string;
  usuarioIngresa: string;
  origen: string;
  estatusDicom: string;
  smsDireccion: string;
  idDist: string;
  pagos: number;

  decos: {
    serial: string;
    tipo: string;
    econtrato: string;
  }[];
}
