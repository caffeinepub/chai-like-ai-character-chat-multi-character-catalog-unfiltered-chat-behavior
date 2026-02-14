import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    text: string;
    sender: Principal;
    timestamp: bigint;
}
export interface Session {
    creator: Principal;
    background?: string;
    messages: Array<Message>;
    character: Character;
    sceneTitle?: string;
}
export interface Character {
    creator: Principal;
    traits: string;
    name: string;
    description: string;
    speakingStyle: string;
    avatar?: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCharacter(name: string, description: string, traits: string, speakingStyle: string, avatar: string | null): Promise<void>;
    getAllCharacters(): Promise<Array<Character>>;
    getAllSessions(): Promise<Array<Session>>;
    getCallerCharacter(): Promise<Character | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSession(sessionId: string): Promise<Session>;
    getSessionMessages(sessionId: string): Promise<Array<Message>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(sessionId: string, text: string): Promise<void>;
    startSession(characterId: Principal, background: string | null, sceneTitle: string | null): Promise<string>;
}
