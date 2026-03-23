import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import type { IconType } from "react-icons/lib"
import { NavLink, useLocation } from "react-router-dom"

interface NavItem {
  title: string
  url: string
  icon?: IconType
  isActive?: boolean
  items?: { title: string; url: string }[]
}

const NavMain = ({ items }: { items: NavItem[] }) => {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isTopActive = !item.items && pathname === item.url

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {!item.items ? (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isTopActive}
                    className="hover:!bg-accent hover:!text-primary"
                    asChild
                  >
                    <NavLink to={item.url}>
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "text-primary/60 group-hover/menu-item:text-primary",
                            isTopActive && "!text-white"
                          )}
                        />
                      )}
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="hover:!bg-accent hover:!text-primary"
                      >
                        {item.icon && (
                          <item.icon className="text-primary/60 group-hover/menu-item:text-primary" />
                        )}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto !text-sidebar-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubActive = pathname === subItem.url

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                isActive={isSubActive}
                                className="hover:!bg-accent hover:!text-primary"
                                asChild
                              >
                                <NavLink to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain
