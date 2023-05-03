import { differenceInDays, format } from "date-fns";
import { formatRut } from "../utils/formatRut";
import { titlecase } from "../utils/titlecase";
import { formatPhone } from "../utils/formatPhone";
import { IDeco } from "../models/Deco.model";

export class Deco {
  private data: IDeco;

  constructor(deco: IDeco) {
    this.data = deco;
  }

  getName() {
    return titlecase(this.data.nombre);
  }

  getRut() {
    return formatRut(this.data.rut);
  }

  getDecos() {
    return this.data.decos || [];
  }

  getPhones() {
    return this.data.telefonos;
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
      .slice(1)
      .map((chunk) => chunk.trim());
    return `${titlecase(street)}${
      number ? " #" + number : ""
    }, ${this.getTown()}`;
  }

  getTown() {
    const town = this.data.urbanizacion;
    if (town === "null") return "-";
    return titlecase(this.data.urbanizacion);
  }

  getCommune() {
    return titlecase(this.data.comuna);
  }

  getRegion() {
    return titlecase(this.data.region);
  }

  getDate(asString = true) {
    const date = this.data.fchIngreso;
    if (!date) return asString ? "" : null;
    return asString ? format(date, "dd-MM-yyyy") : date;
  }

  getDateAgo() {
    const date = this.getDate(false) as Date;
    if (!date) return "";
    const today = new Date().setHours(12, 0, 0, 0);
    const diff = differenceInDays(today, date);
    return `hace ${diff} día${diff > 1 ? "s" : ""}`;
  }

  getLocation() {
    const { lng, lat } = this.data;
    if (!lng || !lat) return null;
    return { lat, lng };
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
      "Hola " +
        this.getName().split(" ")[0] +
        ", soy del servicio técnico de TuVes hd. Te contacto porque ncesitamos retirar tus decos."
    );
    const url = `https://wa.me/${formattedPhone}?text=${message}`;
    const a = document.createElement("a");
    a.href = mode === "whatsapp" ? url : `tel:+${formattedPhone}`;
    a.target = "_blank";
    a.click();
  }
}
