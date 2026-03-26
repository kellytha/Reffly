import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { getReferees } from "@/app/actions/referees";

const Actions = async () => {
  const referees = await getReferees();

  return (
    <section className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold m-4 text-center">
        Referee Management Dashboard
      </h2>

      <div className="flex gap-4 mb-6">
        <Link href="/referees">
          <Button variant="outline">Manage Referees</Button>
        </Link>
        <Link href="/tournaments">
          <Button variant="outline">Manage Tournaments</Button>
        </Link>
        <Link href="/allocations">
          <Button className="bg-blue-600 hover:bg-blue-700">
            View Allocations
          </Button>
        </Link>
      </div>

      <div>
        <Table>
          <TableCaption>Current Referee Statistics</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Association</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referees.slice(0, 10).map((referee) => (
              <TableRow key={referee.id}>
                <TableCell className="font-medium">{referee.name}</TableCell>
                <TableCell>{referee.level}</TableCell>
                <TableCell>
                  {referee.rating != null
                    ? Number(referee.rating).toFixed(1)
                    : "Not rated"}
                </TableCell>
                <TableCell>{referee.association || "None"}</TableCell>
                <TableCell>{referee.is_active ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/referees#${referee.id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm mr-2">
                      View
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total Active Referees</TableCell>
              <TableCell className="text-right">{referees.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
};

export default Actions;
