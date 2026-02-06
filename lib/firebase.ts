import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK for server-side operations
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

// Get Firestore instance
export const db = admin.firestore()

// Collection references
export const teamsCollection = db.collection('teams')
export const adminsCollection = db.collection('admins')
export const rateLimitCollection = db.collection('rateLimit')

// Team interface
export interface Team {
  id?: string
  registrationId: string
  teamName: string
  department: string
  leaderEmail: string
  leaderPhone: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLIST'
  agreedToRules: boolean
  createdAt: Date
  updatedAt: Date
  members: Member[]
}

// Member interface
export interface Member {
  name: string
  email: string
  phone: string
  rollNo: string
  year: string
  isLeader: boolean
}

// Admin interface
export interface Admin {
  id?: string
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
}
