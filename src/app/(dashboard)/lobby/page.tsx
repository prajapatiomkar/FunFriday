import { getUser } from '@/lib/dal';
import LobbyClient from '@/components/lobby/LobbyClient';

export default async function LobbyPage() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return <LobbyClient user={user} />;
}
