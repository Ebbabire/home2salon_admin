import { Home, Package, ShoppingCart, Users } from "lucide-react";

export const navLinks = [
  { to: "/dashboard", title: "Dashboard", Icon: Home },
  { to: "/orders", title: "Orders", isBadge: true, Icon: ShoppingCart },
  { to: "/customers", title: "Customers", Icon: Users },
  { to: "/products", title: "Products", Icon: Package },
];
