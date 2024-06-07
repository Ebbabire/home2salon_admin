import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import { Admin } from "../Admins";

export default function AdminDetail({
  user,
  close,
}: {
  user: object | Admin;
  close: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {user?.firstName} {user?.lastName}
          </CardTitle>
          <CardDescription>{user?.role}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only top-0">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Deactivate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  className="hover:bg-red-500 px-8 border-red-500 border hover:text-white transition-all duration-150"
                >
                  Delete Admin
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-3 text-sm overflow-auto scrollbar-none">
        <div className="grid gap-3">
          <div className="font-semibold">User Address</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Phone Number</span>
              <span className="font-medium">0{user?.phoneNumber}</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <div className="font-semibold">User Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Registed At</span>
              <span className="font-medium">{user?.createdAt}</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Status</span>
              <span className="capitalize font-medium">{user?.status}</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <Button
          variant="ghost"
          className="hover:bg-red-500 px-12 border-red-500 border hover:text-white transition-all duration-150"
          onClick={close}
        >
          Close
        </Button>
      </CardFooter>
    </Card>
  );
}
