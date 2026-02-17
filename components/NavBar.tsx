import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <div className="flex sticky top-0 pl-8 bg-transparent rounded-4xl shadow-lg z-50  md:items-center md:sticky md:top-0 md:left-[120px] md:w-[430px] ">
      <nav className="flex justify-center items-center font-semibold gap-9 p-2 m-2 md:gap-5   ">
        <Link href="/">Home</Link>
        <Link href="/referees">Referees</Link>
        <Link href="/tournaments">Tournaments</Link>
        <Link href="/">Allocations</Link>
      </nav>
    </div>
  );
};

export default NavBar;
