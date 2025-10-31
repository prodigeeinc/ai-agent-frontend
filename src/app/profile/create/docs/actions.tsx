"use server";

import { createClient } from "@/lib/superbase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Save uploaded document metadata + upload file to Supabase Storage
 *
 * @param file - The uploaded File object (from client)
 * @param category - Category of the document (e.g., "transcript", "resume")
 */
export async function uploadDocument(file: File, category: string) {
  const supabase = await createClient();

  // 1️⃣ Get authenticated user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) redirect("/login");

  if (!file) {
    return { error: "No file provided." };
  }

  try {
    // 2️⃣ Build file path inside bucket
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // 3️⃣ Upload to Supabase Storage bucket "documents"
    const { error: uploadErr } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        upsert: false, // prevent overwriting files
      });

    if (uploadErr) {
      console.error("Storage upload error:", uploadErr);
      return { error: "Failed to upload file to storage." };
    }

    // 4️⃣ Insert metadata into public.documents
    const { error: insertErr } = await supabase.from("documents").insert({
      profile_id: user.id,
      category,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
    });

    if (insertErr) {
      console.error("Insert metadata error:", insertErr);
      return { error: "Failed to save document metadata." };
    }

    // 5️⃣ Optional: revalidate profile page cache
    revalidatePath("/profile/create/documents");
    return { success: true, message: "Document uploaded successfully." };
  } catch (err) {
    console.error("Unexpected error in uploadDocument:", err);
    return { error: "Unexpected error during upload." };
  }
}

/**
 * Fetch all documents for the logged-in user
 */
export async function getDocuments() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) redirect("/login");

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getDocuments error:", error);
    return [];
  }

  // 🔗 append public URL for each file
  const docsWithUrls =
    data?.map((doc) => {
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(doc.file_path);
      return { ...doc, publicUrl: urlData.publicUrl };
    }) ?? [];

  return docsWithUrls;
}

/**
 * Delete a document (both from table and storage)
 */
export async function deleteDocument(fileName: string, category: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const path = `${user.id}/${category}/${fileName}`;

  const { error } = await supabase.storage.from("documents").remove([path]);

  if (error) {
    console.error("Delete error:", error);
    return { error: error.message };
  }

  // Optionally remove from your documents table too:
  await supabase
    .from("documents")
    .delete()
    .eq("profile_id", user.id)
    .eq("category", category)
    .eq("file_name", fileName);

  return { success: true };
}
