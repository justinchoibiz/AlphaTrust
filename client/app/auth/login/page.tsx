"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginWithTestAccount } from "@/lib/api/mock-api";
import { routes } from "@/lib/constants/routes";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("testtest");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await loginWithTestAccount(email, password);
      toast.success("Login success");
      router.push(routes.home);
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-50">
      <Card className="w-full max-w-md border-neutral-800 bg-neutral-900 text-neutral-50">
        <CardHeader>
          <CardTitle className="text-2xl">AlphaTrust</CardTitle>
          <CardDescription className="text-neutral-400">
            AFML-style diagnostic report for alpha expressions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Email</label>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="border-neutral-700 bg-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border-neutral-700 bg-neutral-950"
              />
            </div>

            <Button className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-4 text-xs text-neutral-500">
            Demo account: test@test.com / testtest
          </p>
        </CardContent>
      </Card>
    </main>
  );
}