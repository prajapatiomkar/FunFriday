import { getUser } from '@/lib/dal';
import GameRoom from '@/components/games/GameRoom';
import { use } from 'react';

interface PageProps {
  params: Promise<{
    roomCode: string;
  }>;
}

export default function GameRoomPage({ params }: PageProps) {
  // Unwrap the params promise using React's use hook
  const { roomCode } = use(params);

  // This will be executed on the server
  const userPromise = getUser();

  return <GameRoomLoader roomCode={roomCode} userPromise={userPromise} />;
}

async function GameRoomLoader({
  roomCode,
  userPromise,
}: {
  roomCode: string;
  userPromise: Promise<any>;
}) {
  const user = await userPromise;

  if (!user) {
    return null;
  }

  return (
    <GameRoom
      roomCode={roomCode.toUpperCase()}
      userId={user.id}
      userName={user.name || 'Player'}
    />
  );
}
