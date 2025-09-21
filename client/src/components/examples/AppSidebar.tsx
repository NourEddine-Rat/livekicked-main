import { AppSidebar } from '../AppSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex-1 p-6 bg-background">
            <h2 className="text-xl font-semibold">Main Content Area</h2>
            <p className="text-muted-foreground mt-2">
              This shows how the sidebar looks with the main content area.
            </p>
          </div>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
}