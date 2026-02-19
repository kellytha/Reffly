export default function TournamentCard({
  name_of_tournament,
  sport,
  home_team,
  away_team,
  referees,
}: {
  name_of_tournament: string;
  sport: string;
  home_team: string;
  away_team: string;
  referees: number;
}) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md md:max-w-lg border border-gray-200">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{name_of_tournament}</h2>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Sport:</span>
          <span>{sport}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="font-medium">Home Team:</span>
          <span>{home_team}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="font-medium">Away Team:</span>
          <span>{away_team}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="font-medium">Referees:</span>
          <span>{referees}</span>
        </div>
      </div>

      <button className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        Edit Tournament
      </button>
    </div>
  );
}
