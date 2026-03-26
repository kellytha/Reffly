import Link from "next/link";
import React from "react";
import {
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

const NavBar = () => {
  return (
    <div className="flex sticky top-0 pl-8 bg-transparent rounded-4xl shadow-lg z-50  md:items-center md:sticky md:top-0 md:left-120 md:w-[430px] ">
      <nav className="flex justify-center items-center font-semibold gap-9 p-2 m-2 md:gap-5   ">
        <Link href="/">Home</Link>
        <Link href="/referees">Referees</Link>
        <Link href="/tournaments">Tournaments</Link>
        <Link href="/allocations">Allocations</Link>
      </nav>
      <div className="ml-auto pr-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
};

export default NavBar;
