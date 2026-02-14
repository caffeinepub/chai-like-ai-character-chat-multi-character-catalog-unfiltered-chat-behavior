import { useState } from 'react';
import { useSendMessage } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Character } from '../../backend';

interface MessageComposerProps {
  sessionId: string;
  character: Character;
}

export default function MessageComposer({ sessionId, character }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessage.isPending) return;

    const messageText = message.trim();
    setMessage('');

    try {
      await sendMessage.mutateAsync({ sessionId, text: messageText });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      setMessage(messageText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <Textarea
        placeholder={`Message ${character.name}...`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className="resize-none min-h-[44px] max-h-32"
        disabled={sendMessage.isPending}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || sendMessage.isPending}
        className="shrink-0"
      >
        {sendMessage.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
