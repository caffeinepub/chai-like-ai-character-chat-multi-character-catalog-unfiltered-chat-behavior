import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Character, Session, Message } from '../backend';
import { Principal } from '@dfinity/principal';

// Query keys
export const queryKeys = {
  userProfile: ['currentUserProfile'] as const,
  character: ['character'] as const,
  allCharacters: ['allCharacters'] as const,
  sessions: ['sessions'] as const,
  session: (id: string) => ['session', id] as const,
  messages: (id: string) => ['messages', id] as const,
};

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: queryKeys.userProfile,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
}

// Character
export function useGetCallerCharacter() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Character | null>({
    queryKey: queryKeys.character,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerCharacter();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      traits: string;
      speakingStyle: string;
      avatar: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCharacter(
        data.name,
        data.description,
        data.traits,
        data.speakingStyle,
        data.avatar
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.character });
      queryClient.invalidateQueries({ queryKey: queryKeys.allCharacters });
    },
  });
}

export function useGetAllCharacters() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Character[]>({
    queryKey: queryKeys.allCharacters,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllCharacters();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Sessions
export function useGetAllSessions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Session[]>({
    queryKey: queryKeys.sessions,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllSessions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSession(sessionId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Session>({
    queryKey: queryKeys.session(sessionId),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSession(sessionId);
    },
    enabled: !!actor && !actorFetching && !!sessionId,
  });
}

export function useStartSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      characterId: Principal;
      background: string | null;
      sceneTitle: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startSession(data.characterId, data.background, data.sceneTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
    },
  });
}

// Messages
export function useGetSessionMessages(sessionId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: queryKeys.messages(sessionId),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSessionMessages(sessionId);
    },
    enabled: !!actor && !actorFetching && !!sessionId,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { sessionId: string; text: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(data.sessionId, data.text);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.session(variables.sessionId) });
    },
  });
}
