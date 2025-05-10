// Tina CMS environment variables
export const TINA_CLIENT_ID = process.env.NEXT_PUBLIC_TINA_CLIENT_ID || 'adc5bb99-664c-49e1-9761-b23bc62ec5f9'
export const TINA_BRANCH = process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.HEAD || 'backup-before-tina-cms'
export const TINA_TOKEN = process.env.TINA_TOKEN
export const TINA_BASEPATH = process.env.NODE_ENV === 'production' ? '/Melaniejazz' : '' 