import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavLinkItemProps = {
  to: string;
  title: string;
  className?: string;
  //   badge?: number;
  //   isBadge?: boolean;
  Icon: any;
};

function CollapsedNavLinkItem({ to, Icon, title }: NavLinkItemProps) {
  return (
    <NavLink to={to} key={title}>
      {({ isActive }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`my-1 rounded-lg ${
                  isActive
                    ? "bg-muted-foreground/40 hover:bg-muted-foreground"
                    : "bg-muted hover:bg-muted-foreground/30"
                } transition-all duration-150`}
                aria-label="Playground"
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              {title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </NavLink>
  );
}

export default CollapsedNavLinkItem;
