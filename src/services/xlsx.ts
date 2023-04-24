import { camelCase, chain, isNaN } from "lodash";
import { read, utils } from "xlsx";

export type FileType = "customers" | "own-decos" | "all-decos";
export interface UploadResult {
  data: any[];
  type: FileType;
}
class XLSXService {
  loadFile(file: File): Promise<UploadResult> {
    const type = this.getFileType(file.name);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const fileData = e.target.result;
          const workbook = read(fileData, {
            type: "binary",
          });
          const first = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[first];

          const data = utils
            .sheet_to_json(worksheet, {
              dateNF: "dd/mm/yyyy",
              defval: "",
              blankrows: false,
              raw: false,
            })
            .map((item: any) =>
              chain(item)
                .mapKeys((_, k: string) => camelCase(k.toLowerCase()))
                .mapValues((v) => (isNaN(Number(v)) ? v : Number(v)))
                .value()
            );

          if (!data.length) throw new Error("Archivo sin registros");
          resolve({
            data,
            type,
          });
        } catch (err: any) {
          reject(err);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  }

  private getFileType(fileName: string) {
    fileName = fileName.toLowerCase();
    const type = fileName.includes("cartera")
      ? "customers"
      : fileName.includes("kpi")
      ? "own-decos"
      : fileName.includes("base")
      ? "all-decos"
      : null;
    if (!type) throw new Error("Archivo no reconocido");
    return type;
  }
}

export const xlsxService = new XLSXService();
