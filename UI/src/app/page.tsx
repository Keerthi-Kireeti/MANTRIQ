"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const commands = [
    { cmd: "explain", desc: "Explain code snippets in plain language" },
    { cmd: "debug", desc: "Identify and fix bugs" },
    { cmd: "generate", desc: "Generate code from descriptions" },
    { cmd: "optimize", desc: "Improve performance" },
    { cmd: "review", desc: "Code reviews and security checks" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Terminal Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="terminal-border p-8"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-white pb-4">
              <Terminal className="w-5 h-5" />
              <span className="text-sm">MANTRIQ 2.0 - AI Code Assistant</span>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="mb-2 text-sm">
                <span className="text-gray-400">$</span> mantriq --version
              </p>
              <p className="mb-6 text-sm text-gray-400">MANTRIQ 2.0.0</p>
              
              <p className="mb-2 text-sm">
                <span className="text-gray-400">$</span> mantriq --info
              </p>
              <p className="mb-6 text-sm text-gray-400">
                Your AI Companion for Every Line of Code
              </p>
              
              <p className="mb-2 text-sm">
                <span className="text-gray-400">$</span> mantriq --capabilities
              </p>
              <div className="text-sm text-gray-400 space-y-1 mb-8">
                {commands.map((cmd, index) => (
                  <motion.div
                    key={cmd.cmd}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <ChevronRight className="w-4 h-4 mt-0.5" />
                    <span>
                      <span className="text-white">{cmd.cmd}</span> - {cmd.desc}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <p className="mb-2 text-sm cursor-blink">
                <span className="text-gray-400">$</span> mantriq --start
              </p>
              
              <Link
                href="/dashboard"
                className="inline-block mt-4 px-6 py-2 border border-white hover:bg-white hover:text-black transition-colors text-sm"
              >
                [ENTER DASHBOARD]
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Commands Reference Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="terminal-border p-8">
            <div className="mb-6 border-b border-white pb-4">
              <span className="text-sm">AVAILABLE COMMANDS</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {commands.map((cmd, index) => (
                <motion.div
                  key={cmd.cmd}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-white p-4 hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  <p className="text-sm mb-2">
                    <span className="font-bold">$ {cmd.cmd}</span>
                  </p>
                  <p className="text-xs opacity-70">{cmd.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="terminal-border p-12 text-center"
          >
            <p className="text-sm mb-2">
              <span className="text-gray-400">$</span> mantriq --join
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Join thousands of developers using MANTRIQ 2.0
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 border border-white hover:bg-white hover:text-black transition-colors text-sm"
            >
              [GET STARTED]
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}