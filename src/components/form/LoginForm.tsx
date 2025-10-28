"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema, type LoginFormValues } from "@/lib/zodSchemas";
import { createClient } from "@/lib/superbase/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setGlobalError(null);

    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setGlobalError(error.message);
    } else {
      router.push("/profile/create");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <h1 className="text-xl font-semibold text-center">Sign in</h1>

      {globalError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded-md">
          {globalError}
        </p>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email</Label>
                <FormControl>
                  <Input id="email" placeholder="you@example.com" {...field} />
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
                <Label htmlFor="password">Password</Label>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      <p className="text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
