function createLocalDate(hour: number, minute = 0, offsetDays = 0): Date {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + offsetDays,
    hour,
    minute,
    0,
  );
}

export function createTimeYesterday(hour: number, minute = 0): Date {
  return createLocalDate(hour, minute, -1);
}

export function createTimeToday(hour: number, minute = 0): Date {
  return createLocalDate(hour, minute, 0);
}

export function createTimeTomorrow(hour: number, minute = 0): Date {
  return createLocalDate(hour, minute, 1);
}
