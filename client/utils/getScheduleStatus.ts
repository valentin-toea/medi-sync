export type ScheduleStatus = "now" | "upcoming" | "past";

export function getScheduleStatus(
  start: string | Date,
  end: string | Date,
  now: Date = new Date()
): ScheduleStatus {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (now >= startDate && now < endDate) {
    return "now";
  }

  if (now < startDate) {
    return "upcoming";
  }

  return "past";
}
