import { useEffect } from 'react';
import { useNavigate, useParams, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetSession, useGetSessionMessages } from '../hooks/useQueries';
import MoviePlayer from '../components/movie/MoviePlayer';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function MovieModePage() {
  const { sessionId } = useParams({ from: '/movie/$sessionId' });
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
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!session || !messages) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="mb-4">Session not found</p>
          <Link to="/chats">
            <Button variant="outline">Back to Chats</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black">
      <div className="absolute top-4 left-4 z-50">
        <Link to="/chat/$sessionId" params={{ sessionId }}>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </Button>
        </Link>
      </div>
      <MoviePlayer session={session} messages={messages} />
    </div>
  );
}
