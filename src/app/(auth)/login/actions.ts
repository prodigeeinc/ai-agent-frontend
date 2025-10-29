"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/superbase/server";
import { loginSchema } from "@/lib/zodSchemas";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/profile");
}
