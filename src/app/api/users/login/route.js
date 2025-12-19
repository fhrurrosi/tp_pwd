import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, password } = await req.json()

  if (email === 'user@test.com' && password === '123') {
    const res = NextResponse.json({ success: true })

    const expired = Date.now() + 1000 * 60 * 60 // 1 jam

    res.cookies.set('token', 'jwt-atau-random', {
      httpOnly: true,
      path: '/',
    })

    res.cookies.set('role', 'user', {
      path: '/',
    })

    res.cookies.set('expired', expired.toString(), {
      path: '/',
    })

    return res
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
