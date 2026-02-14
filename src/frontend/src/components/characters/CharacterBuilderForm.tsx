import { useState } from 'react';
import { useCreateCharacter } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AvatarPicker from './AvatarPicker';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Character } from '../../backend';

interface CharacterBuilderFormProps {
  existingCharacter?: Character;
}

export default function CharacterBuilderForm({ existingCharacter }: CharacterBuilderFormProps) {
  const [name, setName] = useState(existingCharacter?.name || '');
  const [description, setDescription] = useState(existingCharacter?.description || '');
  const [traits, setTraits] = useState(existingCharacter?.traits || '');
  const [speakingStyle, setSpeakingStyle] = useState(existingCharacter?.speakingStyle || '');
  const [avatar, setAvatar] = useState<string | null>(existingCharacter?.avatar || null);

  const createCharacter = useCreateCharacter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createCharacter.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        traits: traits.trim(),
        speakingStyle: speakingStyle.trim(),
        avatar,
      });
      toast.success(existingCharacter ? 'Character updated!' : 'Character created!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save character');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Character Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., Luna the Wise"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your character's personality and background..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="traits">Personality Traits</Label>
        <Textarea
          id="traits"
          placeholder="e.g., Curious, empathetic, philosophical, witty..."
          value={traits}
          onChange={(e) => setTraits(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="speakingStyle">Speaking Style</Label>
        <Textarea
          id="speakingStyle"
          placeholder="e.g., Speaks in thoughtful, measured tones with occasional poetic phrases..."
          value={speakingStyle}
          onChange={(e) => setSpeakingStyle(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Avatar</Label>
        <AvatarPicker selected={avatar} onSelect={setAvatar} />
      </div>

      <Button type="submit" className="w-full" disabled={createCharacter.isPending}>
        {createCharacter.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : existingCharacter ? (
          'Update Character'
        ) : (
          'Create Character'
        )}
      </Button>
    </form>
  );
}
