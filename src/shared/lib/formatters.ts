export function formatNumber(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(n || 0);
}

export function formatMoney(n: number): string {
  return n
    ? new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
      }).format(n)
    : "0 ₽";
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateOnly(dateString?: string): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("ru-RU");
}
