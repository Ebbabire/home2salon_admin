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
import EditAdmin from "./edit-admin";

export default function AdminDetail({
  user,
  close,
}: {
  user: object | Admin;
  close: () => void;
}) {
  console.log(user);
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
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                <EditAdmin user={user} />
              </DropdownMenuItem>
              <DropdownMenuItem>Deactivate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  className="border border-red-500 px-8 transition-all duration-150 hover:bg-red-500 hover:text-white"
                >
                  Delete Admin
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto p-3 text-sm scrollbar-none">
        <div className="flex flex-col gap-3">
          <div className="font-semibold">User Address</div>
          <ul className="flex flex-col gap-3">
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
          <ul className="flex flex-col gap-3">
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Registed At</span>
              <span className="font-medium">{user?.createdAt}</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize">{user?.status}</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <Button
          variant="ghost"
          className="border border-red-500 px-12 transition-all duration-150 hover:bg-red-500 hover:text-white"
          onClick={close}
        >
          Close
        </Button>
      </CardFooter>
    </Card>
  );
}
