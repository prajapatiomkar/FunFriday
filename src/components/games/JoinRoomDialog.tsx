'use client';

import { useState } from 'react';
import { useSocket } from '@/lib/socket/SocketProvider';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

export function JoinRoomDialog({
  open,
  onOpenChange,
  userId,
  userName,
}: JoinRoomDialogProps) {
  const { socket } = useSocket();
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoinRoom = () => {
    if (!socket || !roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsJoining(true);
    setError('');

    const upperRoomCode = roomCode.toUpperCase();

    // Emit join room event
    socket.emit('joinRoom', { roomCode: upperRoomCode, userId, userName });

    // Listen for successful join (roomState event)
    const handleRoomState = () => {
      console.log('Successfully joined room');
      setIsJoining(false);
      setRoomCode('');
      onOpenChange(false);

      // Clean up listeners
      socket.off('roomState', handleRoomState);
      socket.off('error', handleError);

      // Navigate to room
      router.push(`/game/${upperRoomCode}`);
    };

    // Listen for errors
    const handleError = ({ message }: { message: string }) => {
      console.error('Join room error:', message);
      setError(message);
      setIsJoining(false);

      // Clean up listeners
      socket.off('roomState', handleRoomState);
      socket.off('error', handleError);
    };

    // Set up one-time listeners
    socket.once('roomState', handleRoomState);
    socket.once('error', handleError);

    // Timeout after 5 seconds
    setTimeout(() => {
      if (isJoining) {
        setError('Connection timeout. Please try again.');
        setIsJoining(false);
        socket.off('roomState', handleRoomState);
        socket.off('error', handleError);
      }
    }, 5000);
  };

  const handleDialogChange = (newOpen: boolean) => {
    if (!isJoining) {
      setRoomCode('');
      setError('');
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Game Room</DialogTitle>
          <DialogDescription>
            Enter the room code shared by your teammate to join the game.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="roomCode">Room Code</Label>
            <Input
              id="roomCode"
              placeholder="ABC123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              disabled={isJoining}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && roomCode.trim()) {
                  handleJoinRoom();
                }
              }}
            />
            {error && (
              <div className="rounded-md bg-destructive/15 p-2">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => handleDialogChange(false)}
            disabled={isJoining}
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoinRoom}
            disabled={isJoining || !roomCode.trim()}
          >
            {isJoining ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Joining...
              </>
            ) : (
              'Join Room'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
