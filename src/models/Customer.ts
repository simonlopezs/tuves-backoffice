export interface Customer {

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
    diasSinRecarga: number
    tipoRecarga: string

    fechas: {
        ingreso: number | null
        instalacion: number | null
        ingresoContratoActual: number | null
        baja: number | null
        cancela: number | null
        finRecarga: number | null
    }

    _createdAt: number
    _updatedAt: number

}

export const keys = [
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
    ['fechas.baja', 'FECHABAJA'],
    ['fechas.cancela', 'FECHA_CANCELA'],
    ['fechas.finRecarga', 'FIN_RECARGA'],
]