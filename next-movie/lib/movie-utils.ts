export function imageUrl(path: string, size = "w500") {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function movieYear(date: string) {
  return date?.slice(0, 4) || "Coming soon";
}

export function rating(value: number) {
  return value > 0 ? value.toFixed(1) : "NR";
}
