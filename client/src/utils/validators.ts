export const isEmail = (val: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

export const minLength = (min: number) => (val: string): boolean =>
  typeof val === 'string' && val.length >= min

export const required = (val: unknown): boolean =>
  val !== null && val !== undefined && val !== ''
