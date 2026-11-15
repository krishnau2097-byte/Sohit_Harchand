/** Certifications — currently empty as user has no certifications. */

export type Certification = { code: string; name: string; issuer: string; year: string; level: 'Expert' | 'Associate' | 'Fundamentals' }

export const certifications: Certification[] = []
