import { useEffect, useRef } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import type { Message, Character } from '../../backend';
import { formatDistanceToNow } from 'date-fns';

interface MessageTimelineProps {
  messages: Message[];
  character: Character;
}

export default function MessageTimeline({ messages, character }: MessageTimelineProps) {
  const { identity } = useInternetIdentity();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Start the conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto px-4 py-6 space-y-6" ref={scrollRef}>
        {messages.map((message, index) => {
          const isUser = identity && message.sender.toString() === identity.getPrincipal().toString();
          const timestamp = Number(message.timestamp) / 1000000;

          return (
            <div
              key={index}
              className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-10 w-10 shrink-0">
                {isUser ? (
                  <>
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage
                      src="/assets/generated/avatar-set-1.dim_1024x1024.png"
                      alt={character.name}
                    />
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>

              <div className={`flex-1 max-w-2xl ${isUser ? 'text-right' : 'text-left'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {isUser ? 'You' : character.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(timestamp, { addSuffix: true })}
                  </span>
                </div>
                <div
                  className={`inline-block px-4 py-3 rounded-2xl ${
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
