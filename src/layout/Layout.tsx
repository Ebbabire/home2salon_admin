import { Outlet } from "react-router-dom";

import Navbar from "./navbar/Navbar";
import { AppSidebar } from "./sidebar/Sidebar";

import { SidebarInset } from "@/components/ui/sidebar";

function Layout() {
  return (
    <>
      <AppSidebar />

      <SidebarInset>
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
}

export default Layout;
