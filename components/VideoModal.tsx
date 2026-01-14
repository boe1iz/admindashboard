'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

interface VideoModalProps {
  videoUrl: string
  title: string
}

function getEmbedUrl(url: string) {
  try {
    const videoUrl = new URL(url)
    
    // YouTube
    if (videoUrl.hostname.includes('youtube.com') || videoUrl.hostname.includes('youtu.be')) {
      let videoId = ''
      if (videoUrl.hostname.includes('youtu.be')) {
        videoId = videoUrl.pathname.slice(1)
      } else {
        videoId = videoUrl.searchParams.get('v') || ''
      }
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    // Vimeo
    if (videoUrl.hostname.includes('vimeo.com')) {
      const videoId = videoUrl.pathname.split('/').pop()
      return `https://player.vimeo.com/video/${videoId}`
    }
    
    return url
  } catch (e) {
    return url
  }
}

export function VideoModal({ videoUrl, title }: VideoModalProps) {
  const embedUrl = getEmbedUrl(videoUrl)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-primary hover:text-primary/80">
          <Video className="size-4" />
          <span className="sr-only">Play video</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black aspect-video">
        <DialogHeader className="sr-only">
          <DialogTitle>{title} Video</DialogTitle>
        </DialogHeader>
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </DialogContent>
    </Dialog>
  )
}
