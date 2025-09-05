export function getRandomDateWithinLast10Days(n: number): Date {
  const today = new Date();
  const offset = Math.floor(Math.random() * n);
  const d = new Date(today);
  d.setDate(today.getDate() - offset);

  const formattedDate = d.toISOString().split('T')[0];
  return new Date(formattedDate);
}
