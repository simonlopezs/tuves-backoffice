import { IBase } from "./Base.model";

export interface ICustomer extends IBase {
  nombre: string;
  rut: string;
  email: string;
  telefonos: string;
  direccion: string;
  comuna: string;
  region: string;

  abonado: string;
  grupoAfinidad: string;
  instalador: string;
  usuarioContratoActual: string;
  usuarioVenta: string;
  distribuidor: string;
  dth: string;
  modalidadCobranza: string;
  origenVenta: string;

  pagos: number;
  diasSinRecargar: number;
  tipoRecarga: string;

  fechaIngreso: string;
  fechaInst: string;
  fechaIngresoContratoActual: string;
  fechaCancela: string;
  finRecarga: string;

  _updatedAt: Date;
}
