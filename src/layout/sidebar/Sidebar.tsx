import NavMain from "./components/navMain";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { navLinks } from "./data/nav-links";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 flex-row border-b lg:h-[60px]">
        <SidebarMenu className="justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* logo */}
              <div className="flex w-full justify-center">
                {/* <img className="w-20" src={ALIBOLOGO} alt="Alibo logo" /> */}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navLinks} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex flex-col justify-center pb-[1px] text-[10px]">
            <span>Powered By</span>

            <a
              href="https://www.qemertech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400"
            >
              Qemer Software Technology
            </a>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
