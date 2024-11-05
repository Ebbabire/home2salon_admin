import { Home, User } from "lucide-react";
import { AiOutlineProduct } from "react-icons/ai";
import { TbSettings } from "react-icons/tb";

export const navLinks = [
  { to: "/dashboard", title: "Dashboard", Icon: Home },
  { to: "/admins", title: "Admins", isBadge: true, Icon: User },
  { to: "/products", title: "Products", isBadge: true, Icon: AiOutlineProduct },
  { to: "/settings", title: "Settings", isBadge: true, Icon: TbSettings },
];
