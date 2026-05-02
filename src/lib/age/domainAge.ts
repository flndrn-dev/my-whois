export type AgeFragments = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
};

export function computeDomainAge(
  registrationISO: string,
  now = new Date(),
): AgeFragments | null {
  const start = new Date(registrationISO);
  if (Number.isNaN(start.getTime())) return null;
  if (start > now) return null;

  let years = now.getUTCFullYear() - start.getUTCFullYear();
  let months = now.getUTCMonth() - start.getUTCMonth();
  let days = now.getUTCDate() - start.getUTCDate();
  let hours = now.getUTCHours() - start.getUTCHours();
  let minutes = now.getUTCMinutes() - start.getUTCMinutes();
  let seconds = now.getUTCSeconds() - start.getUTCSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
    days += prev.getUTCDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const totalSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);

  return { years, months, days, hours, minutes, seconds, totalSeconds };
}
