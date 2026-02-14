import { useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetSession, useGetSessionMessages } from '../hooks/useQueries';
import MessageTimeline from '../components/chat/MessageTimeline';
import MessageComposer from '../components/chat/MessageComposer';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Film } from 'lucide-react';

export default function ChatSessionPage() {
  const { sessionId } = useParams({ from: '/chat/$sessionId' });
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: session, isLoading: sessionLoading } = useGetSession(sessionId);
  const { data: messages, isLoading: messagesLoading } = useGetSessionMessages(sessionId);

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  if (sessionLoading || messagesLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Session not found</p>
        <Link to="/chats">
          <Button variant="outline">Back to Chats</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/chats">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h2 className="text-xl font-semibold">
                  {session.sceneTitle || `Chat with ${session.character.name}`}
                </h2>
                <p className="text-sm text-muted-foreground">{session.character.name}</p>
              </div>
            </div>
            <Link to="/movie/$sessionId" params={{ sessionId }}>
              <Button variant="outline" size="sm">
                <Film className="mr-2 h-4 w-4" />
                Movie Mode
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <MessageTimeline messages={messages || []} character={session.character} />
      </div>

      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <MessageComposer sessionId={sessionId} character={session.character} />
        </div>
      </div>
    </div>
  );
}
