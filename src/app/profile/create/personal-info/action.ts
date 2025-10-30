"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/superbase/server";
import { personalInfoSchema, PersonalInfoFormValues } from "@/lib/zodSchemas";
import { redirect } from "next/navigation";

export async function savePersonalInfo(values: PersonalInfoFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const parsed = personalInfoSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Invalid form data", issues: parsed.error.flatten() };
  }

  const data = parsed.data;

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      birth_country: data.birth_country,
      citizenship: data.citizenship,
      country_of_residence: data.country_of_residence,
      address_street: data.address_street,
      city: data.city,
      email: data.email,
      phone: data.phone,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error(error);
    return { error: "Failed to save profile" };
  }

  revalidatePath("/profile/create/personal-info");
  redirect("/profile/create/academic-info");
}
