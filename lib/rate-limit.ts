import { rateLimitCollection } from './firebase'

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // 5 requests per minute

export async function checkRateLimit(ip: string, endpoint: string): Promise<boolean> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW)
  
  try {
    const docId = `${ip}_${endpoint}`.replace(/[/.:]/g, '_')
    const docRef = rateLimitCollection.doc(docId)
    const doc = await docRef.get()
    
    if (!doc.exists) {
      // Create new entry
      await docRef.set({
        ip,
        endpoint,
        count: 1,
        windowStart: now,
      })
      return true
    }
    
    const data = doc.data()!
    const existingWindowStart = data.windowStart?.toDate?.() || new Date(data.windowStart)
    
    // Check if within window
    if (existingWindowStart > windowStart) {
      if (data.count >= MAX_REQUESTS) {
        return false // Rate limited
      }
      
      // Increment count
      await docRef.update({
        count: data.count + 1,
      })
      return true
    }
    
    // Reset window
    await docRef.set({
      ip,
      endpoint,
      count: 1,
      windowStart: now,
    })
    return true
  } catch (error) {
    console.error('Rate limit error:', error)
    // Allow request on error (fail open)
    return true
  }
}
