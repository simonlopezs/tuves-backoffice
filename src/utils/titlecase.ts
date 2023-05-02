export function titlecase(str: string) {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .split(" ")
    .map((word, i) => {
      return !articles.includes(word.toLowerCase()) || i === 0
        ? word[0].toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase();
    })
    .join(" ");
}

const articles = [
  "el",
  "la",
  "los",
  "las",
  "del",
  "de",
  "un",
  "uno",
  "unos",
  "unas",
];
