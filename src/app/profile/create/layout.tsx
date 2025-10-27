import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/AppSidebar";

export default function CreateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
