"use server";

import { createClient } from "@/lib/superbase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signupSchema } from "@/lib/zodSchemas";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message }; // return first validation error

  const { error } = await supabase.auth.signUp(parsed.data);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/profile/create");
}
