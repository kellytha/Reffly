import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const RefereeTable = ({data}: {data: any[]}) => {
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
        {data.map((referee) => (
          <TableRow key={referee.id}>
            <TableCell>{referee.name}</TableCell>
            <TableCell>{referee.games}</TableCell>
            <TableCell>{referee.rating}</TableCell>
            <TableCell>{referee.is_active ? "Active" : "Inactive"}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
