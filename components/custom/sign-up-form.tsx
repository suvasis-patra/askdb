"use client";

import Link from "next/link";
import { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, MailCheck, User } from "lucide-react";

import Logo from "./logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ShowMessage from "./message";
import { Spinner } from "../ui/spinner";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ZSignup } from "../../lib/validation/user";

export function SignupForm() {
  const form = useForm<z.infer<typeof ZSignup>>({
    resolver: zodResolver(ZSignup),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [authError, setAuthError] = useState<null | string>(null);
  const [infoMessage, setInfoMessage] = useState<null | string>(null);
  const [isEmailVerificationRequired, setIsEmailVerificationRequired] =
    useState(false);
  async function onSubmit(data: z.infer<typeof ZSignup>) {
    console.log("Register data:", data);
    const { email, name, password } = data;
    try {
      setAuthError(null);
      setInfoMessage(null);
      await authClient.signUp.email(
        {
          name,
          email,
          password,
          callbackURL: "/chat",
        },
        {
          onError: (context) => {
            console.log("ERROR :", context.error.message);
            setAuthError(
              context.error.message || "Something went wrong. Try again!"
            );
          },
          onSuccess: () => {
            setInfoMessage("Verify your email to continue...");
            setIsEmailVerificationRequired(true);
          },
        }
      );
    } catch (error) {
      setAuthError("Something went wrong!");
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex justify-center"
      >
        <div className="w-full max-w-[500px] space-y-6 bg-black/60 p-8 rounded-2xl shadow-lg border border-amber-500">
          <div className="space-y-2 mb-4 text-center">
            <h1 className="text-3xl font-bold text-amber-400 tracking-tight flex items-center gap-2 justify-center">
              <Logo />
              AskDB Signup
            </h1>
            <p className="text-gray-600 mt-4">
              Create your account to start asking questions about your
              company&apos;s database — powered by AI.
            </p>
          </div>
          {isEmailVerificationRequired ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center">
              <MailCheck size={64} className="text-amber-400" />
              <h2 className="text-2xl font-semibold text-white">
                Check your inbox
              </h2>
              <p className="text-gray-400 text-sm max-w-[380px]">
                We&apos;ve sent a verification link to your email. Please verify
                your address to activate your AskDB account.
              </p>
              <ShowMessage
                type="info"
                message="Once verified, you can sign in to start exploring your database with AskDB."
              />
              <Link
                href="/signin"
                className="text-amber-500 underline hover:text-amber-400 transition"
              >
                Go to Signin
              </Link>
            </div>
          ) : (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg font-semibold text-amber-400">
                      <User size={16} />
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name..."
                        {...field}
                        disabled={form.formState.isSubmitting}
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg font-semibold text-amber-400">
                      <Mail size={16} />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a valid email..."
                        {...field}
                        type="email"
                        disabled={form.formState.isSubmitting}
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg font-semibold text-amber-400">
                      <Lock size={16} />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        {...field}
                        type="password"
                        disabled={form.formState.isSubmitting}
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-500 cursor-pointer"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Spinner className="text-amber-200" />
                    signing up...
                  </span>
                ) : (
                  "Click to signup"
                )}
              </Button>
              {authError ? (
                <ShowMessage type="error" message={authError} />
              ) : infoMessage ? (
                <ShowMessage type="info" message={infoMessage} />
              ) : null}
              <p className="text-center text-white">
                Already have an account{" "}
                <Link href={"/signin"} className="underline text-amber-500">
                  signin
                </Link>
              </p>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
