import {
  BiHome,
  BiUser,
  BiClipboard,
  BiCut,
  BiGroup,
  BiWallet,
  BiCog,
} from "react-icons/bi"

export const navLinks = [
  {
    url: "/dashboard",
    title: "Dashboard",
    icon: BiHome,
  },
  {
    title: "Orders",
    url: "#",
    icon: BiClipboard,
    items: [
      { url: "/orders/pending", title: "Pending" },
      { url: "/orders/assigned", title: "Assigned" },
      { url: "/orders/completed", title: "Completed" },
    ],
  },
  { url: "/services", title: "Services", icon: BiCut },
  { url: "/professionals", title: "Professionals", icon: BiGroup },
  { url: "/admins", title: "Admins", icon: BiUser },
  { url: "/wallet", title: "Wallet", icon: BiWallet },
  { url: "/settings", title: "Settings", icon: BiCog },
]
