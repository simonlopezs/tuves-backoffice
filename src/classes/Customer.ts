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
  data: ICustomer;

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
    if (!date) return "";
    return asString ? format(date, "dd-MM-yyyy") : date;
  }

  getDaysLate() {
    const today = new Date().setHours(12, 0, 0, 0);
    const end = this.getDate("finRecarga", false) as Date;
    const diff = differenceInDays(today, end);
    return diff;
  }

  getLimitDate() {
    const end = this.getDate("finRecarga", false) as Date;
    const limit = toDate(end);
    addDays(limit, 60);
    return limit;
  }

  getDaysToLimitDate() {
    const today = new Date();
    const limit = this.getLimitDate();
    const diff = differenceInDays(limit, today);
    return diff;
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
