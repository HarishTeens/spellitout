import Link from "next/link";
import React from "react";
import { Video } from "lucide-react";
export const NavBar = () => {
  return (
    <main className="px-4 lg:px-6 h-16 flex items-center text-gray-100 backdrop-blur-xl">
      <Link className="flex items-center justify-center gap-2" href="#">
        <Video />
        <span className="text-lg lg:text-xl">SpellitOut.</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 ">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-gray-100 lg:text-base"
          href="#"
        >
          Features
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-gray-100 lg:text-base"
          href="#"
        >
          Pricing
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-gray-100 lg:text-base"
          href="#"
        >
          Contact
        </Link>
      </nav>
    </main>
  );
};
