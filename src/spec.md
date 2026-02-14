# Specification

## Summary
**Goal:** Build an authenticated character chat app with user-owned characters and saved chat sessions, including a cinematic “Movie Mode” playback and simple scene customization.

**Planned changes:**
- Add Internet Identity sign-in/sign-out and gate character creation and saved chats to authenticated users (landing page remains browsable when signed out).
- Implement a Character Builder for signed-in users (name, description, personality traits, speaking style, optional bundled avatar selection) with validation and per-user CRUD.
- Implement a 1:1 chat experience: start sessions per character, send messages, show timeline UI, persist sessions/messages per user, and allow re-opening sessions.
- Add a backend “Character Reply Engine” (no external LLMs) that generates replies based on character persona fields and recent chat context via a dedicated API.
- Add “Movie Mode” for any chat session with cinematic playback: timed line delivery, beat progression, Play/Pause, Next/Previous, Speed controls, and basic acting cues.
- Add per-session scene settings (scene title + bundled background selection), persist them, and use them in Movie Mode.
- Apply a coherent cinematic visual theme across screens (avoid blue/purple as primary palette).
- Expose backend APIs (single Motoko actor) for characters/sessions/messages and integrate via React Query with caching/invalidation and per-principal data scoping.

**User-visible outcome:** Users can sign in with Internet Identity, create and manage their own characters, chat in saved 1:1 sessions with locally-generated character replies, customize a session’s scene, and play any session as a cinematic Movie Mode sequence with basic controls.
