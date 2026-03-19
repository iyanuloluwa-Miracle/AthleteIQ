export function formatDate(dateStr: string | null | undefined, locale = 'en-US'): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(dateStr: string | null | undefined, locale = 'en-US'): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString(locale)
}
