import { read, utils } from 'xlsx';

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
          // raw: true,
          // cellDates: true,
          dateNF: 'yyyy-mm-dd'
        });
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

}


export const xlsxService = new XLSXService();