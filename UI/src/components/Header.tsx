"use client";

import Link from "next/link";
import { Code } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <Code className="w-8 h-8" />
          MANTRIQ
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link href="/" className="text-white hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="text-white hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/about" className="text-white hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-white transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}