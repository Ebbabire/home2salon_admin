import { SidebarTrigger } from "@/components/ui/sidebar"

import UserMenu from "./components/UserMenu"

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 py-3 backdrop-blur-md lg:h-[60px] lg:px-6">
      <SidebarTrigger />
      <UserMenu />
    </header>
  )
}

export default Navbar
