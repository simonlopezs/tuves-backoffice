export function formatRut(_rut: string | number) {
  if (!_rut) return "";
  let rut = clearRUT(_rut);
  const lastDigit = rut.slice(-1).toUpperCase();
  let rutDigits = rut.slice(0, -1);
  rutDigits = rutDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return [rutDigits, lastDigit].join("-");
}

function clearRUT(rut: string | number) {
  return String(rut).replace(/[^0-9a-z]/gi, "");
}
