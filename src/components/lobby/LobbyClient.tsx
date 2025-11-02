'use client';

import { useState } from 'react';
import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameCard } from '@/components/games/GameCard';
import { CreateRoomDialog } from '@/components/games/CreateRoomDialog';
import { JoinRoomDialog } from '@/components/games/JoinRoomDialog';
import { Gamepad2, Users, BarChart3 } from 'lucide-react';
import { GameType } from '@/types';
import { useSocket } from '@/lib/socket/SocketProvider';

interface LobbyClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function LobbyClient({ user }: LobbyClientProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameType>('trivia');
  const { isConnected } = useSocket();

  const handleGameSelect = (gameType: GameType) => {
    setSelectedGame(gameType);
    setCreateDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Fun Friday</h1>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setJoinDialogOpen(true)}>
                Join Room
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <form action={logout}>
                <Button type="submit" variant="outline">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Welcome back, {user?.name}! 🎉
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose a game to start playing with your team
          </p>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <GameCard
            title="Trivia Quiz"
            description="Test your knowledge with fun trivia questions. Compete with your team!"
            icon={BarChart3}
            color="bg-blue-100 text-blue-600"
            badge="Quiz"
            onPlay={() => handleGameSelect('trivia')}
          />
          <GameCard
            title="Truth or Dare"
            description="Choose wisely! Reveal secrets or take on exciting challenges."
            icon={Users}
            color="bg-green-100 text-green-600"
            badge="Party"
            onPlay={() => handleGameSelect('truth-or-dare')}
          />
          <GameCard
            title="Quick Poll"
            description="Vote on fun questions and see live results from your team."
            icon={Gamepad2}
            color="bg-purple-100 text-purple-600"
            badge="Vote"
            onPlay={() => handleGameSelect('poll')}
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Games Played</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Start playing!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">
                Win games to score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">-</p>
              <p className="text-sm text-muted-foreground">Not ranked yet</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <CreateRoomDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        gameType={selectedGame}
        userId={user?.id}
        userName={user?.name || 'Player'}
      />
      <JoinRoomDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        userId={user?.id}
        userName={user?.name || 'Player'}
      />
    </div>
  );
}
