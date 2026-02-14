import { useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllSessions, useGetCallerCharacter, useStartSession } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageSquare, Plus, Film } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function ChatsPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: sessions, isLoading: sessionsLoading } = useGetAllSessions();
  const { data: character, isLoading: characterLoading } = useGetCallerCharacter();
  const startSession = useStartSession();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  const handleStartNewChat = async () => {
    if (!character) {
      toast.error('Please create a character first');
      navigate({ to: '/character' });
      return;
    }

    try {
      const sessionId = await startSession.mutateAsync({
        characterId: character.creator,
        background: null,
        sceneTitle: null,
      });
      navigate({ to: '/chat/$sessionId', params: { sessionId } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to start chat');
    }
  };

  if (!identity) {
    return null;
  }

  if (sessionsLoading || characterLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Your Chats</h1>
            </div>
            <p className="text-muted-foreground">
              {character
                ? `Start a new conversation with ${character.name}`
                : 'Create a character to start chatting'}
            </p>
          </div>
          <Button onClick={handleStartNewChat} disabled={!character || startSession.isPending} size="lg">
            {startSession.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </>
            )}
          </Button>
        </div>

        {!character && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>No Character Yet</CardTitle>
              <CardDescription>Create your AI character to start chatting</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/character">
                <Button>Create Character</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {sessions && sessions.length > 0 ? (
          <div className="grid gap-4">
            {sessions.map((session, index) => {
              const lastMessage = session.messages[session.messages.length - 1];
              const sessionId = `${session.creator.toString()}:${session.character.name}:${
                session.messages[0]?.timestamp || Date.now()
              }`;

              return (
                <Card key={index} className="hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">
                          {session.sceneTitle || `Chat with ${session.character.name}`}
                        </CardTitle>
                        <CardDescription>
                          {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                          {lastMessage &&
                            ` • ${formatDistanceToNow(Number(lastMessage.timestamp) / 1000000, {
                              addSuffix: true,
                            })}`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/chat/$sessionId" params={{ sessionId }}>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Open
                          </Button>
                        </Link>
                        <Link to="/movie/$sessionId" params={{ sessionId }}>
                          <Button variant="outline" size="sm">
                            <Film className="mr-2 h-4 w-4" />
                            Movie
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  {lastMessage && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{lastMessage.text}</p>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No chats yet. Start your first conversation!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
