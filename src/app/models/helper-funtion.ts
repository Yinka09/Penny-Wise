export function getRandomDateWithinLast10Days(n: number): Date {
  const today = new Date();
  const offset = Math.floor(Math.random() * n);
  const d = new Date(today);
  d.setDate(today.getDate() - offset);

  const formattedDate = d.toISOString().split('T')[0];
  return new Date(formattedDate);
}

export function getLastNDays(n: number): { day: string; date: string }[] {
  const days: { day: string; date: string }[] = [];
  const today = new Date();

  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const date = d.toLocaleDateString('en-GB');

    days.push({ day: dayName, date });
  }

  return days.reverse();
}
