"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { MessageSquare, BarChart3, Settings, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { LogoutBtn } from "./logout-btn";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 72 }}
      transition={{ duration: 0.3 }}
      className="h-screen fixed left-0 top-0 bg-[#0a0a0a] border-r border-gray-800 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Section */}
      <div>
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Image src="/askdb.svg" alt="askdb" height={40} width={40} />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-amber-400 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center ${
                isOpen ? "justify-start px-4" : "justify-center px-0"
              } gap-3 py-3 text-gray-400 hover:bg-gray-800/70 hover:text-amber-400 rounded-lg mx-2 transition-all duration-200`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div
        className={`border-t border-gray-800 px-4 py-4 flex items-center ${
          isOpen ? "justify-between gap-3" : "justify-center"
        } transition-all duration-300`}
      >
        {isOpen ? (
          <>
            <div className="flex items-center gap-3">
              <div>
                <LogoutBtn />
              </div>
            </div>
          </>
        ) : (
          // Collapsed view: just the avatar (centered)
          <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-amber-400 font-semibold">
            U
          </div>
        )}
      </div>
    </motion.aside>
  );
}
