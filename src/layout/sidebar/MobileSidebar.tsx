import { Menu, Package2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Link } from "react-router-dom";
import { navLinks } from "./data/nav-links";
import NavLinkItem from "./components/NavLinkItem";

function MobileSidbar() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-sm font-medium">
            <Link
              to="#"
              className="flex items-center gap-2 border-b pb-4 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span>Company Name</span>
            </Link>
            {navLinks.map(({ to, Icon, title }) => (
              <NavLinkItem key={title} to={to} title={title} Icon={Icon} />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MobileSidbar;
