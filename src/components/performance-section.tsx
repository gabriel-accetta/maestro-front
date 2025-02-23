import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RecommendationSection } from './recommendation-section'
import { ImageGallery } from './image-gallery'
import { TechniqueAnalysis } from '@/types/types'

const performanceColorMap: Record<TechniqueAnalysis['rating'], string> = {
  'Needs Improvement': 'bg-red-100 dark:bg-red-900',
  Good: 'bg-yellow-100 dark:bg-yellow-900',
  Excellent: 'bg-green-100 dark:bg-green-900',
  'Not implemented': 'bg-gray-100 dark:bg-gray-900',
  'Not enough data': 'bg-gray-100 dark:bg-gray-900',
}

interface PerformanceSectionProps {
  section: TechniqueAnalysis
}

export function PerformanceSection({ section }: PerformanceSectionProps) {
  return (
    <Card className={performanceColorMap[section.rating]}>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.rating}</CardDescription>
      </CardHeader>
      <CardContent>
        {section.feedback && section.feedback.length > 0 && (
          <ul className="list-disc list-inside mb-1">
            {section.feedback.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        )}
        {section.recommendations &&
          section.recommendations.length > 0 &&
          section.rating !== 'Excellent' && (
            <RecommendationSection recommendations={section.recommendations} />
          )}
        {section.media && section.media.length > 0 && (
          <ImageGallery images={section.media} />
        )}
      </CardContent>
    </Card>
  )
}
