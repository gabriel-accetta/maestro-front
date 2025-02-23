import { z } from 'zod'

export interface Recommendation {
  type: 'Book' | 'Video' | 'Exercise'
  title: string
  description: string
  link?: string
}

export interface TechniqueAnalysis {
  title: string
  rating:
    | 'Needs Improvement'
    | 'Good'
    | 'Excellent'
    | 'Not implemented'
    | 'Not enough data'
  feedback?: string[]
  recommendations?: Recommendation[]
  media?: string[]
}

export const techniqueAnalysisSchema = z.object({
  title: z.string(),
  rating: z.enum([
    'Needs Improvement',
    'Good',
    'Excellent',
    'Not implemented',
    'Not enough data',
  ]),
  feedback: z.array(z.string()).optional(),
  recommendations: z
    .array(
      z.object({
        type: z.enum(['Book', 'Video', 'Exercise']),
        title: z.string(),
        description: z.string(),
        link: z.string().optional(),
      }),
    )
    .optional(),
  media: z.array(z.string()).optional(),
})
