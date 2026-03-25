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
      <SidebarHeader className="flex h-14 flex-row items-center border-b px-2 lg:h-[60px]">
        <SidebarMenu className="justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="font-bold tracking-tight text-primary data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                H2
              </span>
              <span className="text-base">Home2Salon</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navLinks} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex flex-col justify-center pb-[1px] text-[10px] text-muted-foreground">
            <span>Powered By</span>
            <a
              href="https://www.qemertech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground/80 transition-colors hover:text-primary"
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
