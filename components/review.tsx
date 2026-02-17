const review = () => {
  return (
    <main>
        <div>
            <h1>Tournament Details</h1>
            <p>Name{tournamentdata.name}</p>
            <p>status{active}</p>
            <p>start Date</p>
            <p>End Date</p>
        </div>
        <div>
            <p>{number of fields}</p>
            <span>field</span>
        </div>
        <div>
            <p>{time_slot}</p>
            <span>time slot</span>
        </div>
        <div>
            <p>{number of games}</p>
            <span>games</span> 
        </div>
        <div>
            <p>{Field}</p>
            {name_of_fields}
        </div>
        <div>
            <p>time slots</p>
            {times}
        </div>
        <div>
            <p>Games</p>
            {games listed here}
        </div>
        
    </main>
  )
}

export default review