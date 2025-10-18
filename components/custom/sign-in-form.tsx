"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Lock, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { ZSignin } from "../../lib/validation/user";

export function SigninForm() {
  const form = useForm<z.infer<typeof ZSignin>>({
    resolver: zodResolver(ZSignin),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const [authError, setAuthError] = useState<null | string>(null);
  const [infoMessage, _setInfoMessage] = useState<null | string>(null);
  async function onSubmit(data: z.infer<typeof ZSignin>) {
    console.log(data);
    const { email, password } = data;
    try {
      setAuthError(null);
      await authClient.signIn.email(
        { email, password, callbackURL: "/chat" },
        {
          onError: (context) => {
            console.log("ERROR :", context.error.message);
            if (context.error.status === 403) {
              setAuthError("Please verify your email");
              return;
            }
            if (context.error.status === 401) {
              setAuthError("Invalid credentials!");
              return;
            }
            setAuthError(
              context.error.message || "Something went wrong. Try again!"
            );
          },
          onSuccess: (context) => {
            console.log(context.data);
            router.push("/chat");
          },
        }
      );
    } catch (error) {
      setAuthError("Something went wrong");
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
              AskDB Signin
            </h1>
            <p className="text-gray-600 mt-4 max-w-sm mx-auto">
              Welcome back! Sign in to AskDB and continue exploring insights
              from your company’s data — powered by AI.
            </p>
          </div>

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
                    disabled={form.formState.isSubmitting}
                    type="password"
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
                signing in...
              </span>
            ) : (
              "Click to signin"
            )}
          </Button>
          {authError ? (
            <ShowMessage type="error" message={authError} />
          ) : infoMessage ? (
            <ShowMessage type="info" message={infoMessage} />
          ) : null}
          <p className="text-center text-white">
            New here{" "}
            <Link href={"/signup"} className="underline text-amber-500">
              signup
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
