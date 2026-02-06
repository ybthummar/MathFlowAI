import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { adminsCollection, Admin } from '@/lib/firebase'
import { loginSchema } from '@/lib/validators'
import { createToken, setSession, clearSession, getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // Find admin by email
    const snapshot = await adminsCollection
      .where('email', '==', email)
      .limit(1)
      .get()

    if (snapshot.empty) {
      // If no admin exists and this is the default admin credentials, create one
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const adminRef = await adminsCollection.add({
          email,
          password: hashedPassword,
          name: 'Admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        const token = await createToken({
          adminId: adminRef.id,
          email,
        })

        await setSession(token)

        return NextResponse.json({
          success: true,
          admin: {
            id: adminRef.id,
            email,
            name: 'Admin',
          },
        })
      }

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const adminDoc = snapshot.docs[0]
    const admin = { id: adminDoc.id, ...adminDoc.data() } as Admin & { id: string }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken({
      adminId: admin.id,
      email: admin.email,
    })

    // Set session cookie
    await setSession(token)

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await clearSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      admin: session,
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}
