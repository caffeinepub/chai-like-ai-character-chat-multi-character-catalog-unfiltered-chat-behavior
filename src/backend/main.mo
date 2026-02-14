import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type UserProfile = {
    name : Text;
  };

  public type Character = {
    creator : Principal;
    name : Text;
    description : Text;
    traits : Text;
    speakingStyle : Text;
    avatar : ?Text;
  };

  public type Message = {
    sender : Principal;
    text : Text;
    timestamp : Int;
  };

  public type Session = {
    creator : Principal;
    character : Character;
    background : ?Text;
    sceneTitle : ?Text;
    messages : [Message];
  };

  module Character {
    public func compare(char1 : Character, char2 : Character) : Order.Order {
      Text.compare(char1.name, char2.name);
    };
  };

  module Message {
    public func compareByTime(msg1 : Message, msg2 : Message) : Order.Order {
      Int.compare(msg1.timestamp, msg2.timestamp);
    };
  };

  module Session {
    public func compare(session1 : Session, session2 : Session) : Order.Order {
      Text.compare(session1.character.name, session2.character.name);
    };
  };

  type SessionInternal = {
    creator : Principal;
    character : Character;
    background : ?Text;
    sceneTitle : ?Text;
    messages : List.List<Message>;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let characters = Map.empty<Principal, Character>();
  let sessions = Map.empty<Text, SessionInternal>();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Character Management
  public query ({ caller }) func getCallerCharacter() : async ?Character {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access characters");
    };
    characters.get(caller);
  };

  public shared ({ caller }) func createCharacter(
    name : Text,
    description : Text,
    traits : Text,
    speakingStyle : Text,
    avatar : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create characters");
    };
    let character : Character = {
      creator = caller;
      name;
      description;
      traits;
      speakingStyle;
      avatar;
    };
    characters.add(caller, character);
  };

  public query ({ caller }) func getAllCharacters() : async [Character] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view characters");
    };
    characters.values().toArray().sort();
  };

  // Session Management
  public shared ({ caller }) func startSession(
    characterId : Principal,
    background : ?Text,
    sceneTitle : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start sessions");
    };
    let character = switch (characters.get(characterId)) {
      case (null) { Runtime.trap("Character does not exist") };
      case (?char) { char };
    };

    let sessionId = caller.toText() # ":" # character.name # ":" # Time.now().toText();
    let session : SessionInternal = {
      creator = caller;
      character;
      background;
      sceneTitle;
      messages = List.empty<Message>();
    };
    sessions.add(sessionId, session);
    sessionId;
  };

  public shared ({ caller }) func sendMessage(sessionId : Text, text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let session = switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?session) { session };
    };
    if (session.creator != caller) {
      Runtime.trap("Unauthorized: Can only send messages to your own sessions");
    };
    let message : Message = {
      sender = caller;
      text;
      timestamp = Time.now();
    };
    session.messages.add(message);
  };

  public query ({ caller }) func getSessionMessages(sessionId : Text) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    let session = switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?session) { session };
    };
    if (session.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own session messages");
    };
    session.messages.toArray().sort(Message.compareByTime);
  };

  public query ({ caller }) func getAllSessions() : async [Session] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };
    let allSessions = sessions.values().toArray().map(func(sessionInternal) { fromSessionInternal(sessionInternal) });
    if (AccessControl.isAdmin(accessControlState, caller)) {
      allSessions;
    } else {
      let filteredSessions = allSessions.filter(func(session : Session) : Bool { session.creator == caller });
      filteredSessions;
    };
  };

  public query ({ caller }) func getSession(sessionId : Text) : async Session {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };
    let session = switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?session) { session };
    };
    if (session.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own sessions");
    };
    fromSessionInternal(session);
  };

  // Helper function to convert internal Session to public Session
  func fromSessionInternal(internal : SessionInternal) : Session {
    {
      creator = internal.creator;
      character = internal.character;
      background = internal.background;
      sceneTitle = internal.sceneTitle;
      messages = internal.messages.toArray();
    };
  };
};
