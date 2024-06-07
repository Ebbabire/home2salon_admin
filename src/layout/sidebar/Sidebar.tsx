import { Link } from "react-router-dom";
import { Package2 } from "lucide-react";

import NavLinkItem from "./components/NavLinkItem";
import { navLinks } from "./data/nav-links";
import CollapsedNavLinkItem from "./components/CollapsedNavLinkItem";

function Sidebar({ screenSize }: { screenSize: number }) {
  return (
    <aside className="hidden min-h-screen border-r bg-muted/40 dark:border-muted-foreground/30 md:block">
      {screenSize >= 1280 ? (
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 dark:border-muted-foreground/30 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>Company Name</span>
            </Link>
            {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button> */}
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map(({ to, Icon, title }) => (
                <NavLinkItem key={title} to={to} title={title} Icon={Icon} />
              ))}
            </nav>
          </div>
        </div>
      ) : (
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
            </Link>
            {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button> */}
          </div>
          <div className="flex-1">
            <nav className="grid place-items-center items-center px-2 text-sm font-medium lg:px-4">
              {navLinks.map(({ to, Icon, title }) => (
                <CollapsedNavLinkItem
                  key={title}
                  to={to}
                  Icon={Icon}
                  title={title}
                />
              ))}
            </nav>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
