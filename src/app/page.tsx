'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { VideoSelectionModal } from '@/components/video-selection-modal'
import {
  AudioWaveform,
  Clock,
  Hand,
  LucideTrendingUpDown,
  PersonStanding,
} from 'lucide-react'

function TechniqueCard({
  title,
  description,
  Icon,
}: {
  title: string
  description: string
  Icon: React.ElementType
}) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
      <Icon className="w-12 h-12 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Store the file in localStorage as a URL
      const fileUrl = URL.createObjectURL(file)
      sessionStorage.setItem('uploadedVideo', fileUrl)
      setIsModalOpen(false)
      router.push('/analyze')
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Maestro - Piano Performance Analyzer
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            Elevate your piano skills with AI-powered video analysis
          </p>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg">Start Analysis</Button>
            </DialogTrigger>
            <VideoSelectionModal
              onFileUpload={handleFileUpload}
              onClose={() => setIsModalOpen(false)}
              title="Start Your Analysis"
              description="Upload a video of your piano performance to begin."
            />
          </Dialog>
        </div>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                1. Upload Your Video
              </h3>
              <p className="text-gray-600">
                Record your piano performance and upload the video to Maestro.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes various aspects of your performance.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                3. Receive Feedback
              </h3>
              <p className="text-gray-600">
                Get detailed insights and suggestions to improve your technique.
              </p>
            </div>
          </div>
        </section>

        {/* Technique Analysis Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6">Technique Analysis</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TechniqueCard
              title="Posture"
              description="Analyzes your sitting position and overall body alignment for optimal playing comfort and technique."
              Icon={PersonStanding}
            />
            <TechniqueCard
              title="Hand Positioning"
              description="Evaluates the placement and movement of your hands and fingers on the keys for improved accuracy and efficiency."
              Icon={Hand}
            />
            <TechniqueCard
              title="Tempo"
              description="Measures your timing and rhythm consistency throughout the performance."
              Icon={Clock}
            />
            <TechniqueCard
              title="Pedal Usage"
              description="Assesses your use of the piano pedals for appropriate sustain and expression."
              Icon={AudioWaveform}
            />
            <TechniqueCard
              title="Dynamics"
              description="Evaluates your control of volume and expression in your playing."
              Icon={LucideTrendingUpDown}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
