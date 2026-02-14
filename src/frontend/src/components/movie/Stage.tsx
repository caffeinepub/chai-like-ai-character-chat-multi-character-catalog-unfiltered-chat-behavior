import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import type { MovieBeat } from './useMovieBeats';

interface StageProps {
  beat: MovieBeat;
  background: string;
  sceneTitle?: string;
  characterName: string;
  characterAvatar?: string;
}

export default function Stage({ beat, background, sceneTitle, characterName, characterAvatar }: StageProps) {
  const backgroundImage = `/assets/generated/${background}.dim_1920x1080.png`;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Scene Title */}
      {sceneTitle && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
            <p className="text-white text-sm font-medium tracking-wide">{sceneTitle}</p>
          </div>
        </div>
      )}

      {/* Characters */}
      <div className="absolute inset-0 flex items-end justify-around pb-32 px-16">
        {/* User Character */}
        <div
          className={`transition-all duration-500 ${
            beat.speaker === 'user'
              ? 'scale-110 opacity-100'
              : beat.actingCue === 'reaction'
              ? 'scale-105 opacity-90'
              : 'scale-100 opacity-70'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl">
              <AvatarFallback className="bg-primary">
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-black/60 backdrop-blur-sm px-4 py-1 rounded-full">
              <p className="text-white text-sm font-medium">You</p>
            </div>
          </div>
        </div>

        {/* AI Character */}
        <div
          className={`transition-all duration-500 ${
            beat.speaker === 'character'
              ? 'scale-110 opacity-100'
              : beat.actingCue === 'reaction'
              ? 'scale-105 opacity-90'
              : 'scale-100 opacity-70'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl">
              <AvatarImage src="/assets/generated/avatar-set-1.dim_1024x1024.png" alt={characterName} />
              <AvatarFallback className="bg-accent">
                <Bot className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-black/60 backdrop-blur-sm px-4 py-1 rounded-full">
              <p className="text-white text-sm font-medium">{characterName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle/Speech Bubble */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8">
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
          <p className="text-white text-lg leading-relaxed text-center">{beat.text}</p>
        </div>
      </div>
    </div>
  );
}
