import { promises as fs } from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'rooms.json')

export async function GET() {
  try {
    const content = await fs.readFile(DATA_PATH, 'utf-8')
    const data = JSON.parse(content)
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ message: 'Failed to read rooms' }), { status: 500 })
  }
}

export async function POST(req) {
  try {
    const payload = await req.json()
    const content = await fs.readFile(DATA_PATH, 'utf-8')
    const data = JSON.parse(content)

    const maxId = data.reduce((m, r) => Math.max(m, r.id), 0)
    const next = maxId + 1

    const newRoom = {
      id: next,
      name: payload.name || `Room ${next}`,
      capacity: typeof payload.capacity === 'number' ? payload.capacity : Number(payload.capacity) || 0,
      location: payload.location || '',
      status: typeof payload.status === 'boolean' ? payload.status : true,
      ...(payload.facilities ? { facilities: payload.facilities } : {}),
    }

    data.push(newRoom)
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')

    return new Response(JSON.stringify(newRoom), { status: 201 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ message: 'Failed to create room' }), { status: 500 })
  }
}
