import * as React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getReferees } from "@/app/actions/referees";

export const RefereeTable = ({ data }: { data?: any[] }) => {
  const [refs, setRefs] = React.useState<any[]>(data || []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await getReferees();
        if (mounted && Array.isArray(result)) setRefs(result);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
        {refs.map((referee) => (
          <TableRow key={referee.id}>
            <TableCell className="font-medium">{referee.name}</TableCell>
            <TableCell>{referee.game_count ?? 0}</TableCell>
            <TableCell>{referee.rating}</TableCell>
            <TableCell>{referee.is_active ? "Active" : "Inactive"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
