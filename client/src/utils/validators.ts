export const isEmail = (val: string): boolean =>
  /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(val)

export const minLength = (min: number) => (val: string): boolean =>
  typeof val === 'string' && val.length >= min

export const required = (val: unknown): boolean =>
  val !== null && val !== undefined && val !== ''
