export function formatDuration(duration) {
  if (typeof duration !== "number" || Number.isNaN(duration)) return "-";

  // Round to nearest minute so decimals like 142.4 become 142
  const totalMinutes = Math.round(duration);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours === 0) parts.push(`${minutes}m`);

  return parts.join(" ");
}
