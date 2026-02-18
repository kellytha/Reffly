import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const Referees = [
  {
    id: 1,
    name: "John Mokoena",
    rating: 4.7,
    "eCell>": "Senior",
    available: true,
  },
  {
    id: 2,
    name: "Lisa Adams",
    rating: 4.3,
    "eCell>": "Intermediate",
    available: true,
  },
  {
    id: 3,
    name: "Thabo Khumalo",
    rating: 4.9,
    "eCell>": "Elite",
    available: true,
  },
  {
    id: 4,
    name: "Emily Smith",
    rating: 3.8,
    "eCell>": "Junior",
    available: false,
  },
  {
    id: 5,
    name: "Ruben Daniels",
    rating: 4.5,
    "eCell>": "Senior",
    available: true,
  },
  {
    id: 6,
    name: "Kyle Du Preez",
    rating: 3.9,
    "eCell>": "Junior",
    available: true,
  },
];
export const RefereeTable = ({ data }: { data: any[] }) => {
  return (
    <Table>
      <TableCaption>A list of referees</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Games</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Referees.map((referee) => (
          <TableRow key={referee.id}>
            <TableCell className="font-medium">{referee.name}</TableCell>
            <TableCell>0</TableCell>
            <TableCell>{referee.rating}</TableCell>
            <TableCell>{referee.available ? "Yes" : "No"}</TableCell>
            <TableCell>{referee["eCell>"]}</TableCell>
            <TableCell className="text-right">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                View
              </button>
              <button className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Delete
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
