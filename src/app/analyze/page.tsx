'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { RotateCw, ImageUp } from 'lucide-react'
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
  tempo: techniqueAnalysisSchema.optional(),
  dynamics: techniqueAnalysisSchema.optional(),
  handPositioning: techniqueAnalysisSchema.optional(),
  pedalUsage: techniqueAnalysisSchema.optional(),
})

export default function Analyze() {
  const router = useRouter()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [techniqueAnalysisList, setTechniqueAnalysisList] = useState<
    TechniqueAnalysis[]
  >([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const videoUrl = sessionStorage.getItem('uploadedVideo')
    if (!videoUrl) {
      router.replace('/')
      return
    }

    fetch(videoUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'video.mp4', { type: 'video/mp4' })
        setVideoFile(file)
      })
  }, [router])

  const handleCloseDialog = () => {
    setIsModalOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleCloseDialog()
    const file = event.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      sessionStorage.setItem('uploadedVideo', fileUrl)
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
          parsedData.dynamics || { ...defaultAnalysis, title: 'Dynamics' },
          parsedData.handPositioning || {
            ...defaultAnalysis,
            title: 'Hand Positioning',
          },
          parsedData.pedalUsage || { ...defaultAnalysis, title: 'Pedal Usage' },
        ]

        setTechniqueAnalysisList(updatedTechniqueAnalysisList)
      } catch (error) {
        console.error('Error calling API:', error)
      }
    }

    setIsAnalyzing(false)
    setAnalysisComplete(true)
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
            onClose={handleCloseDialog}
          />
        </Dialog>
      ) : (
        <div className="mb-6">
          <video
            src={URL.createObjectURL(videoFile)}
            className="w-full aspect-video bg-black"
            controls
          />
          <div className="flex justify-center mt-2">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || analysisComplete}
              className="mr-2"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Analyze Performance
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
