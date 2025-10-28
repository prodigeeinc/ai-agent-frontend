import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Create a supabase client on the browser with project's credentials

  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(
    "Supabase KEY:",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.slice(0, 10) + "..."
  );

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
