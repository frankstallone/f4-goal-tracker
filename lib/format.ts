const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function formatCurrencyFromCents(cents: number) {
  return usdFormatter.format(cents / 100)
}

export function formatSignedCurrencyFromCents(
  cents: number,
  options: { showPlus?: boolean } = {}
) {
  const formatted = usdFormatter.format(Math.abs(cents) / 100)
  if (cents < 0) return `-${formatted}`
  if (cents > 0 && options.showPlus) return `+${formatted}`
  return formatted
}

export function formatLongDate(value: string | Date) {
  const date =
    typeof value === "string"
      ? parseDateInput(value)
      : value
  return dateFormatter.format(date)
}

function parseDateInput(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number)
    return new Date(Date.UTC(year, month - 1, day))
  }
  return new Date(value)
}
