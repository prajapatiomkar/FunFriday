export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface GameRoom {
  id: string;
  roomCode: string;
  gameType: string;
  hostId: string;
  players: User[];
  status: 'waiting' | 'active' | 'completed';
}

export interface GameState {
  currentQuestion?: number;
  scores: Record<string, number>;
  players: User[];
}

export type GameType = 'trivia' | 'truth-or-dare' | 'poll';
