
const Stats = () => {
  return (
    <section className="flex justify-center items-center flex-col text-center min-h-screen bg-gradient-to-r from-black to-gray-300 drop-shadow-sm">
        <p className="text-black  text-2xl font-semibold"> Here's your dashboard overview.</p>
        <div className="flex justify-center m-5  ">
            <div className="flex flex-col justify-center items-center ">
                <div className="flex flex-grid shadow-2xl p-6 rounded-lg bg-white flex justify-between w-[350px] l-[225] ">
                    <h5 className="text-gray-400  text-lg">
                        Referees
                    </h5>
                    <p>
                        0
                    </p>
                    </div>
                <div className="flex flex-grid shadow-2xl p-6 rounded-lg bg-white flex justify-between m-5 w-[350px] l-[225] ">
                    <h5>
                        Tornament/league Games
                    </h5>
                    <p>
                        0
                    </p>
                </div>
                <div className="flex flex-grid shadow-2xl p-6 rounded-lg bg-white flex justify-between w-[350px] l-[225] ">
                    <h5>
                        Allocations
                    </h5>
                    <p>
                        0
                    </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Stats