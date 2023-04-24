import { camelCase, chain, isNaN } from "lodash";
import { read, utils } from "xlsx";

export type FileType = "customers" | "own-decos" | "all-decos";
const numberKeys = ["pagos", "deuda", "diasSinRecargar"];
export interface UploadResult {
  data: any[];
  type: FileType;
}
class XLSXService {
  loadFile(file: File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const type = this.getFileType(file.name);
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
            .map((item: any) => ({
              ...chain(item)
                .mapKeys((_, k: string) => camelCase(k.toLowerCase()))
                .mapValues((v, k) => {
                  const dateRegex = /\d{4}[-]\d{1,2}[-]\d{1,2}/g;
                  if (typeof v === "string" && v.match(dateRegex)?.length)
                    return this.dateFromString(v);
                  if (numberKeys.includes(k)) {
                    return isNaN(Number(v)) ? v : Number(v);
                  }
                  return typeof v === "string" ? v.trim().toLowerCase() : v;
                })
                .value(),
              urbanizacion:
                (item["DIRECCION"]?.includes("Urb:")
                  ? item["DIRECCION"].split("Urb:")[1].trim().toLowerCase()
                  : item["DIRECCION"].split(",")[0].trim().toLowerCase()) || "",
            }));
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

  private dateFromString(dateString: string) {
    const [year, month, day] = dateString.split("-").map((v) => Number(v));
    const date = new Date(year, month - 1, day);
    date.setHours(12, 0, 0, 0);
    return date;
  }
}

export const xlsxService = new XLSXService();
