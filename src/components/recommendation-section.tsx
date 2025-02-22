import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Recommendation } from '@/types/types'

interface RecommendationSectionProps {
  recommendations: Recommendation[]
}

export function RecommendationSection({
  recommendations,
}: RecommendationSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="recommendations">
        <AccordionTrigger>
          <span className="text-sm font-medium">
            Recommendations for Improvement
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md shadow-sm"
              >
                <span className="font-semibold">{rec.type}: </span>
                {rec.link ? (
                  <a
                    href={rec.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {rec.title}
                  </a>
                ) : (
                  <span>{rec.title}</span>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {rec.description}
                </p>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
