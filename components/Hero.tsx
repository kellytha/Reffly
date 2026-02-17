import Image from "next/image"

const Hero = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center drop-shadow-sm p-20  min-h-screen bg-[url('/Hero.png')] bg-cover bg-center">
        <h1 className="text-5xl font-bold">Welcome</h1>
        <p className="text-black  text-lg font-semibold">Ready to manage your referees and tournaments/leagues?</p>
    </section>
  )
}

export default Hero