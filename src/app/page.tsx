'use client'

import type React from 'react'
import { useState } from 'react'
import { Play, Pause, RotateCw, X } from 'lucide-react'
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
import { TechniqueAnalysis } from '@/types/types'

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

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulating analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      // Simulated performance analysis results
      setTechniqueAnalysisList([
        {
          title: 'Hand Positioning',
          rating: 'Good',
          feedback: [
            'Keep your wrists slightly higher when playing chords',
            'Maintain a more relaxed posture in your fingers',
          ],
          recommendations: [
            {
              type: 'Book',
              title: "The Pianist's Guide to Hand Health",
              description:
                'Comprehensive guide on proper hand positioning and techniques.',
              link: 'https://example.com/pianist-hand-health',
            },
            {
              type: 'Video',
              title: 'Mastering Hand Posture for Pianists',
              description:
                'Video tutorial on achieving the perfect hand position.',
              link: 'https://example.com/hand-posture-tutorial',
            },
            {
              type: 'Exercise',
              title: 'Daily Wrist Flexibility Routine',
              description:
                'A set of exercises to improve wrist flexibility and strength.',
            },
          ],
        },
        {
          title: 'Posture',
          rating: 'Good',
          feedback: [
            "Overall posture is good, but there's room for improvement",
            'Keep your back straighter and shoulders relaxed',
          ],
          recommendations: [
            {
              type: 'Video',
              title: 'Perfect Piano Posture',
              description:
                'Learn the ideal posture for comfortable and efficient piano playing.',
              link: 'https://example.com/piano-posture-tutorial',
            },
            {
              type: 'Exercise',
              title: 'Daily Posture Routine for Pianists',
              description:
                'A set of exercises to improve and maintain good posture at the piano.',
            },
            {
              type: 'Book',
              title: "The Pianist's Guide to Ergonomics",
              description:
                'Comprehensive guide on maintaining proper posture and preventing injuries.',
              link: 'https://example.com/pianist-ergonomics-book',
            },
          ],
        },
        {
          title: 'Tempo',
          rating: 'Excellent',
          feedback: ['Consistent tempo throughout most of the piece'],
        },
        {
          title: 'Pedal Usage',
          rating: 'Not implemented',
        },
        {
          title: 'Dynamics',
          rating: 'Not implemented',
        },
      ])
    }, 3000)
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
                  <X className="mr-2 h-4 w-4" />
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
