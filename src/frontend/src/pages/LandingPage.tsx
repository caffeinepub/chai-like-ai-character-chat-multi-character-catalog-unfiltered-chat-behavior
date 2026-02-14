import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Film, MessageSquare, Sparkles, User } from 'lucide-react';

export default function LandingPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-xl text-muted-foreground">
              Continue your cinematic conversations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link to="/character">
              <div className="p-8 rounded-lg border border-border bg-card hover:bg-accent transition-colors cursor-pointer h-full">
                <User className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Your Character</h3>
                <p className="text-muted-foreground">
                  Create or edit your AI character persona
                </p>
              </div>
            </Link>

            <Link to="/chats">
              <div className="p-8 rounded-lg border border-border bg-card hover:bg-accent transition-colors cursor-pointer h-full">
                <MessageSquare className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Your Chats</h3>
                <p className="text-muted-foreground">
                  Start new conversations or continue existing ones
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <Film className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-6xl font-bold tracking-tight">
            Chat Like a <span className="text-primary">Movie</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your own AI character and watch your conversations come to life in cinematic movie mode.
            Every chat becomes a scene, every message a performance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center space-y-3">
            <div className="inline-block p-3 rounded-full bg-accent mb-2">
              <User className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">Create Your Character</h3>
            <p className="text-sm text-muted-foreground">
              Design a unique AI persona with custom traits, speaking style, and personality
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-block p-3 rounded-full bg-accent mb-2">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">Chat Naturally</h3>
            <p className="text-sm text-muted-foreground">
              Have engaging conversations that feel authentic and personalized
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-block p-3 rounded-full bg-accent mb-2">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">Watch It Play Out</h3>
            <p className="text-sm text-muted-foreground">
              Transform your chat into a cinematic experience with Movie Mode
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Sign in to start creating your character</p>
        </div>
      </div>
    </div>
  );
}
