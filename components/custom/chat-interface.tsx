"use client";

import { FormEvent, useState, useRef, useEffect } from "react";

import remarkGfm from "remark-gfm";
import { motion } from "motion/react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { Check, SendHorizonal, TriangleAlert } from "lucide-react";

import Logo from "./logo";
import { Spinner } from "../ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SpinnerCustom } from "./spinner";

const ChatInterface = ({ userInitial }: { userInitial: string }) => {
  const [input, setInput] = useState("");

  const { messages, sendMessage, error, status } = useChat({
    onError: (err) => console.error(err),

    onToolCall: ({ toolCall: { toolName } }) => {
      console.log("Tool called:", toolName);
    },

    onFinish: () => {
      console.log("response finished!");
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function handleFormSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col items-center h-[100vh] text-gray-100">
      <div
        className={`flex-1 w-full overflow-y-auto px-4 sm:px-6 md:px-0 transition-all duration-500 ${
          isEmpty ? "flex items-center justify-center" : ""
        }`}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl font-bold text-white flex gap-3.5 items-center">
              <Logo />
              Welcome to <span className="text-amber-500">AskDB</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Ask questions about your data in plain English — I’ll turn them
              into insights instantly.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full py-24 space-y-6">
            {messages.map((message, msgIdx) => (
              <div
                key={message.id}
                className={`w-full ${
                  message.role === "user" ? "flex justify-end" : ""
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-xl shadow-md backdrop-blur-md ${
                    message.role === "user"
                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-200 max-w-[80%]"
                      : "bg-black  text-gray-100"
                  }`}
                >
                  <div className="mb-2 font-semibold text-sm opacity-75">
                    {message.role === "user" ? (
                      <Avatar className="bg-black">
                        <AvatarFallback className="bg-black">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarImage src={"./askdb.svg"} />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {message.parts.map((part, i) => {
                    console.log(part.type);
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className="prose prose-invert max-w-none text-gray-100 mt-4"
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                table: (props) => (
                                  <div className="overflow-x-auto my-2">
                                    <table
                                      className="min-w-full border-collapse border border-gray-700"
                                      {...props}
                                    />
                                  </div>
                                ),
                                th: (props) => (
                                  <th
                                    className="border border-gray-700 bg-gray-800 px-3 py-1 text-left"
                                    {...props}
                                  />
                                ),
                                td: (props) => (
                                  <td
                                    className="border border-gray-700 px-3 py-1"
                                    {...props}
                                  />
                                ),
                                code: (props) => (
                                  <code
                                    className="bg-gray-800 px-1.5 py-0.5 rounded text-amber-300 text-sm"
                                    {...props}
                                  />
                                ),
                              }}
                            >
                              {part.text}
                            </ReactMarkdown>
                          </div>
                        );

                      case "tool-queryBuilder":
                        return (
                          <motion.div
                            key={`${message.id}-${i}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-64 bg-gray-800/60 border border-gray-700 rounded-xl px-2 py-0.5 mt-2 text-sm text-gray-200 shadow-md"
                          >
                            {part.state === "output-available" ? (
                              <div className="flex items-center gap-2 text-green-400 my-2">
                                <span className="inline-flex justify-center items-center rounded-sm p-0.5 bg-white">
                                  <Check className="w-4 h-4" />
                                </span>
                                <span className="font-semibold">
                                  query building step completed.
                                </span>
                              </div>
                            ) : part.state === "output-error" ? (
                              <div className="text-red-400 font-semibold">
                                Step failed!
                              </div>
                            ) : (
                              <div>
                                <Spinner w-4 h-4 text-amber-400 animate-spin />
                                <span>Building query....</span>
                              </div>
                            )}
                          </motion.div>
                        );

                      case "tool-db":
                        return (
                          <motion.div
                            key={`${message.id}-${i}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-64 bg-gray-800/60 border border-gray-700 rounded-xl px-2 py-0.5 mt-2 text-sm text-gray-200 shadow-md"
                          >
                            {part.state === "output-available" ? (
                              <div className="flex items-center gap-2 text-green-400 my-2">
                                <span className="inline-flex justify-center items-center rounded-sm p-0.5 bg-white">
                                  <Check className="w-4 h-4" />
                                </span>
                                <span className="font-semibold">
                                  Database query step completed.
                                </span>
                              </div>
                            ) : part.state === "output-error" ? (
                              <div className="text-red-400 font-semibold">
                                Step failed!
                              </div>
                            ) : (
                              <div>
                                <Spinner w-4 h-4 text-amber-400 animate-spin />
                                <span>Querying database....</span>
                              </div>
                            )}
                          </motion.div>
                        );

                      case "reasoning":
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className="italic text-sm text-gray-400 border-l-2 border-gray-600 pl-3 my-2"
                          >
                            💭 {part.text || "Thinking..."}
                          </div>
                        );

                      default:
                        return null;
                    }
                  })}
                </motion.div>
              </div>
            ))}

            {error && (
              <div className="text-center mt-4 p-3 bg-red-900/40 border border-red-700 rounded-xl text-red-300">
                <span className="inline-flex items-center gap-3">
                  <TriangleAlert />
                  Something went wrong. Please try again.
                </span>
              </div>
            )}
            {status === "submitted" && (
              <div className="flex justify-start w-full max-w-3xl mx-auto mt-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl shadow-md bg-black text-gray-400 flex items-center gap-3"
                >
                  <SpinnerCustom />
                  <span>Processing...</span>
                </motion.div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleFormSubmission}
        className={`inline-flex sticky max-w-4xl bottom-0 w-full backdrop-blur-lg px-4 py-4 transition-all duration-500 ${
          isEmpty ? "absolute bottom-[38%]" : ""
        }`}
      >
        <div className="w-3xl min-w-2xl mx-auto relative">
          <input
            className="w-full px-4 py-3 pr-12 bg-gray-900/70 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 backdrop-blur-md shadow-lg transition-all duration-300"
            value={input}
            placeholder="Ask something about your data..."
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-gray-800/70 transition-all duration-200"
          >
            <SendHorizonal className="w-5 h-5 -rotate-45" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
