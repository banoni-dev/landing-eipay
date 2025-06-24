import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "SELECT id FROM users WHERE email = ?",
        params: [email],
      }),
    })

    const checkData = await checkResponse.json()

    if (checkData.rows && checkData.rows.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Insert new user
    const insertResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "INSERT INTO users (email, password) VALUES (?, ?) RETURNING id, email",
        params: [email, password],
      }),
    })

    const insertData = await insertResponse.json()

    if (insertData.rows && insertData.rows.length > 0) {
      const user = insertData.rows[0]
      return NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email },
      })
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
