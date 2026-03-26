export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  venue: string;
  // Add other properties as needed, e.g., referees, status, etc.
}