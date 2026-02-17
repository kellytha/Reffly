import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <div className="sticky top-0 bottom-0">
      <nav className="flex justify-center items-center font-semibold gap-5 bordered p-2 m-2  rounded-2xl ">
        <Link href="/referees">Referees</Link>
        <Link href="/tournaments">Tournaments</Link>
        <Link href="/">Allocations</Link>
      </nav>
    </div>
  );
};

export default NavBar;
