export function percentageCalculator(
  rowsParsed: number,
  rowsTotal: number
): number {
  if (!rowsTotal) return 0;
  return Number(((rowsParsed / rowsTotal) * 100).toFixed(2));
}
