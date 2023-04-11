import { read, utils } from 'xlsx';

class XlsxImporter {

  importCustomers(file: File): Promise<any[]> {
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
        resolve(customers);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsBinaryString(file);
    });
  }

}


export const xlsxService = new XlsxImporter();