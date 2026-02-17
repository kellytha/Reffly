import Image from "next/image";
import  Link  from "next/link";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Actions from "@/components/Actions";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Actions />
    </main>
  );
}
