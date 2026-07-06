'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';

interface ProductVideoProps {
  videos: { url: string; thumbnail: string; duration: string }[];
  productName: string;
}

export function ProductVideo({ videos, productName }: ProductVideoProps) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
      const minutes = Math.floor(videoRef.current.currentTime / 60);
      const seconds = Math.floor(videoRef.current.currentTime % 60);
      setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
    setIsPlaying(false);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(false);
  };

  if (videos.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No videos available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Video Player */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleProgress}
          onEnded={() => setIsPlaying(false)}
          poster={videos[currentVideo].thumbnail}
        >
          <source src={videos[currentVideo].url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play Button Overlay */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
          >
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            >
              <Play className="w-10 h-10 text-gray-900 ml-1" />
            </button>
          </motion.div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <div
            className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-primary transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={prevVideo} className="hover:text-primary transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button onClick={nextVideo} className="hover:text-primary transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
              <button onClick={toggleMute} className="hover:text-primary transition-colors">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <span className="text-sm">
                {currentTime} / {videos[currentVideo].duration}
              </span>
            </div>
            <button className="hover:text-primary transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Thumbnails */}
      {videos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentVideo(index);
                setIsPlaying(false);
              }}
              className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                currentVideo === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-500" />
              </div>
              <div className="absolute bottom-1 right-1 px-1 bg-black/70 rounded text-xs text-white">
                {video.duration}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
