import TournamentForm from "@/components/tournamentform";
import TournamentCard from "@/components/tournamentcard";
import { getTournaments } from "@/app/actions/tournament";


const Tournament = async () => {
  const tournaments = await getTournaments();

  return (
    <section className="flex flex-col justify-center items-center p-4 mb-10 gap-6">
      <TournamentForm />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {tournaments.map((t: any) => (
          <TournamentCard
            key={t.id}
            name_of_tournament={t.name_of_tournament}
            sport={t.sport}
            home_team={t.home_team}
            away_team={t.away_team}
            referees={Number(t.referees)}
          />
        ))}
      </div>
    </section>
  );
};

export default Tournament;
