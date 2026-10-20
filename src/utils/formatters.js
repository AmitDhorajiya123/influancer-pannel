// Indian Rupee (₹ / Rs.) formatting utility
export const CURRENCY = {
  code: "INR",
  symbol: "₹",
  label: "Rupees (₹)"
};

export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(num) {
  return Number(num).toLocaleString();
}
