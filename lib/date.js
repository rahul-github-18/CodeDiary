// Timezone helper for Asia/Kolkata (IST, UTC+5:30)

export function getKolkataTime(addMinutes = 0) {
  const now = new Date(Date.now() + addMinutes * 60 * 1000);
  return now.toISOString();
}

export function getKolkataFormattedDate() {
  const now = new Date();
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium'
  }).format(now);
}
