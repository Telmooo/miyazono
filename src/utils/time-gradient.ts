export type TimeOfDay = "morning" | "afternoon" | "sunset" | "night";

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "sunset";
  return "night";
}

export function getGradientVar(timeOfDay: TimeOfDay): string {
  const gradients: Record<TimeOfDay, string> = {
    morning: "var(--gradient-morning)",
    afternoon: "var(--gradient-afternoon)",
    sunset: "var(--gradient-sunset)",
    night: "var(--gradient-night)",
  };
  return gradients[timeOfDay];
}
