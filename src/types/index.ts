export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Player {
  id: string;
  name: string;
  socketId: string;
  score?: number;
}

export interface GameRoom {
  roomCode: string;
  gameType: GameType;
  host: {
    id: string;
    name: string;
  };
  players: Player[];
  status: 'waiting' | 'active' | 'completed';
  createdAt: Date;
}

export type GameType = 'trivia' | 'truth-or-dare' | 'poll';
