import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerCharacter } from '../hooks/useQueries';
import CharacterBuilderForm from '../components/characters/CharacterBuilderForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User } from 'lucide-react';
import { useEffect } from 'react';

export default function CharacterPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: character, isLoading } = useGetCallerCharacter();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              {character ? 'Your Character' : 'Create Your Character'}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {character
              ? 'Update your AI character persona and personality'
              : 'Design your unique AI character that will chat with you'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Character Details</CardTitle>
            <CardDescription>
              Define your character's personality, traits, and speaking style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CharacterBuilderForm existingCharacter={character || undefined} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
