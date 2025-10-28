"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signupSchema, type SignupFormValues } from "@/lib/zodSchemas";
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

export function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    setGlobalError(null);

    const { error } = await supabase.auth.signUp(values);

    if (error) {
      setGlobalError(error.message);
    } else {
      router.push("/profile/create");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <h1 className="text-xl font-semibold text-center">Create an Account</h1>

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
                <Label>Email</Label>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
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
                <Label>Password</Label>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      </Form>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
