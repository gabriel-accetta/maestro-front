export interface Recommendation {
  type: 'Book' | 'Video' | 'Exercise'
  title: string
  description: string
  link?: string
}

export interface TechniqueAnalysis {
  title: string
  rating: 'Needs Improvement' | 'Good' | 'Excellent' | 'Not implemented'
  feedback?: string[]
  recommendations?: Recommendation[]
}
