import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import Stage from './Stage';
import { useMovieBeats } from './useMovieBeats';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import type { Session, Message } from '../../backend';

interface MoviePlayerProps {
  session: Session;
  messages: Message[];
}

export default function MoviePlayer({ session, messages }: MoviePlayerProps) {
  const { identity } = useInternetIdentity();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);

  const beats = useMovieBeats(messages, session.character, identity?.getPrincipal().toString() || '');

  useEffect(() => {
    if (!isPlaying || beats.length === 0) return;

    const currentBeat = beats[currentBeatIndex];
    const duration = currentBeat.duration / speed;

    const timer = setTimeout(() => {
      if (currentBeatIndex < beats.length - 1) {
        setCurrentBeatIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentBeatIndex, beats, speed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentBeatIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentBeatIndex((prev) => Math.min(beats.length - 1, prev + 1));
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  if (beats.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <p>No messages to display</p>
      </div>
    );
  }

  const currentBeat = beats[currentBeatIndex];
  const background = session.background || 'movie-bg-1';

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <Stage
          beat={currentBeat}
          background={background}
          sceneTitle={session.sceneTitle || undefined}
          characterName={session.character.name}
          characterAvatar={session.character.avatar || undefined}
        />
      </div>

      <div className="bg-black/90 backdrop-blur-sm border-t border-white/10 p-6">
        <div className="container mx-auto max-w-4xl space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentBeatIndex === 0}
              className="text-white hover:bg-white/10"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/10 h-12 w-12"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentBeatIndex === beats.length - 1}
              className="text-white hover:bg-white/10"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white text-sm whitespace-nowrap">
              {currentBeatIndex + 1} / {beats.length}
            </span>
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${((currentBeatIndex + 1) / beats.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white text-sm whitespace-nowrap">Speed: {speed}x</span>
            <Slider
              value={[speed]}
              onValueChange={handleSpeedChange}
              min={0.5}
              max={2}
              step={0.25}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
