import { NavLink } from "react-router-dom";

type NavLinkItemProps = {
  to: string;
  title: string;
  className?: string;
  //   badge?: number;
  //   isBadge?: boolean;
  Icon: any;
};

function NavLinkItem({
  to,
  className,
  //   isBadge,
  //   badge,
  Icon,
  title,
}: NavLinkItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 ${
          isActive ? "bg-muted text-primary" : null
        } rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary ${className}`
      }
    >
      <Icon className="h-4 w-4" />
      {title}
      {/* {isBadge ? (
        <Badge
          variant="destructive"
          className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        >
          {badge}
        </Badge>
      ) : null} */}
    </NavLink>
  );
}

export default NavLinkItem;
