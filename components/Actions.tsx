import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
const Referees = [
  { "id": 1, "name": "John Mokoena", "rating": 4.7, "eCell>": "Senior", "available": true },
  { "id": 2, "name": "Lisa Adams", "rating": 4.3, "eCell>": "Intermediate", "available": true },
  { "id": 3, "name": "Thabo Khumalo", "rating": 4.9, "eCell>": "Elite", "available": true },
  { "id": 4, "name": "Emily Smith", "rating": 3.8, "eCell>": "Junior", "available": false },
  { "id": 5, "name": "Ruben Daniels", "rating": 4.5, "eCell>": "Senior", "available": true },
  { "id": 6, "name": "Kyle Du Preez", "rating": 3.9, "eCell>": "Junior", "available": true }
]

const Actions = () => {
  return (
    <section className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold m-4 text-center ">
          Preview Allocations
        </h2>
        <div>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[650px]">Name of Referee</TableHead>
                    <TableHead>Number of Games</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead >Available</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right w-[150px]">Action</TableHead>
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
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">View</button>
                            <button className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete</button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                    <TableCell colSpan={3}></TableCell>
                    <TableCell className="text-right"></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
      </section>
  )
}

export default Actions