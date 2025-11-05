"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Terminal, Loader2, FileUp, X, GitCompareArrows } from "lucide-react";
import { FiSend } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLanguage } from "@/lib/utils";
import ReactDiffViewer from "react-diff-viewer-continued";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import TreeView from "@/components/TreeView";

interface Message {
  role: "user" | "assistant" | "system";
  content: string | JSX.Element;
}

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedCode, setUploadedCode] = useState<string | null>(null);
  const [aiGeneratedCode, setAiGeneratedCode] = useState<string | null>(null);
  const [isCompareView, setIsCompareView] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [fileInfo, setFileInfo] = useState<{ name: string; language: string } | null>(null);
  const [typingSpeed, setTypingSpeed] = useState(50);
  const [code, setCode] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSaved]);

  useEffect(() => {
    if (code) {
      setIsSaved(false);
    }
  }, [code]);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/save-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_path: "g:\\MANTRIQ 2.0\\main.py", content: code }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSaved(true);
      } else {
        alert(`Error saving file: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("An unexpected error occurred while saving the file.");
    }
  };

  const detectMode = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.startsWith("edit")) return "edit";
    if (lowerText.includes("fix")) return "fix";
    if (lowerText.includes("explain")) return "explain";
    if (lowerText.includes("/explain")) return "explain";
    if (lowerText.includes("/debug")) return "debug";
    if (lowerText.includes("/generate")) return "generate";
    if (lowerText.includes("/optimize")) return "optimize";
    if (lowerText.includes("/review")) return "review";
    return "explain";
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const content = reader.result as string;
      const language = getLanguage(file.name);
      setUploadedCode(content);
      setFileInfo({ name: file.name, language });
      setCode(content);
      setIsFullScreen(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `File uploaded: ${file.name}`,
        },
        {
          role: "system",
          content: (
            <div className="bg-black p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileUp className="w-4 h-4" />
                  <span className="font-semibold">{file.name}</span>
                  <span className="text-xs text-white">({language})</span>
                </div>
              </div>
              <pre className="mt-2 bg-black p-2 rounded-lg overflow-x-auto">
                <code>{content.substring(0, 100)}...</code>
              </pre>
            </div>
          ),
        },
      ]);

      setInput(`Explain the following ${language} code:`);

      try {
        const response = await fetch("/api/read-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_path: file.name }),
        });
        const data = await response.json();
        if (data.content) {
          setCode(data.content);
        }
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    };
    reader.readAsText(file);
  };

  const handleClearFile = () => {
    setUploadedCode(null);
    setFileInfo(null);
    setInput("");
    setCode("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    const mode = detectMode(userInput);
    const cleanedInput = userInput.replace(/\/(explain|debug|generate|optimize|review)\s*/i, "");

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/mantriq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, code: cleanedInput }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsLoading(false);
          if (uploadedCode) {
            setAiGeneratedCode(fullResponse);
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: fullResponse },
            ];
          }
          return prev;
        });
      }
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "ERROR: Failed to process request. Please try again.",
      }]);
      setIsLoading(false);
    }
  };

  const handleSend = handleSubmit;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickCommands = [
    { label: "/explain", desc: "Explain code" },
    { label: "/debug", desc: "Debug code" },
    { label: "/generate", desc: "Generate code" },
    { label: "/optimize", desc: "Optimize code" },
    { label: "/review", desc: "Review code" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-20 flex flex-col h-screen">
        <div className="container mx-auto max-w-full flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Terminal</h2>
            </div>
            {uploadedCode && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-3 py-1 border rounded-md text-sm ${activeTab === "chat" ? "bg-white text-black" : "border-white"}`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("compare")}
                  className={`px-3 py-1 border rounded-md text-sm ${activeTab === "compare" ? "bg-white text-black" : "border-white"}`}
                >
                  Compare
                </button>
              </div>
            )}
          </div>

          {activeTab === "compare" && uploadedCode ? (
            <div className="flex-1 terminal-border overflow-hidden">
              <ReactDiffViewer
                oldValue={uploadedCode}
                newValue={aiGeneratedCode || ""}
                splitView={true}
                leftTitle={fileInfo?.name || "Original Code"}
                rightTitle="AI Generated Code"
                useDarkTheme={true}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col-reverse rounded-lg overflow-hidden">
              {/* Input Area */}
              <form onSubmit={handleSubmit} className="border-t border-white p-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                    className="p-2 hover:bg-black rounded-full"
                  >
                    <FileUp className="w-5 h-5" />
                  </button>
                  {code && (
                    <button
                      type="button"
                      onClick={() => setIsFullScreen(!isFullScreen)}
                      className="p-2 hover:bg-black rounded-full"
                    >
                      <Terminal className="w-5 h-5" />
                    </button>
                  )}
                  <input
                    id="file-upload-input"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <span className="text-gray-400 text-sm">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question or type a command..."
                    className="flex-1 bg-black text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button
                    onClick={handleSend}
                    className="ml-4 bg-white text-black rounded-lg px-6 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <FiSend />
                  </button>
                </div>
              </form>

              {/* Quick Commands Bar & Speed Control */}
              <div className="border-t border-white px-4 py-2 flex justify-between items-center text-xs">
                <div className="flex flex-wrap gap-2">
                  {quickCommands.map((cmd) => (
                    <button
                      key={cmd.label}
                      onClick={() => setInput(cmd.label + " ")}
                      className="px-2 py-1 border border-white hover:bg-white hover:text-black transition-colors"
                      title={cmd.desc}
                    >
                      {cmd.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Messages Area */}
              <div className="overflow-y-auto p-4 space-y-3 font-mono text-sm no-scrollbar">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-pre-wrap"
                  >
                    {message.role === "system" && (
                      <div className="text-white">
                        <span className="text-white">[SYSTEM]</span> {typeof message.content === 'string' ? message.content : <>{message.content}</>}
                      </div>
                    )}
                    {message.role === "user" && (
                      <div>
                        <span className="text-white">$ </span>
                        <span className="text-white">{message.content}</span>
                      </div>
                    )}
                    {message.role === "assistant" && (
                      <div className="text-white ml-2 border-l border-white pl-3">
                        {message.content}
                        {isLoading && index === messages.length - 1 && (
                          <span className="animate-pulse">|</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-white"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI is typing...</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>
      </main>

      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{fileInfo?.name}</h3>
            <button onClick={() => setIsFullScreen(false)} className="p-2 hover:bg-black rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <pre>
              <SyntaxHighlighter language={fileInfo?.language || 'python'} showLineNumbers>
                {code}
              </SyntaxHighlighter>
            </pre>
          </div>
        </div>
      )}


    </div>
  );
}