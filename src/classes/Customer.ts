import { addDays, differenceInDays, format, toDate } from "date-fns";
import { ICustomer } from "../models";
import { formatRut } from "../utils/formatRut";
import { titlecase } from "../utils/titlecase";

enum DateName {
  "ingreso" = "fechaIngreso",
  "instalacion" = "fechaInst",
  "ingresoContratoActual" = "fechaIngresoContratoActual",
  "cancela" = "fechaCancela",
  "finRecarga" = "finRecarga",
}

type DateNameKey = keyof typeof DateName;
export class Customer {
  private data: ICustomer;

  constructor(customer: ICustomer) {
    this.data = customer;
  }

  getName() {
    return titlecase(this.data.nombre);
  }

  getRut() {
    return formatRut(this.data.rut);
  }

  getPhones() {
    return (
      this.data.telefonos
        ?.split(",")
        .map((t: string) => t.replaceAll(/[^0-9]/g, "").trim()) || []
    );
  }

  getId() {
    return this.data._id;
  }

  getCode() {
    return this.data.abonado;
  }

  getAddress() {
    return this.data.direccion;
  }

  getTown() {
    return titlecase(this.data.urbanizacion);
  }

  getCommune() {
    return titlecase(this.data.comuna);
  }

  getRegion() {
    return titlecase(this.data.region);
  }

  getDate(dateName: DateNameKey, asString = true) {
    const date = this.data[DateName[dateName]];
    if (!date) return asString ? "" : null;
    return asString ? format(date, "dd-MM-yyyy") : date;
  }

  getDateAgo(dateName: DateNameKey) {
    const date = this.data[DateName[dateName]];
    if (!date) return "";
    const today = new Date().setHours(12, 0, 0, 0);
    const diff = differenceInDays(today, date);
    return `hace ${diff} día${diff > 1 ? "s" : ""}`;
  }

  getDaysLate() {
    const end = this.getDate("finRecarga", false) as Date;
    if (!end) return null;
    const today = new Date().setHours(12, 0, 0, 0);
    const diff = differenceInDays(today, end);
    return diff;
  }

  getLimitDate() {
    const end = this.getDate("finRecarga", false) as Date;
    if (!end) return null;
    const limit = addDays(end, 60);
    return limit;
  }

  getDaysToLimitDate() {
    const limit = this.getLimitDate();
    if (!limit) return null;
    const today = new Date();
    const diff = differenceInDays(limit, today);
    if (diff === 0) return "hoy";
    return `${diff > 0 ? "en" : "hace"} ${Math.abs(diff)} día${
      Math.abs(diff) > 1 ? "s" : ""
    }`;
  }

  call(phone: string) {
    console.log("calling", phone);
  }

  sendWhatsapp(phone: string) {
    console.log("sending whatsapp to", phone);
  }

  private cleanPhone(phone: string) {
    return phone.replaceAll(/[^0-9]/g, "").trim();
  }
}
