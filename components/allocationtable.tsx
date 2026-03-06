"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Game {
  id: number;
  home_team: string;
  away_team: string;
  time_slot: string;
  game_date: string;
  field_number: number;
  name_of_tournament: string;
  sport_type: string;
  referees: any[];
}

interface AllocationTableProps {
  games: Game[];
}

export default function AllocationTable({ games }: AllocationTableProps) {
  return (
    <Table>
      <TableCaption>Current referee allocations for all games</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Tournament</TableHead>
          <TableHead>Game</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Field</TableHead>
          <TableHead>Sport</TableHead>
          <TableHead>Referees Allocated</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => {
          const refereeCount = game.referees.length;
          const isFullyAllocated = refereeCount >= 3;

          return (
            <TableRow key={game.id}>
              <TableCell className="font-medium">
                {game.name_of_tournament}
              </TableCell>
              <TableCell>
                {game.home_team} vs {game.away_team}
              </TableCell>
              <TableCell>{game.time_slot}</TableCell>
              <TableCell>{game.field_number}</TableCell>
              <TableCell>
                <Badge variant="outline">{game.sport_type}</Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {game.referees.map((referee, index) => (
                    <div key={index} className="text-sm">
                      {referee.name} ({referee.level})
                      {referee.association && (
                        <span className="text-gray-500 ml-1">
                          - {referee.association.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  ))}
                  {refereeCount === 0 && (
                    <span className="text-gray-500">No referees allocated</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={isFullyAllocated ? "default" : "destructive"}
                >
                  {isFullyAllocated ? "Complete" : `${refereeCount}/3 referees`}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6} className="text-right">
            Total Games: {games.length}
          </TableCell>
          <TableCell>
            Fully Allocated: {games.filter(g => g.referees.length >= 3).length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}