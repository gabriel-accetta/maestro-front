import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-4">
        {images.map((imageBase64, index) => (
          <Image
            key={index}
            src={`data:image/jpeg;base64,${imageBase64}`}
            alt={`Analysis ${index + 1}`}
            width={96}
            height={96}
            className="w-24 h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage(imageBase64)}
          />
        ))}
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Analysis Image</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <Image
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Full size analysis"
              width={1024}
              height={768}
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
