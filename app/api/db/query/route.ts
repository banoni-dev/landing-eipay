import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory database simulation for demo purposes
// In a real app, you'd use a proper SQLite connection
const users: any[] = [
  { id: 1, email: "demo@example.com", password: "password123", created_at: new Date().toISOString() },
]
let nextId = 2

export async function POST(request: NextRequest) {
  try {
    const { query, params = [] } = await request.json()

    // Simple query parser for demo purposes
    if (query.includes("SELECT") && query.includes("users WHERE email")) {
      const email = params[0]
      const user = users.find((u) => u.email === email)
      return NextResponse.json({
        rows: user ? [user] : [],
      })
    }

    if (query.includes("INSERT INTO users")) {
      const [email, password] = params
      const newUser = {
        id: nextId++,
        email,
        password,
        created_at: new Date().toISOString(),
      }
      users.push(newUser)
      return NextResponse.json({
        rows: [{ id: newUser.id, email: newUser.email }],
      })
    }

    if (query.includes("SELECT id FROM users WHERE email")) {
      const email = params[0]
      const user = users.find((u) => u.email === email)
      return NextResponse.json({
        rows: user ? [{ id: user.id }] : [],
      })
    }

    return NextResponse.json({ rows: [] })
  } catch (error) {
    return NextResponse.json({ error: "Database query failed" }, { status: 500 })
  }
}
