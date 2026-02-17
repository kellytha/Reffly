import  { RefereeForm } from "@/components/refereeform";
import {  RefereeTable } from "@/components/refereetable";

const referees = () => {
  return (
    <div>page
      <h1>Referees</h1>
        <RefereeForm />
        <RefereeTable data={[]} />
    </div>
  )
}

export default referees