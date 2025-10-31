"use server";

import { createClient } from "@/lib/superbase/server";
import {
  employmentInfoSchema,
  EmploymentInfoFormValues,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveEmploymentInfo(values: EmploymentInfoFormValues) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = employmentInfoSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: "Invalid data",
      issues: parsed.error.flatten(),
    };
  }

  const profileId = user.id;

  const { error: delErr } = await supabase
    .from("employment_experiences")
    .delete()
    .eq("profile_id", profileId);

  if (delErr) {
    console.error(delErr);
    return { error: "Failed to reset old employment records" };
  }

  const rows = parsed.data.experience.map((exp) => ({
    profile_id: profileId,
    company_name: exp.company_name,
    position_title: exp.position_title,
    city: exp.city,
    country: exp.country,
    start_date: exp.start_date,
    end_date: exp.currently_working ? null : exp.end_date || null,
    currently_working: exp.currently_working ?? false,
    responsibilities: exp.responsibilities,
  }));

  const { error: insertErr } = await supabase
    .from("employment_experiences")
    .insert(rows);

  if (insertErr) {
    console.error(insertErr);
    return { error: "Failed to save employment info" };
  }

  revalidatePath("/profile/create/employment-info");
  redirect("/profile/create/docs");
}

export async function getEmploymentInfo() {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) redirect("/login");

  // Fetch all employment experience entries for this user's profile
  const { data, error } = await supabase
    .from("employment_experiences")
    .select("*")
    .eq("profile_id", user.id)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("getEmploymentInfo error:", error);
    return [];
  }

  return data || [];
}
