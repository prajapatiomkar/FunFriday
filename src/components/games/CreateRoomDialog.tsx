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
import { GameType } from '@/types';

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameType: GameType;
  userId: string;
  userName: string;
}

export function CreateRoomDialog({
  open,
  onOpenChange,
  gameType,
  userId,
  userName,
}: CreateRoomDialogProps) {
  const { socket } = useSocket();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = () => {
    if (!socket) {
      setError('Not connected to server');
      return;
    }

    setIsCreating(true);
    setError('');

    // Emit create room event
    socket.emit('createRoom', { gameType, userId, userName });

    // Listen for room created
    const handleRoomCreated = (roomData: any) => {
      console.log('Room created successfully:', roomData);
      setIsCreating(false);
      onOpenChange(false);

      // Clean up listener
      socket.off('roomCreated', handleRoomCreated);
      socket.off('error', handleError);

      // Navigate to room
      router.push(`/game/${roomData.roomCode}`);
    };

    // Listen for errors
    const handleError = ({ message }: { message: string }) => {
      console.error('Create room error:', message);
      setError(message);
      setIsCreating(false);

      // Clean up listeners
      socket.off('roomCreated', handleRoomCreated);
      socket.off('error', handleError);
    };

    // Set up one-time listeners
    socket.once('roomCreated', handleRoomCreated);
    socket.once('error', handleError);

    // Timeout after 5 seconds
    setTimeout(() => {
      if (isCreating) {
        setError('Connection timeout. Please try again.');
        setIsCreating(false);
        socket.off('roomCreated', handleRoomCreated);
        socket.off('error', handleError);
      }
    }, 5000);
  };

  const handleDialogChange = (newOpen: boolean) => {
    if (!isCreating) {
      setError('');
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Game Room</DialogTitle>
          <DialogDescription>
            Create a new room for {gameType} game. Share the room code with your
            teammates!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Game Type</Label>
            <Input value={gameType} disabled />
          </div>
          <div className="space-y-2">
            <Label>Host</Label>
            <Input value={userName} disabled />
          </div>
          {error && (
            <div className="rounded-md bg-destructive/15 p-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => handleDialogChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} disabled={isCreating}>
            {isCreating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </>
            ) : (
              'Create Room'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
