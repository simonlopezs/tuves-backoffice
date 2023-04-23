import { read, utils } from 'xlsx';
import { CUSTOMER_KEYS, ICustomer } from '../models/Customer.model';
import { set, keys } from 'lodash';
import { addDays, toDate, format } from 'date-fns';

export type FileType = 'customers' | 'own-decos' | 'all-decos'
export interface UploadResult {
  data: any[],
  type: FileType,
  fileDate: string
}

const decosKeys = ['DISTRIBUIDOR', 'ORD_RECUPERO', 'STATUS_ORDEN', 'SERIAL', 'TIPO']
const customerKeys = ['FECHA', 'DTH', 'GRUPO_AFINIDAD', 'FIN_RECARGA', 'FECHA_INST']
class XLSXService {

  loadFile(file: File): Promise<UploadResult> {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const fileData = e.target.result;
          const workbook = read(fileData, {
            type: 'binary'
          });
          const first = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[first];

          const data = utils.sheet_to_json(worksheet, {
            dateNF: 'dd/mm/yyyy',
            defval: '',
            blankrows: false,
            raw: false,
          })

          if (!data.length)
            throw new Error('Archivo sin registros')

          const result = this.getResult(data)
          resolve(result);
        } catch (err: any) {
          reject(err)
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);

    })
  }

  private getResult(rawData: any[]): UploadResult {
    const type = this.getFileType(rawData)
    const formatFn = type === 'customers' ? this.formatCustomer : this.formatDeco
    const data = rawData.map(formatFn.bind(this))
    const fileDate = format(data[0]._fileDate, 'dd/MM/yyyy') || ''
    return { data, type, fileDate }
  }

  private getFileType(data: any[]): FileType {
    if (decosKeys.every(key => keys(data[0]).includes(key))) {
      if (data.some(item => item['DISTRIBUIDOR'] !== 'CYGNUS SPA'))
        return 'all-decos';
      return 'own-decos'
    }
    if (customerKeys.every(key => keys(data[0]).includes(key)))
      return 'customers';

    throw new Error('Archivo no reconocido')
  }

  private formatCustomer(customer: any): any {
    const fileDate = this.dateFromString(customer['FECHA'])
    const obj: Partial<ICustomer> = {
      _fileDate: fileDate
    }
    CUSTOMER_KEYS.forEach(([key, rawKey]) => {
      let value = customer[rawKey]
      if (key === 'telefonos') {
        value = value?.split(',').map((t: string) => t.trim()) || []
      }
      if (key.includes('fechas')) {
        value = [undefined, null, NaN, 0, '0', ''].includes(value) ? null
          : this.dateFromString(value)
      }
      if (['diasSinRecargar', 'pagos'].includes(key)) {
        value = Number(value)
      }
      set(obj, key, value)
    })
    // const dias = - Math.ceil(((obj.fechas!.finRecarga?.getTime() || 0) - new Date(customer['FECHA']).getTime()) / (1000 * 3600 * 24))
    // console.log(dias, obj.diasSinRecargar)
    let fechaBaja = null
    if (obj.fechas?.finRecarga) {
      fechaBaja = toDate(obj.fechas.finRecarga)
      addDays(fechaBaja, 60)
    }
    set(obj, 'fechas.baja', fechaBaja)
    return obj as ICustomer
  }

  private formatDeco(data: any[]) {
    return []
  }

  private dateFromString(dateString: string) { // yyyy-mm-dd
    const [year, month, day] = dateString.split('-').map(v => Number(v))
    const date = new Date(year, month - 1, day)
    date.setHours(12, 0, 0, 0)
    return date
  }

}

export const xlsxService = new XLSXService();