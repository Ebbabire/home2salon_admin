import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { SidebarTrigger } from "@/components/ui/sidebar";

import UserMenu from "./components/UserMenu";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/80 px-4 py-3 backdrop-blur-md lg:h-[60px] lg:px-6">
      <SidebarTrigger />
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none border-transparent bg-muted/50 pl-8 shadow-none transition-colors hover:bg-muted/80 focus-visible:border-input focus-visible:bg-background md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      <UserMenu />
    </header>
  );
}

export default Navbar;
