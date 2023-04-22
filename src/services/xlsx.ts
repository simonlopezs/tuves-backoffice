import { read, utils } from 'xlsx';
import { Customer, keys } from '../models/Customer';
import { set, snakeCase } from 'lodash';
type FileType = 'Cartera de clientes' | 'Seguimiento de clientes' | 'Clientes dados de baja' | 'Retiro de decos'

export interface UploadResult {
  success: boolean,
  errors?: any[]
  data: any[],
  type: FileType
}
class XLSXService {

  loadFile(file: File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = read(data, {
          type: 'binary'
        });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const customers = utils.sheet_to_json(worksheet, {
          defval: '',
          blankrows: false,
          raw: false,
          dateNF: 'dd/mm/yyyy',
        }).map(c => this.formatCustomer(c))
        resolve({
          success: true,
          data: customers,
          type: 'Cartera de clientes'
        });
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsBinaryString(file);

    });
  }

  formatCustomer(customer: any): any {
    const obj: Partial<Customer> = {}
    keys.forEach(([key, rawKey]) => {
      let value = customer[rawKey]
      if (key === 'telefonos') {
        value = value?.split(',').map((t: string) => t.trim()) || []
      }
      if (key.includes('fechas')) {
        value = [undefined, null, NaN, 0, '0', ''].includes(value) ? null : new Date(value)
        value?.setHours(12, 0, 0, 0)
      }
      if (['diasSinRecargar', 'pagos'].includes(key)) {
        value = Number(value)
      }
      set(obj, key, value)
    })
    console.log(obj)
    return obj as Customer
  }


}


export const xlsxService = new XLSXService();