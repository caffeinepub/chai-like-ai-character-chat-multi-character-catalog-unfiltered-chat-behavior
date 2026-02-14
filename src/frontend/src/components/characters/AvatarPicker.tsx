import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface AvatarPickerProps {
  selected: string | null;
  onSelect: (avatar: string | null) => void;
}

const AVATAR_OPTIONS = [
  { id: 'avatar-1', label: 'Avatar 1' },
  { id: 'avatar-2', label: 'Avatar 2' },
  { id: 'avatar-3', label: 'Avatar 3' },
  { id: 'avatar-4', label: 'Avatar 4' },
  { id: 'avatar-5', label: 'Avatar 5' },
  { id: 'avatar-6', label: 'Avatar 6' },
];

export default function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {AVATAR_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          className={`relative rounded-lg border-2 transition-all hover:scale-105 ${
            selected === option.id
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <Avatar className="w-full h-full aspect-square">
            <AvatarImage src="/assets/generated/avatar-set-1.dim_1024x1024.png" alt={option.label} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
        </button>
      ))}
    </div>
  );
}
