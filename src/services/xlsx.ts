import { camelCase, chain, compact, isNaN, omit, pick } from "lodash";
import { read, utils } from "xlsx";
import * as Geofire from "geofire-common";
export type FileType = "customers" | "decos";
const numberKeys = ["pagos", "deuda", "diasSinRecargar"];
const optionalDateKeys = ["fchFinalizacion", "fchIngreso", "finRecarga"];

export interface UploadResult {
  data: any[];
  type: FileType;
}
class XLSXService {
  data: any[] = [];

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

          this.data = utils.sheet_to_json(worksheet, {
            dateNF: "dd/mm/yyyy",
            defval: "",
            blankrows: false,
            raw: false,
          });

          this.formatData().addUrbanizacion().formatDecoData(type);

          if (!this.data.length) throw new Error("Archivo sin registros");

          const data = [...this.data];
          this.data = [];
          resolve({
            data,
            type,
          });
        } catch (err: any) {
          this.data = [];
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
      : ["kpi", "base"].some((v) => fileName.includes(v))
      ? "decos"
      : null;
    if (!type) throw new Error("Archivo no reconocido");
    return type;
  }

  private formatData() {
    this.data = this.data.map((item: any) => ({
      ...chain(item)
        .mapKeys((_, k: string) => camelCase(k.toLowerCase()))
        .mapValues((v, k) => {
          const dateRegex = /\d{4}[-]\d{1,2}[-]\d{1,2}/g;
          if (optionalDateKeys.includes(k) && v === "0") return null;
          if (typeof v === "string" && v.match(dateRegex)?.length)
            return this.dateFromString(v);
          if (numberKeys.includes(k)) {
            return isNaN(Number(v)) ? v : Number(v);
          }
          if (k === "direccion") {
            return v
              .split(",")
              .map((v: string) => v.trim())
              .join(", ")
              .toLowerCase();
          }
          return typeof v === "string" ? v.trim().toLowerCase() : v;
        })
        .value(),
    }));
    return this;
  }

  private addUrbanizacion() {
    this.data = this.data.map((item) => ({
      ...item,
      urbanizacion:
        (item["direccion"]?.includes("urb:")
          ? item["direccion"].split("urb:")[1].trim()
          : item["direccion"].split(",")[0].trim()) || "",
    }));
    return this;
  }

  private formatDecoData(type: FileType) {
    if (type === "decos") {
      this.data = chain(this.data)
        .groupBy("rut")
        .toPairs()
        .value()
        .map(([_, values]) => {
          const first = values[0];
          let [lat, lng]: any = (first.ubicacion as string)
            .replaceAll(/[^\d\-\.\,]/g, "")
            .split(",-")
            .map((v: string) => Number(v.replaceAll(",", ".")))
            .filter((v: number) => !isNaN(v))
            .map((v) => -Math.abs(v));
          if (!lng || !lat) {
            lng = null;
            lat = null;
          }
          let geohash: string | null = null;
          if (lng && lat) geohash = Geofire.geohashForLocation([lat, lng]);
          return {
            ...omit(first, [
              "serial",
              "tipo",
              "econtrato",
              "celular",
              "casa",
              "oficina",
            ]),
            decos: values.map((v) => pick(v, ["serial", "tipo", "econtrato"])),
            cantidadDecos: values.length,
            telefonos: compact([
              first["celular"],
              first["casa"],
              first["oficina"],
            ]),
            lng,
            lat,
            geohash,
          };
        });
    }
    return this;
  }

  private dateFromString(dateString: string) {
    const [year, month, day] = dateString.split("-").map((v) => Number(v));
    const date = new Date(year, month - 1, day);
    date.setHours(12, 0, 0, 0);
    return date;
  }
}

export const xlsxService = new XLSXService();
