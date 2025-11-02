import { getUser } from '@/lib/dal';
import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Gamepad2, Users, BarChart3 } from 'lucide-react';

export default async function LobbyPage() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Fun Friday</h1>
            </div>
            <div className="flex items-center space-x-4">
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
          {/* Trivia Quiz Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  Quiz
                </span>
              </div>
              <CardTitle>Trivia Quiz</CardTitle>
              <CardDescription>
                Test your knowledge with fun trivia questions. Compete with your
                team!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Play Now
              </Button>
            </CardContent>
          </Card>

          {/* Truth or Dare Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  Party
                </span>
              </div>
              <CardTitle>Truth or Dare</CardTitle>
              <CardDescription>
                Choose wisely! Reveal secrets or take on exciting challenges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Play Now
              </Button>
            </CardContent>
          </Card>

          {/* Quick Poll Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Gamepad2 className="h-6 w-6 text-purple-600" />
                </div>
                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                  Vote
                </span>
              </div>
              <CardTitle>Quick Poll</CardTitle>
              <CardDescription>
                Vote on fun questions and see live results from your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Play Now
              </Button>
            </CardContent>
          </Card>
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
    </div>
  );
}
