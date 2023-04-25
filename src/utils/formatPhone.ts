export function formatPhone(phone: string) {
  if (!phone) return "";
  let code = "56";
  let _phone = phone.replaceAll(/[^0-9]/g, "").trim();
  if (_phone.slice(0, 2) === "51") {
    _phone = _phone.slice(-9);
  } else {
    _phone = "9" + _phone.slice(-8);
  }
  return code + _phone;
}
