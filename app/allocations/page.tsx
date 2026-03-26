import { getGames, allocateReferees } from "@/app/actions/allocations";
import AllocationTable from "@/components/allocationtable";
import { Button } from "@/components/ui/button";
import { Game } from "@/types/game";

const Allocations = async () => {
  const games: Game[] = await getGames();

  return (
    <section className="flex flex-col justify-center items-center p-4 mb-10 gap-6">
      <h1 className="text-3xl font-bold">Referee Allocations</h1>

      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Tournament Games</h2>

          <form
            action={async (formData) => {
              "use server";
              await allocateReferees(formData);
            }}
          >
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Auto Allocate Referees
            </Button>
          </form>
        </div>

        <AllocationTable games={games} />
      </div>
    </section>
  );
};

export default Allocations;