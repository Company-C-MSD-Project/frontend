export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "LKR 0";

  const amount =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.-]/g, ""));

  if (!Number.isFinite(amount)) return String(value);

  return `LKR ${amount.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}

export function formatCurrencyRange(min: number, max: number): string {
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

export function normalizeCurrencyText(value: number | string | null | undefined): string {
  if (typeof value === "number") return formatCurrency(value);
  if (value === null || value === undefined || value === "") return "";

  return String(value)
    .replace(/US\$\s?/g, "LKR ")
    .replace(/\$\s?/g, "LKR ")
    .replace(/\bUSD\b\s?/gi, "LKR ");
}
