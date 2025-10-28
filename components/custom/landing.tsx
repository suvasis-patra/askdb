"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { data } = authClient.useSession();
  const router = useRouter();

  const handleStart = () => {
    if (!data) router.push("/signup");
    else router.push("/chat");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-gray-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center"
      >
        <h1 className="text-5xl inline-flex gap-3 items-center font-bold tracking-tight sm:text-6xl mb-4 text-amber-600">
          <Image src="/askdb.svg" alt="askdb" height={40} width={40} />
          AskDB
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Query your database using plain English. Let AI turn your questions
          into SQL instantly.
        </p>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handleStart}
            className="rounded-xl bg-amber-500 text-white px-6 py-3 text-sm font-semibold shadow hover:bg-amber-600 transition cursor-pointer"
          >
            Get Started
            <ArrowRight />
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-xl border border-amber-300 text-amber-700 px-6 py-3 text-sm font-semibold hover:bg-amber-100 transition"
          >
            <span>
              <a
                href="https://github.com/suvasis-patra/askdb"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
              <Image
                src={"github-icon.svg"}
                alt="github"
                height={30}
                width={30}
              />
            </span>
          </Button>
        </div>
      </motion.div>

      <footer className="absolute bottom-6 text-gray-400 text-sm">
        © {new Date().getFullYear()} AskDB. All rights reserved.
      </footer>
    </main>
  );
}
