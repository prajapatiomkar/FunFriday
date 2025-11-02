'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  badge: string;
  onPlay: () => void;
}

export function GameCard({
  title,
  description,
  icon: Icon,
  color,
  badge,
  onPlay,
}: GameCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className={`p-3 ${color} rounded-lg`}>
            <Icon className="h-6 w-6" />
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${color.replace('bg-', 'bg-').replace('100', '50')} ${color.replace('bg-', 'text-').replace('100', '700')}`}
          >
            {badge}
          </span>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={onPlay}>
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
}
