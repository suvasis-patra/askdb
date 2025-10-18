import React from "react";
import Link from "next/link";
import { headers } from "next/headers";

import Logo from "./logo";
import { auth } from "@/lib/auth";
import { Button } from "../ui/button";
import { LogoutBtn } from "./logout-btn";

const Navbar = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/15 border-b border-amber-500">
      <div className="w-[1650px] mx-auto flex justify-between items-center px-8 py-4">
        {/* Left: Logo and Title */}
        <div className="inline-flex items-center gap-3">
          <Logo />
          <h3 className="text-3xl font-bold text-amber-500 tracking-tight">
            Ask<span className="text-white">DB</span>
          </h3>
        </div>

        {/* Right: Nav Links */}
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="text-gray-200 hover:text-amber-400 transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-gray-200 hover:text-amber-400 transition-colors duration-200"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="text-gray-200 hover:text-amber-400 transition-colors duration-200"
          >
            Contact
          </a>
          {session?.user ? (
            <LogoutBtn />
          ) : (
            <Link href={"/signup"}>
              <Button className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-colors duration-200 shadow-md">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
