import { SocketProvider } from '@/lib/socket/SocketProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocketProvider>{children}</SocketProvider>;
}
