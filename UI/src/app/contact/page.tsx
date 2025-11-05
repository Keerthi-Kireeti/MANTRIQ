"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Terminal, Send, Loader2, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const socialLinks = [
    { name: "GitHub", url: "https://github.com" },
    { name: "Twitter", url: "https://twitter.com" },
    { name: "LinkedIn", url: "https://linkedin.com" },
    { name: "Email", url: "mailto:contact@mantriq.ai" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="terminal-border p-8 mb-8"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-white pb-4">
              <Terminal className="w-5 h-5" />
              <span className="text-sm">CONTACT INTERFACE</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">$</span> contact --help
              </p>
              <p className="text-gray-400 ml-4">
                Have questions, feedback, or want to collaborate? Send us a message below.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="terminal-border p-6"
            >
              <div className="mb-6 border-b border-white pb-4">
                <span className="text-sm">MESSAGE FORM</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs mb-2 text-gray-400">NAME</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white focus:text-black"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-2 text-gray-400">EMAIL</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white focus:text-black"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-2 text-gray-400">SUBJECT</label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white focus:text-black"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-2 text-gray-400">MESSAGE</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-black border border-white px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:bg-white focus:text-black"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 border border-white hover:bg-white hover:text-black transition-colors text-sm font-bold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SENDING...
                    </span>
                  ) : submitted ? (
                    "[MESSAGE SENT]"
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      SEND MESSAGE
                    </span>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Social Links */}
              <div className="terminal-border p-6">
                <div className="mb-6 border-b border-white pb-4">
                  <span className="text-sm">SOCIAL LINKS</span>
                </div>
                <div className="space-y-3">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-2 text-sm hover:bg-white hover:text-black p-2 transition-colors border border-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span className="font-mono">{link.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="terminal-border p-6">
                <div className="mb-6 border-b border-white pb-4">
                  <span className="text-sm">INFORMATION</span>
                </div>
                <div className="space-y-4 text-xs">
                  <div>
                    <p className="font-bold mb-1">RESPONSE TIME</p>
                    <p className="text-gray-400">24-48 hours on business days</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">SUPPORT HOURS</p>
                    <p className="text-gray-400">Mon-Fri: 9:00 AM - 6:00 PM (EST)</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">LOCATION</p>
                    <p className="text-gray-400">Remote-first, worldwide</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}