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

  return data || [];
}

/**
 * Delete a document (both from table and storage)
 */
export async function deleteDocument(filePath: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) redirect("/login");

  // Remove from table
  const { error: delDbErr } = await supabase
    .from("documents")
    .delete()
    .eq("file_path", filePath)
    .eq("profile_id", user.id);

  if (delDbErr) {
    console.error("Delete DB record error:", delDbErr);
    return { error: "Failed to delete record from database." };
  }

  // Remove from storage
  const { error: delStorageErr } = await supabase.storage
    .from("documents")
    .remove([filePath]);

  if (delStorageErr) {
    console.error("Delete storage file error:", delStorageErr);
    return { error: "Failed to delete file from storage." };
  }

  revalidatePath("/profile/create/documents");
  return { success: true, message: "Document deleted successfully." };
}
