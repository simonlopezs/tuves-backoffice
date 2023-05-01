import {
  addDays,
  differenceInDays,
  endOfDay,
  format,
  startOfDay,
  toDate,
} from "date-fns";
import { ICustomer } from "../models";
import { formatRut } from "../utils/formatRut";
import { titlecase } from "../utils/titlecase";
import { upperFirst } from "lodash";
import { formatPhone } from "../utils/formatPhone";

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

  getPayments() {
    return this.data.pagos;
  }

  getAddress() {
    const address = this.data.direccion;
    const [street, number] = address
      .split(",")
      .map((chunk) => chunk.split(":")[1]?.trim())
      .slice(0, 2);
    return `${titlecase(street)}${
      number ? " #" + number : ""
    }, ${this.getTown()}`;
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
    const diff = differenceInDays(endOfDay(limit), startOfDay(today));
    if (diff === 0) return "hoy";
    return `${diff > 0 ? "en" : "hace"} ${Math.abs(diff)} día${
      Math.abs(diff) > 1 ? "s" : ""
    }`;
  }

  call(phone: string) {
    this.contact(phone, "phone");
  }

  sendWhatsapp(phone: string) {
    this.contact(phone, "whatsapp");
  }

  private contact(phone: string, mode: "whatsapp" | "phone") {
    const formattedPhone = formatPhone(phone);
    const message = encodeURIComponent(
      "Hola " + this.getName().split(" ")[0] + ", tenemos promoción de TuVes"
    );
    const url = `https://wa.me/${formattedPhone}?text=${message}`;
    const a = document.createElement("a");
    a.href = mode === "whatsapp" ? url : `tel:+${formattedPhone}`;
    a.target = "_blank";
    a.click();
  }
}
