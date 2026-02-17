import Link from "next/link";
import { Button } from "@/components/ui/button"

const Hero = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center drop-shadow-sm p-20 min-h-screen bg-[url('/Hero.png')] bg-cover bg-center">
        <h1 className="text-5xl font-bold text-white">Welcome</h1>
        <p className="text-white text-lg font-semibold">Ready to manage your referees and tournaments/leagues?</p>
        <Button><Link href="/tournaments">Let's Get Started</Link></Button>
    </section>
  )
}

export default Hero