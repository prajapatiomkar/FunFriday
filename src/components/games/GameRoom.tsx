'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/lib/socket/SocketProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, UserCircle, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Player } from '@/types';

interface GameRoomProps {
  roomCode: string;
  userId: string;
  userName: string;
}

export default function GameRoom({
  roomCode,
  userId,
  userName,
}: GameRoomProps) {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [hostId, setHostId] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<
    'waiting' | 'active' | 'completed'
  >('waiting');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('Requesting room state for:', roomCode);

    // Request current room state when component mounts
    socket.emit('getRoomState', { roomCode });

    // Listen for room state (initial state)
    socket.on('roomState', (roomData) => {
      console.log('Received room state:', roomData);
      setPlayers(roomData.players);
      setHostId(roomData.host.id);
      setGameStatus(roomData.status);
      setIsLoading(false);
    });

    // Listen for room created event (for host)
    socket.on('roomCreated', (roomData) => {
      console.log('Room created:', roomData);
      setPlayers(roomData.players);
      setHostId(roomData.host.id);
      setIsLoading(false);
    });

    // Listen for player joined event
    socket.on('playerJoined', (playerData) => {
      console.log('Player joined:', playerData);
      setPlayers((prev) => [...prev, playerData]);
    });

    // Listen for player left event
    socket.on('playerLeft', ({ id, name }) => {
      console.log('Player left:', name);
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    });

    // Listen for game started event
    socket.on('gameStarted', () => {
      console.log('Game started');
      setGameStatus('active');
      // TODO: Navigate to actual game interface
    });

    // Listen for errors
    socket.on('error', ({ message }) => {
      console.error('Socket error:', message);
      alert(message);
      router.push('/lobby');
    });

    return () => {
      socket.off('roomState');
      socket.off('roomCreated');
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('gameStarted');
      socket.off('error');
    };
  }, [socket, isConnected, roomCode, router]);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    if (!socket) return;
    console.log('Starting game in room:', roomCode);
    socket.emit('startGame', { roomCode });
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('leaveRoom', { roomCode, userId, userName });
    }
    router.push('/lobby');
  };

  const isHost = hostId === userId;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Game Room</h1>
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            {isHost && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center">
                <Crown className="h-4 w-4 mr-1" />
                You are the host
              </span>
            )}
          </div>
        </div>

        {/* Room Code Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Room Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-primary/10 px-6 py-3">
                  <span className="text-3xl font-bold text-primary">
                    {roomCode}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share this code with your teammates
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyRoomCode}>
                <Copy className="mr-2 h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Players Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Players ({players.length}/10)</CardTitle>
          </CardHeader>
          <CardContent>
            {players.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Waiting for players to join...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center space-x-3 rounded-lg border p-3 ${
                      player.id === userId ? 'bg-primary/5 border-primary' : ''
                    }`}
                  >
                    <UserCircle className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {player.name} {player.id === userId && '(You)'}
                      </p>
                      {player.id === hostId && (
                        <div className="flex items-center space-x-1 text-xs text-yellow-600">
                          <Crown className="h-3 w-3" />
                          <span>Host</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Status */}
        {gameStatus === 'waiting' && (
          <Card className="mb-8">
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">
                  {isHost
                    ? 'Waiting for players to join. Start the game when ready!'
                    : 'Waiting for the host to start the game...'}
                </p>
                <div className="flex justify-center space-x-4">
                  {isHost && (
                    <Button
                      size="lg"
                      onClick={handleStartGame}
                      disabled={players.length < 1}
                    >
                      Start Game ({players.length}{' '}
                      {players.length === 1 ? 'player' : 'players'})
                    </Button>
                  )}
                  <Button size="lg" variant="outline" onClick={handleLeaveRoom}>
                    Leave Room
                  </Button>
                </div>

                {/* Debug Info */}
                <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left">
                  <p>
                    <strong>Debug Info:</strong>
                  </p>
                  <p>Your ID: {userId}</p>
                  <p>Host ID: {hostId}</p>
                  <p>Is Host: {isHost ? 'Yes' : 'No'}</p>
                  <p>Players: {players.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {gameStatus === 'active' && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Game Starting...</h2>
                <p className="text-muted-foreground">Get ready to play!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
