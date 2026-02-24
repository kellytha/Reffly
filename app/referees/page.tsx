import  { RefereeForm } from "@/components/refereeform";
import { getReferees } from "@/app/actions/referees";
import RefereeCard from "@/components/refereecard";

const referees = async () => {
  const referees = await getReferees();
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-bold">Referees</h1>
        <RefereeForm />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      {referees.map((ref) => (
        <RefereeCard
          key={ref.id}
          id={ref.id}
          name={ref.name}
          phone_number={ref.phone_number}
        />
      ))}
    </div>
    </div>
  )
}

export default referees