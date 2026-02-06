import { z } from 'zod'

// Member validation schema
export const memberSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid phone number (must be 10 digits starting with 6-9)'),
  rollNo: z
    .string()
    .min(1, 'Roll number is required')
    .max(20, 'Roll number must be less than 20 characters'),
  year: z
    .string()
    .min(1, 'Year is required'),
  isLeader: z.boolean().default(false),
})

// Team registration validation schema
export const registrationSchema = z.object({
  teamName: z
    .string()
    .min(3, 'Team name must be at least 3 characters')
    .max(50, 'Team name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Team name can only contain letters, numbers, spaces, hyphens, and underscores'),
  department: z
    .string()
    .min(1, 'Please select a department'),
  leaderEmail: z
    .string()
    .email('Invalid email address'),
  leaderPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid phone number (must be 10 digits starting with 6-9)'),
  members: z
    .array(memberSchema)
    .min(3, 'Team must have at least 3 members')
    .max(5, 'Team can have at most 5 members'),
  agreedToRules: z
    .boolean()
    .refine(val => val === true, 'You must agree to the rules and code of conduct'),
})

// Admin login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Team status update schema
export const statusUpdateSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'WAITLIST']),
})

// Export types
export type MemberInput = z.infer<typeof memberSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>

// Departments list (All CHARUSAT Faculties)
export const DEPARTMENTS = [
  // CSPIT Departments
  'CSPIT - AIML',
  'CSPIT - CSE',
  'CSPIT - IT',
  'CSPIT - CE',
  'CSPIT - EE',
  'CSPIT - EC',
  'CSPIT - ME',
  'CSPIT - CL',
  // DEPSTAR Departments
  'DEPSTAR - IT',
  'DEPSTAR - CE',
  'DEPSTAR - CSE',
  // Other Faculties
  'PDPIAS',
  'BDIAS',
  'IIIM',
  'CLASS',
  'RPCP',
  'CMPICA',
  'MTIN',
  'ARIP',
] as const

// Year options (Only 1st and 2nd year students are eligible)
export const YEARS = [
  '1st Year',
  '2nd Year',
] as const
