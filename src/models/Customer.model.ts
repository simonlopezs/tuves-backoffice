export interface ICustomer {

    nombre: string
    rut: string
    email: string
    telefonos: string[],
    direccion: string,
    comuna: string,
    region: string,

    abonado: string,
    grupoAfinidad: string
    instalador: string
    usuarioContratoActual: string
    usuarioVenta: string
    distribuidor: string
    dth: string
    modalidadCobranza: string
    origenVenta: string

    pagos: number
    diasSinRecargar: number
    tipoRecarga: string

    fechas: {
        ingreso: Date | null
        instalacion: Date | null
        ingresoContratoActual: Date | null
        cancela: Date | null
        finRecarga: Date | null
        baja: Date | null
    }

    _fileDate: Date

}

export const CUSTOMER_KEYS = [
    ['nombre', 'NOMBRE'],
    ['rut', 'RUT'],
    ['email', 'EMAIL'],
    ['telefonos', 'TELEFONOS'],
    ['direccion', 'DIRECCION'],
    ['comuna', 'COMUNA'],
    ['region', 'REGION'],
    ['abonado', 'ABONADO'],
    ['grupoAfinidad', 'GRUPO_AFINIDAD'],
    ['instalador', 'INSTALADOR'],
    ['usuarioContratoActual', 'USUARIO_CONTRATO_ACTUAL'],
    ['usuarioVenta', 'USUARIO_VENTA'],
    ['distribuidor', 'DISTRIBUIDOR'],
    ['dth', 'DTH'],
    ['modalidadCobranza', 'MODALIDAD_COBRANZA'],
    ['origenVenta', 'ORIGEN_VENTA'],
    ['pagos', 'PAGOS'],
    ['diasSinRecargar', 'DIAS_SIN_RECARGAR'],
    ['tipoRecarga', 'TIPO_RECARGA'],
    ['fechas.ingreso', 'FECHA_INGRESO'],
    ['fechas.instalacion', 'FECHA_INST'],
    ['fechas.ingresoContratoActual', 'FECHA_INGRESO_CONTRATO_ACTUAL'],
    ['fechas.cancela', 'FECHA_CANCELA'],
    ['fechas.finRecarga', 'FIN_RECARGA'],
] as const