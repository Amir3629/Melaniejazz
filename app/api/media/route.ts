import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

// GET endpoint to retrieve media files
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'No media ID provided' }, { status: 400 })
    }

    // Resolve the file path (ensuring it's within the public/uploads directory)
    const safeId = id.replace(/\.\./g, '')
    const filePath = path.join(process.cwd(), 'public', safeId)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileData = fs.readFileSync(filePath)
    const base64Data = fileData.toString('base64')

    return NextResponse.json({
      id: safeId,
      filename: path.basename(safeId),
      contentType: getContentType(safeId),
      data: `data:${getContentType(safeId)};base64,${base64Data}`,
    })
  } catch (error) {
    console.error('Error retrieving media:', error)
    return NextResponse.json({ error: 'Failed to retrieve media' }, { status: 500 })
  }
}

// POST endpoint to upload media files
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Generate safe filename
    const fileExtension = path.extname(file.name)
    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`
    const filePath = path.join(uploadsDir, safeFilename)
    
    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    const relativePath = `/uploads/${safeFilename}`

    return NextResponse.json({
      id: relativePath,
      filename: safeFilename,
      contentType: file.type,
      uploadPath: relativePath,
    })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 })
  }
}

// Helper function to get content type from filename
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }

  return contentTypes[ext] || 'application/octet-stream'
} 