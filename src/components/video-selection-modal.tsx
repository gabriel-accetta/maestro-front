'use client'

import type React from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface VideoSelectionModalProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  title?: string
  description?: string
}

export function VideoSelectionModal({
  onFileUpload,
  onClose,
  title = 'Select Video',
  description = 'Upload a video file to analyze your piano performance.',
}: VideoSelectionModalProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload(event)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="video-upload">
            Upload your piano performance video
          </Label>
          <div className="flex items-center gap-4">
            <Button asChild>
              <label htmlFor="video-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </label>
            </Button>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
      <Button type="button" onClick={onClose}>
        Close
      </Button>
    </DialogContent>
  )
}
