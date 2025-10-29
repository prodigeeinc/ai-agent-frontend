import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/AppSidebar";
import { createClient } from "@/lib/superbase/server";
import { redirect } from "next/navigation";

export default async function CreateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <div className="max-w-5xl mx-auto py-28">
      <SidebarProvider>
        <div className="flex">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main content area */}
          <div className="flex-1 p-3">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
