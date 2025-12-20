import { promises as fs } from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'rooms.json')

export async function PUT(req, { params }) {
  try {
    const id = Number(params.id)
    const body = await req.json()

    const content = await fs.readFile(DATA_PATH, 'utf-8')
    const data = JSON.parse(content)

    const idx = data.findIndex((r) => r.id === id)
    if (idx === -1) return new Response(JSON.stringify({ message: 'Room not found' }), { status: 404 })

    // merge fields
    data[idx] = { ...data[idx], ...body }

    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')

    return new Response(JSON.stringify(data[idx]), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ message: 'Failed to update room' }), { status: 500 })
  }
}
