import fs from 'fs'
import path from 'path'

interface ContentCollection {
  name: string
  path: string
  items: Record<string, any>[]
}

// Base path for content
const CONTENT_DIR = path.join(process.cwd(), 'content')

// Cache for content collections
const contentCache: Record<string, ContentCollection> = {}

/**
 * Load all items from a content collection
 */
export async function getCollection(collection: string): Promise<Record<string, any>[]> {
  if (contentCache[collection]) {
    return contentCache[collection].items
  }

  const collectionPath = path.join(CONTENT_DIR, collection)
  
  if (!fs.existsSync(collectionPath)) {
    return []
  }

  try {
    const files = fs.readdirSync(collectionPath)
    const items = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const fileData = fs.readFileSync(path.join(collectionPath, file), 'utf-8')
        const item = JSON.parse(fileData)
        // Add the filename as an id (without the extension)
        item._id = file.replace(/\.json$/, '')
        return item
      })

    contentCache[collection] = {
      name: collection,
      path: collectionPath,
      items
    }

    return items
  } catch (error) {
    console.error(`Error loading collection ${collection}:`, error)
    return []
  }
}

/**
 * Get a single content item by ID
 */
export async function getContentItem(collection: string, id: string): Promise<Record<string, any> | null> {
  const items = await getCollection(collection)
  return items.find(item => item._id === id) || null
}

/**
 * Get site settings
 */
export async function getSiteSettings(): Promise<Record<string, any>> {
  try {
    const settingsPath = path.join(CONTENT_DIR, 'settings', 'general.json')
    
    if (!fs.existsSync(settingsPath)) {
      return {}
    }
    
    const fileData = fs.readFileSync(settingsPath, 'utf-8')
    return JSON.parse(fileData)
  } catch (error) {
    console.error('Error loading site settings:', error)
    return {}
  }
}

/**
 * Get page content by slug
 */
export async function getPageBySlug(slug: string): Promise<Record<string, any> | null> {
  const pages = await getCollection('pages')
  return pages.find(page => page._id === slug) || null
} 