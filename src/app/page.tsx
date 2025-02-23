'use client'

import type React from 'react'
import { useState } from 'react'
import { Play, Pause, RotateCw, ImageUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { VideoSelectionModal } from '@/components/video-selection-modal'
import { PerformanceSection } from '@/components/performance-section'
import { TechniqueAnalysis, techniqueAnalysisSchema } from '@/types/types'
import { z } from 'zod'

const analyzeVideoResponseSchema = z.object({
  posture: techniqueAnalysisSchema.optional(),
  handPositioning: techniqueAnalysisSchema.optional(),
  tempo: techniqueAnalysisSchema.optional(),
  pedalUsage: techniqueAnalysisSchema.optional(),
  dynamics: techniqueAnalysisSchema.optional(),
})

export default function MaestroInterface() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [techniqueAnalysisList, setTechniqueAnalysisList] = useState<
    TechniqueAnalysis[]
  >([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setAnalysisComplete(false)
      setTechniqueAnalysisList([])
      setIsModalOpen(false)
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    if (videoFile) {
      const formData = new FormData()
      formData.append('video', videoFile)

      try {
        const response = await fetch('http://127.0.0.1:5000/analyze', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        console.log('API response:', data)

        const parsedData = analyzeVideoResponseSchema.parse(data)

        const defaultAnalysis: TechniqueAnalysis = {
          title: '',
          rating: 'Not implemented',
        }

        const updatedTechniqueAnalysisList: TechniqueAnalysis[] = [
          parsedData.posture || { ...defaultAnalysis, title: 'Posture' },
          parsedData.tempo || { ...defaultAnalysis, title: 'Tempo' },
          parsedData.handPositioning || {
            ...defaultAnalysis,
            title: 'Hand Positioning',
          },
          parsedData.pedalUsage || { ...defaultAnalysis, title: 'Pedal Usage' },
          parsedData.dynamics || { ...defaultAnalysis, title: 'Dynamics' },
        ]

        setTechniqueAnalysisList(updatedTechniqueAnalysisList)
      } catch (error) {
        console.error('Error calling API:', error)
      }
    }

    setIsAnalyzing(false)
    setAnalysisComplete(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">
        Maestro - Piano Performance Analyzer
      </h1>

      {!videoFile ? (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Select Video</Button>
          </DialogTrigger>
          <VideoSelectionModal
            onFileUpload={handleFileUpload}
            onClose={() => setIsModalOpen(false)}
          />
        </Dialog>
      ) : (
        <div className="mb-6">
          <video
            src={URL.createObjectURL(videoFile)}
            className="w-full aspect-video bg-black"
            controls={isPlaying}
          />
          <div className="flex justify-center mt-2">
            <Button onClick={togglePlayPause} className="mr-2">
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || analysisComplete}
              className="mr-2"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Analyze Performance
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ImageUp className="mr-2 h-4 w-4" />
                  Change Video
                </Button>
              </DialogTrigger>
              <VideoSelectionModal
                onFileUpload={handleFileUpload}
                onClose={() => setIsModalOpen(false)}
              />
            </Dialog>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Analyzing your performance...</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={66} className="w-full" />
          </CardContent>
        </Card>
      )}

      {analysisComplete && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance</CardTitle>
              <CardDescription>Your piano performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Great job! Here&apos;s a breakdown of your performance:</p>
            </CardContent>
          </Card>

          {techniqueAnalysisList.map((techniqueAnalysis, index) => (
            <PerformanceSection key={index} section={techniqueAnalysis} />
          ))}
        </div>
      )}
    </div>
  )
}
