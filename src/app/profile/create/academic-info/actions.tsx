"use server";

import { createClient } from "@/lib/superbase/server";
import { academicInfoSchema, AcademicInfoFormValues } from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveAcademicInfo(values: AcademicInfoFormValues) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Validate incoming data
  const parsed = academicInfoSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: "Invalid data",
      issues: parsed.error.flatten(),
    };
  }

  const academicEntries = parsed.data.education.map((edu) => ({
    user_id: user.id,
    university_name: edu.university_name,
    city: edu.city,
    country: edu.country,
    level_of_study: edu.level_of_study,
    major: edu.major,
    gpa: edu.gpa,
    start_date: edu.start_date,
    end_date: edu.end_date,
    honors: edu.honors || null,
    updated_at: new Date().toISOString(),
  }));

  // Clear existing records for this user first (optional but clean UX)
  await supabase.from("academic_info").delete().eq("user_id", user.id);

  // Insert new data
  const { error } = await supabase
    .from("academic_info")
    .insert(academicEntries);

  if (error) {
    console.error(error);
    return { error: "Failed to save academic info" };
  }

  revalidatePath("/profile/create/academic-info");
  redirect("/profile/create/employment-info");
}
