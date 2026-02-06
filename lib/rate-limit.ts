import prisma from './prisma'

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // 5 requests per minute

export async function checkRateLimit(ip: string, endpoint: string): Promise<boolean> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW)
  
  try {
    // Clean up old entries
    await prisma.rateLimit.deleteMany({
      where: {
        windowStart: {
          lt: windowStart,
        },
      },
    })
    
    // Check current rate limit
    const existing = await prisma.rateLimit.findUnique({
      where: {
        ip_endpoint: {
          ip,
          endpoint,
        },
      },
    })
    
    if (!existing) {
      // Create new entry
      await prisma.rateLimit.create({
        data: {
          ip,
          endpoint,
          count: 1,
          windowStart: now,
        },
      })
      return true
    }
    
    // Check if within window
    if (existing.windowStart > windowStart) {
      if (existing.count >= MAX_REQUESTS) {
        return false // Rate limited
      }
      
      // Increment count
      await prisma.rateLimit.update({
        where: {
          ip_endpoint: {
            ip,
            endpoint,
          },
        },
        data: {
          count: existing.count + 1,
        },
      })
      return true
    }
    
    // Reset window
    await prisma.rateLimit.update({
      where: {
        ip_endpoint: {
          ip,
          endpoint,
        },
      },
      data: {
        count: 1,
        windowStart: now,
      },
    })
    return true
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return true // Allow request on error
  }
}
