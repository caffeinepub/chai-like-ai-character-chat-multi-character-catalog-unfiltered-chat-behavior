import { useMemo } from 'react';
import type { Message, Character } from '../../backend';

export interface MovieBeat {
  text: string;
  speaker: 'user' | 'character';
  actingCue: 'entrance' | 'idle' | 'emphasis' | 'reaction';
  duration: number;
}

export function useMovieBeats(
  messages: Message[],
  character: Character,
  userPrincipal: string
): MovieBeat[] {
  return useMemo(() => {
    return messages.map((message, index) => {
      const isUser = message.sender.toString() === userPrincipal;
      const textLength = message.text.length;
      
      // Base duration: 3 seconds + 30ms per character
      const baseDuration = 3000 + textLength * 30;
      const duration = Math.min(Math.max(baseDuration, 2000), 15000);

      // Determine acting cue
      let actingCue: MovieBeat['actingCue'] = 'idle';
      if (index === 0) {
        actingCue = 'entrance';
      } else if (message.text.includes('!') || message.text.includes('?')) {
        actingCue = 'emphasis';
      } else if (index > 0 && messages[index - 1].sender.toString() !== message.sender.toString()) {
        actingCue = 'reaction';
      }

      return {
        text: message.text,
        speaker: isUser ? 'user' : 'character',
        actingCue,
        duration,
      };
    });
  }, [messages, userPrincipal]);
}
